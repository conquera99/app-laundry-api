const express = require('express')
const router = express.Router()
const db = require('../db')
const { inputChecks, generateUserID, privilegeChecks } = require('../helper')

const insertCustomerSQL = `INSERT INTO customer
(customer_id, customer_name, customer_phone_number, customer_email,
  customer_address, customer_create_id, customer_create_ip,
  customer_update_id, customer_update_ip, customer_note,
  customer_status) VALUES (?,?,?,?,?,?,?,?,?,?,?)
`

const insertHCustomerSQL = `INSERT INTO h_customer
(h_customer_id, h_customer_name, h_customer_phone_number, h_customer_email,
  h_customer_address, h_customer_create_id, h_customer_create_ip,
  h_customer_update_id, h_customer_update_ip, h_customer_note,
  h_customer_status, FK_customer_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
`

const updateCustomerSQL = `UPDATE customer SET customer_name=?, customer_phone_number=?, customer_email=?, customer_address=?, customer_update_id=?, customer_update_ip=?, customer_note=?, customer_status=? WHERE customer_id=?`
const updateHCustomerSQL = `UPDATE h_customer SET h_customer_name=?, h_customer_phone_number=?, h_customer_email=?, h_customer_address=?, h_customer_update_ip=?, h_customer_update_date=?, h_customer_note=?, h_customer_status=? WHERE FK_customer_id=? AND h_customer_status = 1`

router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()
  try {
    const query = `SELECT c.*, h_customer_id as customer_history_id FROM customer c join h_customer h on c.customer_id = h.FK_customer_id WHERE customer_status = 1 AND h_customer_status = 1 ${
      req.params.id ? `AND customer_id = '${req.params.id}'` : ''
    }`
    const [customers] = await connection.query(query)

    retVal.data = customers
    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

router.post('/create', async (req, res, next) => {
  const retVal = {
    status: 201,
  }
  const requiredInputs = ['name', 'phone_number', 'email', 'address']
  const requiredPrivileges = ['buat customer']

  const connection = await db.getConnection()
  try {
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)
    inputChecks(requiredInputs, req.body)

    const { name, phone_number, email, address, note } = req.body
    const ip = req.ip

    const id = await generateUserID(connection, 'customer', 'C')

    // Inserting
    await connection.query(insertCustomerSQL, [
      id,
      name,
      phone_number,
      email,
      address,
      req.loggedEmployee.employee_id,
      ip,
      req.loggedEmployee.employee_id,
      ip,
      note ? note : null,
      1,
    ])

    const h_id = await generateUserID(connection, 'h_customer', 'HC')

    // Inserting h_customer

    console.log(insertHCustomerSQL)

    await connection.query(insertHCustomerSQL, [
      h_id,
      name,
      phone_number,
      email,
      address,
      req.loggedEmployee.employee_id,
      ip,
      req.loggedEmployee.employee_id,
      ip,
      note ? note : null,
      1,
      id,
    ])

    // Select created customer for return value
    const [createdCustomer] = await connection.query(
      `select c.*, h_customer_id as customer_history_id from customer c join h_customer h on h.FK_customer_id = c.customer_id where customer_id='${id}' and h_customer_status = 1`
    )

    retVal.data = createdCustomer[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

router.put('/update/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredInputs = ['name', 'phone_number', 'email', 'address', 'status']
  const requiredPrivileges = ['perbarui customer']

  const connection = await db.getConnection()
  try {
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)
    inputChecks(requiredInputs, req.body)

    const { name, phone_number, email, address, note } = req.body
    const ip = req.ip

    const [oldCustomer] = await connection.query(
      `SELECT * FROM customer WHERE customer_id=?`,
      req.params.id
    )

    // updating
    await connection.query(updateCustomerSQL, [
      name,
      phone_number,
      email,
      address,
      req.loggedEmployee.employee_id,
      ip,
      note ? note : oldCustomer.customer_note,
      true,
      req.params.id,
    ])

    const [history] = await connection.query(
      `SELECT * FROM h_customer where FK_customer_id = '${req.params.id}' AND h_customer_status = 1`
    )

    const[customers] = await connection.query(
      `SELECT * FROM customer where customer_id = '${req.params.id}'`
    )

    const hCustomer = history[0]

    if (hCustomer.h_customer_used === 1) {
      await connection.query(
        `UPDATE h_customer SET h_customer_status = 0 WHERE FK_customer_id = '${req.params.id}'`
      )

      const h_customerId = await generateUserID(connection, 'h_customer', 'HE')
      await connection.query(insertHCustomerSQL, [
        h_customerId,
        name ? name : customers[0].customer_name,
        customers[0].customer_phone_number,
        customers[0].customer_email,
        customers[0].customer_address,
        req.loggedEmployee.customer_id,
        ip,
        req.loggedEmployee.customer_id,
        ip,
        note ? note : customers[0].customer_note,
        true,
        req.params.id,
      ])
    } else {
      await connection.query(updateHCustomerSQL, [
        name ? name : customers[0].customer_name,
        customers[0].customer_phone_number,
        customers[0].customer_email,
        customers[0].customer_address,
        ip,
        new Date(),
        note ? note : null,
        true,
        req.params.id,
      ])
    }

    // Select created customer for return value
    const [customer] = await connection.query(
      `SELECT e.*, h_customer_id as customer_history_id FROM customer e join h_customer h on h.FK_customer_id = e.customer_id WHERE customer_status = 1 AND h_customer_status = 1 AND customer_id=?`,
      req.params.id
    )

    retVal.data = customer[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }
  const requiredPrivileges = ['hapus customer']

  const connection = await db.getConnection()
  try {
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)

    await connection.query(
      `UPDATE customer SET customer_status = 0 WHERE customer_id = '${req.params.id}'`
    )

    await connection.query(
      `UPDATE h_customer SET h_customer_status = 0 WHERE FK_customer_id = '${req.params.id}'`
    )

    const [deletedCustomer] = await connection.query(
      `SELECT * FROM customer WHERE customer_id = '${req.params.id}'`
    )

    const [history] = await connection.query(
      `SELECT h_customer_id FROM h_customer WHERE FK_customer_id = '${req.params.id}' order by h_customer_update_date desc limit 1`
    )

    deletedCustomer[0].customer_history_id = history[0].h_customer_id

    retVal.data = deletedCustomer[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})
module.exports = router
