const express = require('express')
// const cloudinary = require('cloudinary')
const router = express.Router()
const db = require('../db')
const {
  inputChecks,
  generateUserID,
  throwError,
  privilegeChecks,
} = require('../helper')

const insertHTransactionSQL = `INSERT INTO h_trans
(h_trans_id, h_trans_main_photo, h_trans_main_note,
  h_trans_top_photo, h_trans_top_note, h_trans_left_photo,
  h_trans_left_note, h_trans_right_photo, h_trans_right_note,
  h_trans_below_photo, h_trans_below_note, h_trans_total,
  h_trans_create_id, h_trans_create_ip,
  h_trans_update_id, h_trans_update_ip, h_trans_progress,
  h_trans_note, h_trans_status, FK_h_customer_id, FK_h_promo_id)
  VALUES
  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`

const insertDTransSQL = `INSERT INTO d_trans (d_trans_id, d_trans_create_id, d_trans_create_ip, d_trans_update_id, d_trans_update_ip, d_trans_note, d_trans_quantity, d_trans_subtotal, d_trans_estimation, d_trans_status, FK_h_product_id, FK_h_trans_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`

//  const insertDTransactionSQL =

router.get('/get/:id?', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()
  try {
    const headerQuery = `SELECT * FROM h_trans WHERE h_trans_status = 1 ${
      req.params.id ? ` AND h_trans_id = '${req.params.id}'` : ''
    }`

    console.log("Header Query = " + headerQuery)

    const [headerRows] = await connection.query(headerQuery)

    console.log("===================================================")
    for (let i = 0; i < headerRows.length; i++) {
      console.log("i = " + i)
      const header = headerRows[i]

      // products
      const productQuery = `SELECT h.*, d.d_trans_quantity FROM d_trans d join h_product h on h.h_product_id = d.FK_h_product_id  WHERE h_product_type = 'produk' AND d_trans_status = 1 AND FK_h_trans_id = '${header.h_trans_id}'`
      const [productRows] = await connection.query(productQuery)
      header.h_trans_products = productRows

      // jasa
      const jasaQuery = `SELECT h.*, e.*,d.d_trans_estimation, d.d_trans_done FROM d_trans d join h_product h on h.h_product_id = d.FK_h_product_id left join h_employee e on e.h_employee_id = d.FK_h_employee_id WHERE h_product_type = 'jasa' AND d_trans_status = 1 AND FK_h_trans_id = '${header.h_trans_id}'`
      const [jasaRows] = await connection.query(jasaQuery)
      header.h_trans_jasas = jasaRows

      // customer
      const customerQuery = `SELECT c.* FROM h_trans h join h_customer c on h.FK_h_customer_id = c.h_customer_id where h_trans_id =  '${header.h_trans_id}'`
      const [customerRows] = await connection.query(customerQuery)
      header.h_trans_customer = customerRows[0]

      // promo
      const promoQuery = `SELECT p.* FROM h_trans h join h_promo p on h.FK_h_promo_id = p.h_promo_id where h_trans_id = '${header.h_trans_id}'`
      const [promoRows] = await connection.query(promoQuery)
      header.h_trans_promo = promoRows.length > 0 ? promoRows[0] : null

      console.log(headerRows)
      console.log("-------------------------------------------------------")
    }

    console.log("===================================================")

    retVal.data = headerRows
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

  const requiredInputs = ['total', 'customer_id']
  const requiredPrivileges = ['buat transaksi']

  const connection = await db.getConnection()

  try {
    privilegeChecks(req.loggedPrivileges, requiredPrivileges, req.loggedIsAdmin)
    inputChecks(requiredInputs, req.body)

    const {
      images,
      imageNotes,
      total,
      note,
      customer_id,
      promo_id,
      product_list,
      jasa_list,
      progress,
    } = req.body

    if(product_list == undefined && jasa_list == undefined){
      if (product_list.length === 0 && jasa_list.length === 0) {
        throwError(
          400,
          `Input ada yang kurang: [${['product_list', 'jasa_list'].join(',')}].`,
          '',
          true
        )
      }
    }


    const ip = req.ip

    await connection.beginTransaction()

    const hTransId = await generateUserID(connection, 'h_trans', 'T')

    // insert H_trans
    await connection.query(insertHTransactionSQL, [
      hTransId,
      images[0],
      imageNotes[0],
      images[1],
      imageNotes[1],
      images[2],
      imageNotes[2],
      images[3],
      imageNotes[3],
      images[4],
      imageNotes[4],
      total,
      req.loggedEmployee.employee_id,
      ip,
      req.loggedEmployee.employee_id,
      ip,
      progress ? progress : 0,
      note ? note : null,
      1,
      customer_id,
      promo_id ? promo_id : null,
    ])
    // Insert D_trans
    if (product_list) {
      for (let i = 0; i < product_list.length; i++) {
        const product = product_list[i]

        const dTransId = await generateUserID(connection, 'd_trans', 'D')
        await connection.query(insertDTransSQL, [
          dTransId,
          req.loggedEmployee.employee_id,
          ip,
          req.loggedEmployee.employee_id,
          ip,
          note ? note : null,
          parseInt(product.qty),
          parseInt(product.subtotal),
          0,
          1,
          product.id,
          hTransId,
        ])

        const [productRows] = await connection.query(
          'SELECT p.* from product p join h_product h on h.FK_product_id = p.product_id WHERE h_product_id = ? AND h_product_status = 1',
          product.id
        )

        console.log(productRows)

        const tempQty = productRows[0].product_stock - product.qty
        const productId = productRows[0].product_id

        await connection.query(
          `UPDATE product SET product_stock = ${tempQty} WHERE product_id = '${productId}'`
        )
      }
    }

    if (jasa_list) {
      for (let i = 0; i < jasa_list.length; i++) {
        const jasa = jasa_list[i]

        const dTransId = await generateUserID(connection, 'd_trans', 'D')

        //console.log(`dTransId = ${dTransId}, employee_id = ${req.loggedEmployee.employee_id}, ip = ${ip}, note = ${note}, jasa.subtotal = ${jasa.subtotal}, jasa.estimation = ${jasa.estimation}, jasa.id = ${jasa.id}, hTransId = ${hTransId}`)

        await connection.query(insertDTransSQL, [
          dTransId,
          req.loggedEmployee.employee_id,
          ip,
          req.loggedEmployee.employee_id,
          ip,
          note ? note : null,
          1,
          parseInt(jasa.subtotal),
          parseInt(jasa.estimation),
          1,
          jasa.id,
          hTransId,
        ])

        const [jasaRows] = await connection.query(
          'SELECT p.* from product p join h_product h on h.FK_product_id = p.product_id WHERE h_product_id = ? AND h_product_status = 1',
          jasa.id
        )

        console.log(jasaRows)

        await connection.query(
          'UPDATE product SET product_stock = ? WHERE product_id = ?',
          [jasaRows[0].product_stock - 1, jasaRows[0].product_id]
        )
      }
    }

    // throwError(404, 'In Construction')

    // Select created h_trans and d_trans like in /get endpoint
    const headerQuery = `SELECT * FROM h_trans WHERE h_trans_status = 1 AND h_trans_id = '${hTransId}'`

    const [headerRows] = await connection.query(headerQuery)

    for (let i = 0; i < headerRows.length; i++) {
      const header = headerRows[i]

      // products
      const productQuery = `SELECT h.*, d.d_trans_quantity FROM d_trans d join h_product h on h.h_product_id = d.FK_h_product_id  WHERE h_product_type = 'produk' AND d_trans_status = 1 AND FK_h_trans_id = '${header.h_trans_id}'`
      const [productRows] = await connection.query(productQuery)
      header.h_trans_products = productRows

      // jasa
      const jasaQuery = `SELECT h.*, e.*, d.d_trans_estimation, d.d_trans_done FROM d_trans d join h_product h on h.h_product_id = d.FK_h_product_id left join h_employee e on e.h_employee_id = d.FK_h_employee_id WHERE h_product_type = 'jasa' AND d_trans_status = 1 AND FK_h_trans_id = '${header.h_trans_id}'`
      const [jasaRows] = await connection.query(jasaQuery)
      header.h_trans_jasas = jasaRows

      // customer
      const customerQuery = `SELECT c.* FROM h_trans h join h_customer c on h.FK_h_customer_id = c.h_customer_id where h_trans_id =  '${header.h_trans_id}'`
      const [customerRows] = await connection.query(customerQuery)
      header.h_trans_customer = customerRows[0]

      // promo
      const promoQuery = `SELECT p.* FROM h_trans h join h_promo p on h.FK_h_promo_id = p.h_promo_id where h_trans_id = '${header.h_trans_id}'`
      const [promoRows] = await connection.query(promoQuery)
      header.h_trans_promo = promoRows.length > 0 ? promoRows[0] : null
    }

    retVal.data = headerRows[0]
    await connection.commit()

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (error) {
    await connection.rollback()
    connection.destroy()
    return next(error)
  }
})

// Change update to :id/work with h_employee_id, and h_product_id as body | POST
// Make sure to update h_trans_progress accordingly

// add :id/cancel to cancel transaction
// add :id/done to update transaction to picked

router.put('/assign/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const requiredInputs = ['employee_id', 'product_id']

  const connection = await db.getConnection()

  try {
    inputChecks(requiredInputs, req.body)

    const { employee_id, product_id } = req.body

    const [dTrans] = await connection.query(
      `SELECT d_trans_id from d_trans where FK_h_trans_id = ? and FK_h_product_id = ? and d_trans_status = 1`,
      [req.params.id, product_id]
    )

    if (dTrans.length == 0) {
      throwError(400, 'Input invalid')
    }

    await connection.query(
      'UPDATE d_trans SET FK_h_employee_id = ?, d_trans_update_id=?, d_trans_update_date=?, d_trans_update_ip=? WHERE d_trans_id = ?',
      [
        employee_id,
        req.loggedEmployee.employee_id,
        new Date(),
        req.ip,
        dTrans[0].d_trans_id,
      ]
    )

    const [retDTrans] = await connection.query(
      `SELECT d.*, h.* from d_trans d join h_employee h on h_employee_id = FK_h_employee_id where d_trans_id = ? and d_trans_status = 1`,
      [dTrans[0].d_trans_id]
    )

    retVal.data = retDTrans[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    connection.destroy()
    return next(err)
  }
})

router.put('/work/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const requiredInputs = ['product_id']

  const connection = await db.getConnection()

  try {
    inputChecks(requiredInputs, req.body)

    const { product_id } = req.body

    const [dTrans] = await connection.query(
      `SELECT d_trans_id from d_trans where FK_h_trans_id = ? and FK_h_product_id = ? and FK_h_employee_id IS NOT NULL and d_trans_status = 1`,
      [req.params.id, product_id]
    )

    if (dTrans.length == 0) {
      throwError(400, 'Input invalid')
    }

    await connection.query(
      'UPDATE d_trans SET d_trans_done = 1, d_trans_update_id=?, d_trans_update_date=?, d_trans_update_ip=? WHERE d_trans_id = ?',
      [req.loggedEmployee.employee_id, new Date(), req.ip, dTrans[0].d_trans_id]
    )

    const [retDTrans] = await connection.query(
      `SELECT d.*, h.* from d_trans d join h_employee h on h_employee_id = FK_h_employee_id where d_trans_id = ? and d_trans_status = 1`,
      [dTrans[0].d_trans_id]
    )

    retVal.data = retDTrans[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    connection.destroy()
    return next(err)
  }
})

router.put('/progress/:id/:value', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()

  try {
    const [hTrans] = await connection.query(
      `SELECT * from h_trans where h_trans_status = 1 and h_trans_id = ?`,
      [req.params.id]
    )

    if (hTrans.length == 0) {
      throwError(400, 'Input invalid')
    }

    await connection.query(
      'UPDATE h_trans SET h_trans_progress=?, h_trans_update_id=?, h_trans_update_date=?, h_trans_update_ip=? WHERE h_trans_id = ?',
      [
        req.params.value,
        req.loggedEmployee.employee_id,
        new Date(),
        req.ip,
        req.params.id,
      ]
    )

    const [retHTrans] = await connection.query(
      `SELECT * from h_trans where h_trans_id = ? and h_trans_status = 1`,
      [req.params.id]
    )

    retVal.data = retHTrans[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    connection.destroy()
    return next(err)
  }
})

router.delete('/done/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()

  try {
    const [hTrans] = await connection.query(
      `SELECT * from h_trans where h_trans_status = 1 and h_trans_id = ?`,
      [req.params.id]
    )

    if (hTrans.length == 0) {
      throwError(400, 'Input invalid')
    }

    await connection.query(
      'UPDATE h_trans SET h_trans_progress=3, h_trans_update_id=?, h_trans_update_date=?, h_trans_update_ip=? WHERE h_trans_id = ?',
      [req.loggedEmployee.employee_id, new Date(), req.ip, req.params.id]
    )

    const [retHTrans] = await connection.query(
      `SELECT * from h_trans where h_trans_id = ? and h_trans_status = 1`,
      [req.params.id]
    )

    retVal.data = retHTrans[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    connection.destroy()
    return next(err)
  }
})

router.delete('/cancel/:id', async (req, res, next) => {
  const retVal = {
    status: 200,
  }

  const connection = await db.getConnection()

  try {
    const [hTrans] = await connection.query(
      `SELECT * from h_trans where h_trans_status = 1 and h_trans_id = ?`,
      [req.params.id]
    )

    if (hTrans.length == 0) {
      throwError(400, 'Input invalid')
    }

    await connection.query(
      'UPDATE h_trans SET h_trans_progress=-1, h_trans_update_id=?, h_trans_update_date=?, h_trans_update_ip=? WHERE h_trans_id = ?',
      [req.loggedEmployee.employee_id, new Date(), req.ip, req.params.id]
    )

    const productQuery = `SELECT d.d_trans_quantity as qty, h.FK_product_id as id FROM d_trans d join h_product h on h.h_product_id = d.FK_h_product_id  WHERE d_trans_status = 1 AND FK_h_trans_id = '${req.params.id}'`
    const [productRows] = await connection.query(productQuery)

    console.log(productRows)
    for (let i = 0; i < productRows.length; i++) {
      const product = productRows[i]

      await connection.query(
        'UPDATE product SET product_stock = product_stock + ? WHERE product_id = ?',
        [product.qty, product.id]
      )
    }

    const [retHTrans] = await connection.query(
      `SELECT * from h_trans where h_trans_id = ? and h_trans_status = 1`,
      [req.params.id]
    )

    retVal.data = retHTrans[0]

    connection.destroy()
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    connection.destroy()
    return next(err)
  }
})

module.exports = router
