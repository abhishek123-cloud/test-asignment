import express from 'express'
import {body} from 'express-validator'
import { filterChatHistory, importChatHistory, login, register } from '../controller/testController'
import multer from 'multer'
const router=express.Router()

const uploads=multer({dest:'/uploads'})

router.post('/signup',
    [
body('name').isString().isLength({min:3}).withMessage('name must be more than 3'),
body('email').isEmail().withMessage('email must be valid'),
body('password').isString().isLength({min:5}).withMessage('password must be more than 5')
],register)

router.post('/login',
    [
body('email').isEmail().withMessage('email must be valid'),
],login)

router.post('/import',uploads.single('file'),importChatHistory)
router.get('/filter',filterChatHistory)

export default router