const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/get/:id?', async (req, res, next) => {
  let retVal = {
    status: 200,
  }

  try {
    const connection = await db.getConnection()
    const query = `SELECT * FROM privilege ${
      req.params.id ? `where privilege_id = '${req.params.id}'` : ''
    }`
    const [rows] = await connection.query(query)

    retVal.data = rows
    return res.status(retVal.status).json(retVal)
  } catch (err) {
    next(err)
  }
})

module.exports = router
