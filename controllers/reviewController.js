import Review from '../models/Review.js'
import Apartment from '../models/Apartment.js'
import asyncHandler from 'express-async-handler'


// @desc  Add a review
// @route POST /api/v1/apartments/:apartmentId/reviews
// @access Private
const addReview = asyncHandler(async (req, res, next) => {
    req.body.apartment = req.params.apartmentId

    req.body.user = req.user.id

    const apartment = await Apartment.findById(req.params.apartmentId)


    if(!apartment) {
        res.status(404)
        throw new Error(`No apartment found with the id of ${req.params.apartmentId}`)
    }

    // Make sure user is bootcamp owner
    // if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(new ErrorResponse(`User ${req.user.id} is not authorised to add a course to  bootcamp ${bootcamp._id}`, 401))
    // }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })
})


export {
    addReview
}