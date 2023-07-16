import express from "express";
import {
    authUser,
    registerUser,
    logout,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from "../config/controllers/userController.js";

const router = express.Router()

import {protect, admin} from "../middleware/authMiddleware.js";

router.route('/').get(protect,admin, getUsers).post(registerUser);
router.post('/auth', authUser);
router.post('/logout', logout);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect,admin, deleteUser).get(protect,admin, getUserById).put(protect,admin, updateUser);

export default router;