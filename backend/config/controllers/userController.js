import asyncHandler from "../../middleware/asyncHandler.js";
import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../../utils/generateToken.js";

// @desc Auth user & get token
// @route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))) {

        generateToken(res, user._id)

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {

        res.status(401)
        throw new Error("Invalid email or password")
    }
})


// @desc Register user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    console.log(name, email, password)
    const userExists = await User.findOne({email})

    console.log(userExists)

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})


// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        maxAge: 0
    })

    res.status(200).json({message: "Logout success"})
})


// @desc Get user profile
// @route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)
    if (user) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

// @desc update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})


// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})


// @desc Delete user by id
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")
    console.log(user)
    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error("Can't delete admin user")
        } else {
            await user.deleteOne()
            res.status(200).json({message: "User removed"})
        }
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})


// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const {name, email, isAdmin,userId} = req.body
    const user = await User.findById(userId)
    console.log(isAdmin)

    if (user) {
        user.name = name || user.name
        user.email = email || user.email
        user.isAdmin = Boolean(isAdmin )

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
    }
})

export {
    authUser,
    registerUser,
    logout,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}