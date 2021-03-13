import User from '../models/User.js'
import asyncHandler from 'express-async-handler'

// @desc  Get all users
// @route GET /api/v1/auth/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})


// @desc  Get single User
// @route GET /api/v1/auth/users/:id
// @access Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

export {
    getUser,
    getUsers
}