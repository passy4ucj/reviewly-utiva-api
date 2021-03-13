import express from 'express'
import Apartment from '../models/Apartment.js'
import { protect, authorize } from '../middleware/auth.js'
import { createApartment } from '../controllers/apartmentController.js'

const router = express.Router()

// Include other resource routers


// Re-route into other resource routers


router.route('/')
    .post(protect, authorize('user', 'admin'), createApartment)



export default router