const express = require('express')
// const multer = require('multer');
// const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const { inputChecks } = require('./helper')
const jwt = require('jsonwebtoken')
const db = require('./db')

const cors = require('cors')
// const { inputChecks } = require('./helper')
require('dotenv').config()

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// app.use('/uploads', express.static('uploads'))

app.use(cors())

const userRouter = require('./routes/user')
app.use('/api', userRouter)

app.use(authMiddleware)

const customerRouter = require('./routes/customer')
app.use('/api/customer', customerRouter)

const employeeRouter = require('./routes/employee')
app.use('/api/employee', employeeRouter)

const privilegeRouter = require('./routes/privilege')
app.use('/api/privilege', privilegeRouter)

const productRouter = require('./routes/product')
app.use('/api/product', productRouter)

const promoRouter = require('./routes/promo')
app.use('/api/promo', promoRouter)

const htransRouter = require('./routes/transaction')
app.use('/api/transaction', htransRouter)

// const dtransRouter = require('./routes/d_trans')
// app.use('/api/transaction/detail', dtransRouter)

app.post('/api/test/endpoint', async (req, res, next) => {
  const requiredInputs = ['name']
  try {
    inputChecks(requiredInputs, req.body)
    return res
      .status(200)
      .send('Welcome ' + JSON.stringify(req.loggedPrivileges))
  } catch (error) {
    return next(error)
  }
})

app.get('api/test/helloWorld', async(req,res,next)=>{
  console.log("HELLO WORLD")
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running...`))

async function authMiddleware(req, res, next) {
  const endpoint = req.url.split('/')
  console.log("Start Middleware")
  if (endpoint[3] != 'get') {
    console.log(endpoint[3])
    try {
      const token = req.headers.auth_token
      
      if (!token){
        console.log("Invalid Token")
        return res.status(401).json({ status: 401, message: 'Unauthorized' })
      }

      const decoded = jwt.verify(token, process.env.APP_SECRET)

      if (!decoded.employee_id)
        return res.status(401).json({ status: 401, message: 'Unauthorized' })

      const connection = await db.getConnection()

      const query = `SELECT * FROM employee WHERE employee_status = 1 AND employee_id = ?`

      const [employee] = await connection.query(query, decoded.employee_id)

      if (employee.length === 0)
        return res.status(401).json({ status: 401, message: 'Unauthorized' })

      const [privileges] = await connection.query(
        `select p.* from privilege p join employee_privilege e on p.privilege_id = e.FK_privilege_id where e.employee_privilege_status = 1 AND e.FK_employee_id = '${decoded.employee_id}'`
      )

      req.loggedEmployee = employee[0]
      req.loggedPrivileges = privileges

      req.loggedIsAdmin = privileges.some(
        (privilege) => privilege.privilege_name == 'Administrator'
      )

      next()
    } catch (err) {
      console.log('error', err)
      return res.status(401).json({ status: 401, message: 'Unauthorized' })
    }
  } else next()
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  const retObject = {}

  retObject.status = err.status || 500
  retObject.message = err.customMessage || 'Something went wrong'

  if (err.customTarget) retObject.target = err.customTarget

  return res.status(retObject.status).json(retObject)
})
