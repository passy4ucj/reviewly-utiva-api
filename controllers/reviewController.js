import path from 'path'
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


// @desc  Upload photo for review
// @route PUT /api/v1/reviews/:id/photo
// @access Private
const reviewPhotoUpload = asyncHandler(async (req, res, next) => {
    
    const review = await Review.findById(req.params.id)

    if(!review) {
        res.status(404)
        throw new Error(`Review not found with id of ${req.params.id}`)
    }

    // Make sure user is review owner
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401)
        throw new Error(`User ${req.params.id} is not authorised to update this review`)
    }

    if (!req.files) {
      
        res.status(400)
        throw new Error(`Please upload a file`)
    }
    
      const file = req.files.file;
    
      // Make sure the image is a photo
      if (!file.mimetype.startsWith('image')) {
        res.status(400)
        throw new Error(`Please upload an image file`)
    }
    
      // Check filesize
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        res.status(400)
        throw new Error(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`)
      }
    
      // Create custom filename
      file.name = `photo_${review._id}${path.parse(file.name).ext}`;
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
          if(err) {
              console.error(err)
              res.status(400)
            throw new Error(`Problem with file upload`)
          }
          await Review.findByIdAndUpdate(req.params.id, { photo: file.name })
  
          res.status(200).json({
              success: true,
              data: file.name
          })
     })

})


// @desc  Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/apartment/:apartmentId/reviews
// @access Public
const getReviews = asyncHandler(async (req, res, next) => {
   

    if(req.params.apartmentId) {
      const reviews = await Review.find({ apartment: req.params.apartmentId })
    
      return res.status(200).json({
          success: true,
          count: reviews.length,
          data: reviews
      })
    } else {
        res.status(200).json(res.advancedResults)
    }

    
})


// @desc  Get a single review
// @route GET /api/v1/reviews/:id
// @access Public
const getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'apartment',
        select: 'name description address'
    })

    if(!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

export {
    addReview,
    reviewPhotoUpload,
    getReviews,
    getReview,
}