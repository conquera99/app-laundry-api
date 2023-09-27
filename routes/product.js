const express = require('express')
const router = express.Router()
const db = require('../db')
const { inputChecks, generateUserID, privilegeChecks } = require('../helper')

const insertProductSQL = `INSERT INTO product
(product_id, product_name, product_type, product_price, product_brand,
 product_stock, product_category, product_create_id, product_create_ip,
 product_update_id, product_update_ip, product_note, product_status)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
`

const insertHProductSQL = `INSERT INTO h_product
(h_product_id, h_product_name, h_product_type, h_product_price, h_product_brand, h_product_category, h_product_create_id, h_product_create_ip,
 h_product_update_id, h_product_update_ip, h_product_update_date, h_product_note, h_product_status, FK_product_id)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`

const updateProductSQL = `UPDATE product SET product_name=?, product_type=?, product_price=?,
product_brand=?, product_stock=?, product_category=?, product_update_id=?, product_update_ip=?,
product_update_date=?, product_note=?, product_status=?
WHERE product_id=?
`

const updateHProductSQL = `UPDATE h_product SET
h_product_name=?, h_product_type=?, h_product_price=?, h_product_brand=?, h_product_category=?,
 h_product_update_id=?, h_product_update_ip=?, h_product_update_date=?, h_product_note=?, h_product_status=? WHERE h_product_id=?
`

router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()
  try {
    const query = `SELECT p.*, h_product_id as product_history_id FROM product p join h_product h on product_id = FK_product_id WHERE product_status = 1 AND h_product_status = 1${
      req.params.id ? ` AND product_id = '${req.params.id}'` : ''
    }`
    const [products] = await connection.query(query)

    retVal.data = products

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

router.get('/history/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()
  try {
    const query = `SELECT * FROM h_product WHERE h_product_status = 1 ${
      req.params.id ? ` AND FK_product_id = '${req.params.id}'` : ''
    }`

    const [rows] = await connection.query(query)

    retVal.data = rows

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

  const requiredInputs = ['name', 'type', 'price', 'stock', 'category']
  const requiredPrivileges = ['buat product']

  const connection = await db.getConnection()
  try {
    console.log('priv', req.loggedPrivileges);
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)
    inputChecks(requiredInputs, req.body)

    const { name, type, price, brand, stock, category, note } = req.body
    const create_ip = req.ip

    // Creating ID String
    const id = await generateUserID(connection, 'product', 'P')

    // Inserting data to Product Table
    await connection.query(insertProductSQL, [
      id,
      name,
      type,
      price,
      brand ? brand : null,
      stock,
      category,
      req.loggedEmployee.employee_id,
      create_ip,
      req.loggedEmployee.employee_id,
      create_ip,
      note ? note : null,
      1,
    ])

    const h_id = await generateUserID(connection, 'h_product', 'HP')

    // Inserting data to h_Product Table
    await connection.query(insertHProductSQL, [
      h_id,
      name,
      type,
      price,
      brand ? brand : null,
      category,
      req.loggedEmployee.employee_id,
      create_ip,
      req.loggedEmployee.employee_id,
      create_ip,
      new Date(),
      note ? note : null,
      1,
      id,
    ])

    //Select created Product for return Value
    const [createdProduct] = await connection.query(
      `SELECT * FROM product WHERE product_id = '${id}'`
    )

    createdProduct[0].product_history_id = h_id

    retVal.data = createdProduct[0]

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

  const connection = await db.getConnection()
  try {

    const { name, type, price, brand, stock, category, note } = req.body

    const ip = req.ip

    const [oldProduct] = await connection.query(
      `SELECT * FROM product WHERE product_id=?`,
      req.params.id
    )

    if (oldProduct[0].product_type == 'jasa'){
      privilegeChecks(
        req.loggedPrivileges,
        ['perbarui jasa'],
        req.loggedIsAdmin
      )
    }
    else if (oldProduct[0].product_type == 'produk'){
      privilegeChecks(
        req.loggedPrivileges,
        ['perbarui produk'],
        req.loggedIsAdmin
      )
    }

    // Creating ID String
    const updateId = await generateUserID(connection, 'product', 'P')

    //updating data
    await connection.query(updateProductSQL, [
      name ? name : oldProduct[0].product_name,
      type ? type : oldProduct[0].product_type,
      price ? price : oldProduct[0].product_price,
      brand ? brand : oldProduct[0].product_brand,
      stock ? stock : oldProduct[0].product_stock,
      category ? category : oldProduct[0].product_category,
      updateId,
      ip,
      new Date(),
      note ? note : oldProduct[0].product_note,
      1,
      req.params.id,
    ])

    // Check if h_product hasn't been used
    const [histories] = await connection.query(
      `SELECT * FROM h_product WHERE FK_product_id = '${req.params.id}' AND h_product_status = 1`
    )

    const historyProduct = histories[0]

    let historyId = historyProduct.h_product_id

    const h_id = await generateUserID(connection, 'h_product', 'HP')

    if (historyProduct.h_product_used === 1) {
      // Set h_product status to 0
      await connection.query(
        `UPDATE h_product SET h_product_status = 0 WHERE FK_product_id = '${req.params.id}'`
      )

      await connection.query(insertHProductSQL, [
        h_id,
        name ? name : oldProduct[0].product_name,
        type ? type : oldProduct[0].product_type,
        price ? price : oldProduct[0].product_price,
        brand ? brand : oldProduct[0].product_brand,
        category ? category : oldProduct[0].product_category,
        req.loggedEmployee.employee_id,
        ip,
        req.loggedEmployee.employee_id,
        ip,
        new Date(),
        note ? note : oldProduct[0].product_note,
        1,
        req.params.id,
      ])

      historyId = h_id
    } else {
      await connection.query(updateHProductSQL, [
        name ? name : oldProduct[0].product_name,
        type ? type : oldProduct[0].product_type,
        price ? price : oldProduct[0].product_price,
        brand ? brand : oldProduct[0].product_brand,
        category ? category : oldProduct[0].product_category,
        req.loggedEmployee.employee_id,
        ip,
        new Date(),
        note ? note : oldProduct[0].product_note,
        1,
        historyId,
      ])
    }

    const [updatedProduct] = await connection.query(
      `SELECT * FROM product WHERE product_id=?`,
      req.params.id
    )

    updatedProduct[0].product_history_id = historyId

    retVal.data = updatedProduct[0]

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

  const connection = await db.getConnection()
  try {
    const [products] = await connection.query(
      `SELECT * FROM product WHERE product_id = '${req.params.id}'`
    )

    if (products[0].product_type == 'jasa')
      privilegeChecks(
        req.loggedPrivileges,
        ['perbarui jasa'],
        req.loggedIsAdmin
      )
    else if (products[0].product_type == 'produk')
      privilegeChecks(
        req.loggedPrivileges,
        ['perbarui produk'],
        req.loggedIsAdmin
      )

    await connection.query(
      `UPDATE product SET product_status = 0 WHERE product_id = '${req.params.id}'`
    )

    await connection.query(
      `UPDATE h_product SET h_product_status = 0 WHERE FK_product_id = '${req.params.id}'`
    )

    const [deletedProduct] = await connection.query(
      `SELECT * FROM product WHERE product_id = '${req.params.id}'`
    )

    retVal.data = deletedProduct[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    connection.destroy()
    return next(error)
  }
})

module.exports = router
