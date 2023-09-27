const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const {
  inputChecks,
  generateUserID,
  throwError,
  privilegeChecks,
} = require('../helper')

const insertEmployeeSQL = `INSERT INTO employee (employee_id, employee_name, employee_username, employee_password, employee_create_id, employee_create_ip, employee_update_id, employee_update_ip, employee_note, employee_status) VALUES (?,?,?,?,?,?,?,?,?,?)`
const insertHEmployeeSQL = `INSERT INTO h_employee (h_employee_id, h_employee_name, h_employee_username, h_employee_create_id, h_employee_create_ip, h_employee_update_id, h_employee_update_ip, h_employee_note, h_employee_status, FK_employee_id) VALUES (?,?,?,?,?,?,?,?,?,?)`
const updateHEmployeeSQL = `UPDATE h_employee SET h_employee_name=?, h_employee_username=?, h_employee_update_id=?, h_employee_date=?, h_employee_update_ip=?, h_employee_note=?, h_employee_status=? WHERE FK_employee_id=? AND h_employee_status = 1`
const updateEmployeeSQL = `UPDATE employee SET employee_name=?, employee_password=?, employee_update_ip=?, employee_update_date=?, employee_note=?, employee_status=? WHERE employee_id=?`
const insertEmployeePrivilegeSQL = `INSERT INTO employee_privilege (employee_privilege_id, employee_privilege_create_id, employee_privilege_create_ip, employee_privilege_update_id, employee_privilege_update_ip, employee_privilege_note, employee_privilege_status, FK_employee_id, FK_privilege_id) VALUES (?,?,?,?,?,?,?,?,?)`

// Get Employee
router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()
  try {
    const query = `SELECT e.*, h_employee_id as employee_history_id FROM employee e join h_employee h on h.FK_employee_id = e.employee_id WHERE employee_status = 1 AND h_employee_status = 1 ${
      req.params.id ? `AND employee_id = '${req.params.id}'` : ''
    }`
    const [rows] = await connection.query(query)

    for (let i = 0; i < rows.length; i++) {
      const employee = rows[i]
      const [privileges] = await connection.query(
        `select p.* from privilege p join employee_privilege e on p.privilege_id = e.FK_privilege_id where e.FK_employee_id = '${employee.employee_id}'`
      )
      employee.employee_privileges = privileges
    }
    retVal.data = rows
    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

// Insert Employee
router.post('/create', async (req, res, next) => {
  const retVal = {
    status: 201,
  }
  const requiredInputs = ['name', 'username', 'password']
  const requiredPrivileges = ['buat pegawai']

  const connection = await db.getConnection()
  try {
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)
    inputChecks(requiredInputs, req.body)

    const { name, username, password, note, privileges } = req.body
    const ip = req.ip

    const [employees] = await connection.query(
      `SELECT * FROM employee where employee_username = '${username}'`
    )
    if (employees.length !== 0) {
      // Jika username sudah digunakan
      throwError(400, 'Username sudah digunakan', 'username')
    }

    // Jika unique, create user
    await connection.beginTransaction()
    const employeeId = await generateUserID(connection, 'employee', 'E')
    await connection.query(insertEmployeeSQL, [
      employeeId,
      name,
      username,
      await bcrypt.hash(password, 10),
      req.loggedEmployee.employee_id,
      ip,
      req.loggedEmployee.employee_id,
      ip,
      note ? note : null,
      true,
    ])

    const h_employeeId = await generateUserID(connection, 'h_employee', 'HE')

    await connection.query(insertHEmployeeSQL, [
      h_employeeId,
      name,
      username,
      req.loggedEmployee.employee_id,
      ip,
      req.loggedEmployee.employee_id,
      ip,
      note ? note : null,
      true,
      employeeId
    ])

    const userPrivileges = []
    const isArray = Array.isArray(privileges)
    for (let i = 0; i < (isArray ? privileges.length : 1); i++) {
      const privilege = isArray ? privileges[i] : privileges
      const [rows] = await connection.query(
        `SELECT * FROM privilege WHERE privilege_id = '${privilege}'`
      )

      if (rows.length === 0) {
        throwError(400, 'Privileges tidak valid', '', true)
      }
      userPrivileges.push(rows[0])
    }

    // Insert user_privilege
    for (let i = 0; i < (isArray ? privileges.length : 1); i++) {
      const privilege = isArray ? privileges[i] : privileges

      // Creating IDs
      const employeePrivilegeid = await generateUserID(
        connection,
        'employee_privilege',
        'EP'
      )

      await connection.query(insertEmployeePrivilegeSQL, [
        employeePrivilegeid,
        req.loggedEmployee.employee_id,
        ip,
        req.loggedEmployee.employee_id,
        ip,
        null,
        1,
        employeeId,
        privilege,
      ])
    }
    await connection.commit()

    const [selectedEmployee] = await connection.query(
      'SELECT e.*, h_employee_id as employee_history_id FROM employee e join h_employee h on h.FK_employee_id = e.employee_id WHERE employee_status = 1 AND h_employee_status = 1 AND employee_id=?',
      employeeId
    )

    retVal.data = {
      ...selectedEmployee[0],
      employee_privileges: userPrivileges,
    }

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    await connection.rollback()
    connection.destroy()
    return next(error)
  }
})

