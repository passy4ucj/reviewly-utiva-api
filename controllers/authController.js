import User from '../models/User.js'
import asyncHandler from 'express-async-handler'


// @desc  Register User
// @route POST /api/v1/auth/register
// @access Public
const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)
    
})


// @desc  Login User
// @route POST /api/v1/auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // Validate email & password
    if(!email || !password) {
        res.status(400)
        throw new Error('Please provide an email and password')
    }

    //Check for user
    const user = await User.findOne({ email }).select('+password')

    if(!user) {
        res.status(401)
        throw new Error('Invalid Credentials')
    }

    // Check if password matchs
    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        res.status(401)
        throw new Error('Invalid Credentials')
    }

    sendTokenResponse(user, 200, res)
    
})


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJwtToken() 

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}


export {
    register,
    login,
}