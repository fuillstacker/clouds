const express = require('express')
const config = require('config')
const authRouter = require('./routers/auth.routes')
const fileRouter = require('./routers/file.routes')
const app = express() 
const cors = require('cors')
const fileUpload = require('express-fileupload')
const PORT = config.get('PORT') 
const mongoose = require('mongoose')
const corsMiddleware = require('./middleware/cors.middleware')


app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json({ limit: "3mb" }))
app.use(express.static('static'))
app.use('/api', authRouter) 
app.use('/api/files', fileRouter)

const run = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/storage");
    console.log("Connected to DB");
  }
  
run()
app.listen(PORT, () => {
    console.log('started')
}) 