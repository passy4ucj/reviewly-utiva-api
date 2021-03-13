import express from 'express'
import User from '../models/User.js'
import { authorize, protect } from '../middleware/auth.js'
import advancedResults from '../middleware/advancedResults.js'
import { getUser, getUsers } from '../controllers/userController.js'

const router = express.Router({  mergeParams: true })

router.use(protect)
router.use(authorize('admin'))

router.route('/')
    .get(advancedResults(User), getUsers)

router.route('/:id')
    .get(getUser)

export default router