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

// @desc  Get all apartments
// @route GET /api/v1/apartments
// @access Public
const getApartments = asyncHandler(async (req, res, next) => {
    
    const apartments = await Apartment.find()

    res.status(200).json({
        success: true,
        data: apartments
    })
})


// @desc  Get a single apartment
// @route GET /api/v1/apartments/:id
// @access Public
const getApartment = asyncHandler(async (req, res, next) => {
    
    const apartment = await Apartment.findById(req.params.id)

    if(!apartment) {
        res.status(404)
        throw new Error(`Apartment not found with id of ${req.params.id}`)
    }

    res.status(200).json({
        success: true,
        data: apartment
    })
})


export {
    createApartment,
    getApartment,
    getApartments,
}