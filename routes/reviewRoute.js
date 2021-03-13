import express from 'express'
import advancedResults from '../middleware/advancedResults.js'
import { addReview, reviewPhotoUpload, getReviews, getReview } from '../controllers/reviewController.js'
import Review from '../models/Review.js'
import { protect, authorize } from '../middleware/auth.js'


const router = express.Router({ mergeParams: true })

router.route('/')
    .post(protect, authorize('user', 'admin'), addReview)
    .get(advancedResults(Review, {
        path: 'apartment',
        select: 'name description'
    }), getReviews)

router.route('/:id/photo')
    .put(protect, authorize('user', 'admin'), reviewPhotoUpload)

router.route('/:id')
    .get(getReview)

export default router