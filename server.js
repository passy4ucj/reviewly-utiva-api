import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import fileupload from 'express-fileupload'
import colors from 'colors'
import connectDB from './config/db.js'
import morgan from 'morgan'
import cors from 'cors'


//Load env vars
dotenv.config({ path: './config/config.env' })

//Connect to database
connectDB()


//Route files
import auth from './routes/authRoutes.js'


const app = express()

// Body parser
app.use(express.json())


// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        message: 'API is running'
    })
})

// Mount routers
app.use('/api/v1/auth', auth)

const PORT = process.env.PORT || 5000

app.listen(PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))


