import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,

})

db.connect((err)=>{
    if (err) {
        console.log('Database not connected successfully');
        
    } else {
        console.log('Database connected successfully');

    }
})

export default db