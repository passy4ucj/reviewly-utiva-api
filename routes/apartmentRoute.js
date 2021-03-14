import express from 'express'
import Apartment from '../models/Apartment.js'
import { protect, authorize } from '../middleware/auth.js'
import { createApartment, getApartment, getApartments } from '../controllers/apartmentController.js'

const router = express.Router()

// Include other resource routers
import reviewRouter from './reviewRoute.js'
import advancedResults from '../middleware/advancedResults.js'

// Re-route into other resource routers
router.use('/:apartmentId/reviews', reviewRouter)

router.route('/')
    .get(advancedResults(Apartment, 'reviews'), getApartments)
    .post(protect, authorize('user', 'admin'), createApartment)

router.route('/:id')
    .get(getApartment)

export default router