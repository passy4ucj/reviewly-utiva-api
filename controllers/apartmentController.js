import Apartment from '../models/Apartment.js'
import asyncHandler from 'express-async-handler'


// @desc  Create an apartment
// @route POST /api/v1/apartments
// @access Private
const createApartment = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id    

    // Check for created apartment
    const publishedApartment = await Apartment.findOne({ user: req.user.id })

    // If the user is not an admin, they can only add one apartment
    if(publishedApartment && req.user.role !== 'admin') {
        res.status(400)
        throw new Error(`The user with ID  ${req.user.id} has already published an apartment`)
    }

    const apartment = await Apartment.create(req.body)

    res.status(201).json({
        success: true,
        data: apartment
    })
    
})


export {
    createApartment,
}