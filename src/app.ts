import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app=express()
import db from './config/db'

const port =process.env.PORT || 3000
app.listen(port,()=>{
console.log('server is running on the port=>',port);

})