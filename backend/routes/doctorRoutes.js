import express from 'express';
import { createOrUpdateProfile, getProfile, listDoctors, uploadMyImage, uploadImageById ,getDoctorPublicProfile} from '../controllers/doctorController.js';
import { userAuth } from '../middlewares/authMiddleware.js';
import { roleAuth } from '../middlewares/roleMiddleware.js';
import upload from '../utils/multer.js';

const router = express.Router();

// Public
router.get('/', listDoctors);

// Logged-in doctor
router.get('/me', userAuth, getProfile);
router.post('/me/image', userAuth, roleAuth(['doctor','admin']), upload.single('image'), uploadMyImage);

// Admin routes
router.get('/:id', userAuth, roleAuth(['admin']), getProfile);
router.post('/:id/image', userAuth, roleAuth(['admin']), upload.single('image'), uploadImageById);

// Protected
router.post('/', userAuth, roleAuth(['doctor','admin']), createOrUpdateProfile);

router.get('/getdoctorprofile/:id', getDoctorPublicProfile);


export default router;
