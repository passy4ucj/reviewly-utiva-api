import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'


// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer Token
        token = req.headers.authorization.split(' ')[1]
    } 
    // Set token from cookie
    // else if(req.cookies.token) {
    //     token = req.cookies.token
    // }

    // Make sure token exists
    if(!token) {
        res.status(401)
        throw new Error('Not authorized to access this route')
    }

    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        

        req.user = await User.findById(decoded.id)

        next()
    } catch (error) {
        res.status(401)
        throw new Error('Not authorized to access this route')
    }
})

// Grant access to specific role
const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            res.status(403)
            throw new Error(`User role ${req.user.role} is unauthorized to access this route`)
        }
        next()
    }
}

export {
    protect,
    authorize,
}