router.put('/change-password', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const requiredInputs = ['password']

  const connection = await db.getConnection()
  try {
    inputChecks(requiredInputs, req.body)
    const { password } = req.body

    const cryptedPass = await bcrypt.hash(password, 10)

    await connection.query(
      'UPDATE employee SET employee_password = ?, employee_update_id=?, employee_update_date=?, employee_update_ip=? WHERE employee_id = ?',
      [
        cryptedPass,
        req.loggedEmployee.employee_id,
        new Date(),
        req.ip,
        req.loggedEmployee.employee_id,
      ]
    )

    retVal.data = cryptedPass

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

// Update Employee
router.put('/update/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredPrivileges = ['perbarui pegawai']

  const connection = await db.getConnection()
  try {
    console.log("try updating employee")

    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)

    const { name, password, note, privileges } = req.body
    const ip = req.ip
    console.log("taking variable from client side")

    await connection.beginTransaction()
    console.log("connection beginTransaction done")

    const [employee] = await connection.query(
      `SELECT * FROM employee where employee_id = '${req.params.id}' AND employee_status = 1`
    )

    if (employee.length === 0) {
      // Jika id salah
      throwError(404, 'ID tidak ditemukan', '', true)
    }

    console.log(`Password = ${password}`)

    await connection.query(updateEmployeeSQL, [
      name,
      password
        ? await bcrypt.hash(password, 10)
        : employee[0].employee_password,
      ip,
      new Date(),
      note ? note : employee[0].employee_note,
      true,
      req.params.id,
    ])
    console.log("Update Employee done")

    // Update or Create history

    const [history] = await connection.query(
      `SELECT * FROM h_employee where FK_employee_id = '${req.params.id}' AND h_employee_status = 1`
    )

    const hEmployee = history[0]

    if (hEmployee.h_employee_status === 1) {
      await connection.query(
        `UPDATE h_employee SET h_employee_status = 0 WHERE FK_employee_id = '${req.params.id}'`
      )
      console.log("Update h_employee done")

      const h_employeeId = await generateUserID(connection, 'h_employee', 'HE')
      console.log("generateUserID done")

      await connection.query(insertHEmployeeSQL, [
        h_employeeId,
        name ? name : employee[0].employee_name,
        employee[0].employee_username,
        req.loggedEmployee.employee_id,
        ip,
        req.loggedEmployee.employee_id,
        ip,
        note ? note : employee[0].employee_note,
        true,
        req.params.id,
      ])

      console.log("insert into History done")

    } else {
      await connection.query(updateHEmployeeSQL, [
        name ? name : employee[0].employee_name,
        employee[0].employee_username,
        req.loggedEmployee.employee_id,
        new Date(),
        ip,
        note ? note : null,
        true,
        req.params.id,
      ])
    }

    await connection.query(updateEmployeeSQL, [
      name,
      password
        ? await bcrypt.hash(password, 10)
        : employee[0].employee_password,
      ip,
      new Date(),
      note ? note : employee[0].employee_note,
      true,
      req.params.id,
    ])
    console.log("update Employee Done")

    // get employee privileges
    const [userPrivileges] = await connection.query(
      `select e.* from privilege p join employee_privilege e on p.privilege_id = e.FK_privilege_id where e.FK_employee_id = '${req.params.id}'`
    )

    // const employeePrivileges = employeePrivilegesQuery.map((privilege) => {
    //   return {
    //     id: privilege.employee_privilege_id,
    //     privilegeId: privilege.FK_privilege_id,
    //     status: privilege.employee_privilege_status,
    //   }
    // })

    // for (let i = 0; i < employeePrivileges.length; i++) {
    //   const employeePrivilege = employeePrivileges[i]

    //   const found = privileges.find(
    //     (privilege) => privilege === employeePrivilege.privilegeId
    //   )
    //   if (!found)
    //     userPrivileges.push({
    //       id: employeePrivilege.privilegeId,
    //       type: 'delete',
    //     })
    // }

    console.log("start Check input privilege")
    // Check if input privileges is valid
    const isArray = Array.isArray(privileges)
    const endPrivileges = []
    for (let i = 0; i < (isArray ? privileges.length : 1); i++) {
      const privilege = isArray ? privileges[i] : privileges
      const [rows] = await connection.query(
        `SELECT * FROM privilege WHERE privilege_id = '${privilege}'`
      )

      if (rows.length === 0) {
        throwError(400, 'Privileges tidak valid.', '', true)
      }

      let actionType = 'insert'

      if(privilege!=undefined){
        const found = userPrivileges.find(
          (employeePrivilege) => employeePrivilege.FK_privilege_id == privilege
        )

        if (found) {
          actionType = '-'
          if (found.employee_privilege_status === 0) {
            actionType = 'update'
          }
        }

        endPrivileges.push({
          id: privilege,
          type: actionType,
        })
      }
    }

    for (var i = 0; i < userPrivileges.length; i++) {
      const privilege = isArray ? privileges[i] : privileges

      console.log("------------------------------------------------")
      console.log(privilege)
      console.log("------------------------------------------------")

      if(privilege != undefined){
        const found = Array.from(privilege).find(
          (privilege) => privilege == userPrivileges[i].FK_privilege_id
        ) || privilege == userPrivileges[i].FK_privilege_id

        if (!found) {
          endPrivileges.push({
            id: userPrivileges[i].FK_privilege_id,
            type: 'delete',
          })
        }
      }
    }

    console.log("update or insert employee_privilege")
    // Update or insert employee_privilege
    for (let i = 0; i < endPrivileges.length; i++) {
      const privilege = endPrivileges[i]
      if (privilege.type === 'insert') {
        const id = await generateUserID(connection, 'employee_privilege', 'EP')

        console.log(`employeePrivilegeId = ${id}`)

        await connection.query(insertEmployeePrivilegeSQL, [
          id,
          req.loggedEmployee.employee_id,
          ip,
          req.loggedEmployee.employee_id,
          ip,
          null,
          1,
          req.params.id,
          privilege.id,
        ])
      } else if (privilege.type === 'update') {
        await connection.query(
          `UPDATE employee_privilege SET employee_privilege_status = 1, employee_privilege_update_date=? WHERE FK_privilege_id = '${privilege.id}' and FK_employee_id = '${req.params.id}'`,
          new Date()
        )
      } else if (privilege.type === 'delete') {
        await connection.query(
          `UPDATE employee_privilege SET employee_privilege_status = 0, employee_privilege_update_date=? WHERE FK_privilege_id = '${privilege.id}' and FK_employee_id = '${req.params.id}'`,
          new Date()
        )
      }
    }

    await connection.commit()

    const [selectedEmployee] = await connection.query(
      'SELECT e.*, h_employee_id as employee_history_id FROM employee e join h_employee h on h.FK_employee_id = e.employee_id WHERE employee_status = 1 AND h_employee_status = 1 AND employee_id=?',
      req.params.id
    )

    const [retPrivileges] = await connection.query(
      `select p.* from privilege p join employee_privilege e on p.privilege_id = e.FK_privilege_id where e.FK_employee_id = '${req.params.id}' and employee_privilege_status = 1`
    )

    retVal.data = {
      ...selectedEmployee[0],
      employee_privileges: retPrivileges,
    }

    console.log(retPrivileges)

    connection.destroy()

    return res.status(retVal.status).json(retVal)
  } catch (error) {
    await connection.rollback()
    connection.destroy()
    return next(error)
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredPrivileges = ['hapus pegawai']

  const connection = await db.getConnection()

  try {
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)

    const [rows] = await connection.query(
      `SELECT * FROM employee WHERE employee_id = '${req.params.id}'`
    )

    if (rows.length === 0) {
      throwError(400, 'ID tidak ditemukan', '', true)
    }

    await connection.query(
      `UPDATE employee SET employee_status = 0 WHERE employee_id = '${req.params.id}'`
    )

    await connection.query(
      `UPDATE h_employee SET h_employee_status = 0 WHERE FK_employee_id = '${req.params.id}'`
    )

    const [deletedEmployee] = await connection.query(
      `SELECT * FROM employee WHERE employee_id = '${req.params.id}'`
    )

    const [history] = await connection.query(
      `SELECT h_employee_id FROM h_employee WHERE FK_employee_id = '${req.params.id}' order by h_employee_update_date desc limit 1`
    )

    deletedEmployee[0].employee_history_id = history[0].h_employee_id

    retVal.data = deletedEmployee[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

module.exports = router
