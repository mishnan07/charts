import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import route from './Routes.js/Route.js'



const app = express()
app.use(express.json({limit:'30mb',extended:true}))
app.use(morgan('dev'))
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())


app.use('/',route)


const port = 3000

 const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/assignment', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('Error connecting to MongoDB: ', error.message);
      process.exit(1);
    }
  };
  
connectDB()  
app.listen(port,()=>{
    console.log(`express app listening on port${port}` );
})

export default connectDB;
