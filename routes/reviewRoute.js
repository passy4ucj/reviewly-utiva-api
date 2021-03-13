import express from 'express'
import { addReview } from '../controllers/reviewController.js'
import Review from '../models/Review.js'
import { protect, authorize } from '../middleware/auth.js'


const router = express.Router({ mergeParams: true })

router.route('/')
    .post(protect, authorize('user', 'admin'), addReview)

export default router