import {Request,Response} from 'express'
import {validationResult} from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {RowDataPacket} from 'mysql2'
import * as XLSX from 'xlsx'
import db from '../config/db'
import dotenv from 'dotenv'
dotenv.config()

export const register=async(req:Request,res:Response) : Promise<void>=>{
const error=validationResult(req)
if (!error.isEmpty()) {
     res.status(400).json({error:error.array()})
}
const {name,email,password}=req.body

db.query('SELECT * from user where email=?',[email],(err,result)=>{
const rows=result as RowDataPacket[]
if (rows.length>0) {
    return res.status(400).json({message:'email already exists'}) 
}
})
bcrypt.hash(password,10,(err,hashPassword)=>{
    if(err)  return res.status(400).json({message:'error in hashing password'})

        db.query('INSERT into user (name,email,password) VALUES (?,?,?)',[name,email,hashPassword],(err)=>{
            if(err)  return res.status(400).json({message:'User registration failed'})

           res.status(400).json({message:'User registration successfully'})
    })
})
}

export const login=async(req:Request,res:Response) : Promise<void>=>{
    const error=validationResult(req)
    if (!error.isEmpty()) {
         res.status(400).json({error:error.array()})
    } 
    const {email,password}=req.body
    db.query('SELECT * from user where email=?',[email],(err,result)=>{
        const rows=result as RowDataPacket[]       
        if (rows.length===0) {
            return res.status(400).json({message:'email doesnot exists'}) 
        }
        const user=rows[0]
        bcrypt.compare(password,user.password,(err,isMatched)=>{
            if(err)  return res.status(400).json({message:'error in comparing password'})
if (!isMatched) {
    return res.status(400).json({message:'email and password not matching'})
}

const token=jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{expiresIn:'1H'})
res.status(200).json({message:'user login successfully',token:token})
})

    
        })    
}


export const importChatHistory=async(req:Request,res:Response)  : Promise<void>=>{
if (!req.file) {
  res.status(400).json({message:'no files uploaded'})

}

const workbook=XLSX.readFile(req.path)
const sheetName=workbook.SheetNames[0]

const sheet=workbook.Sheets[sheetName]
const data=XLSX.utils.sheet_to_json(sheet)

const {errors,validChats}=validateChatData(data)

for(const chat of validChats){
    db.query('INSERT into chats (username,message,status) VALUES (?,?)',[chat.username,chat.message,chat.status],(err)=>{
        if(err)  return res.status(400).json({message:'User registration failed'})

       res.status(400).json({message:'chat history imported  successfully'})
})}
}

export const filterChatHistory=async(req:Request,res:Response)  : Promise<void>=>{
const {username,status}=req.query
let query ='SELECT * from user where status=1'
const queryParams:string[]=[]
if (status) {
   query+=' AND status=?' 
   queryParams.push(status as  string)
}


if (username) {
    query+=' AND username=?' 
    queryParams.push(username as string)
 }
 
 const rows=db.query(query,queryParams)
 res.status(400).json({message:'fetching chat',chats:rows})

}
