import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import dotenv from 'dotenv'
import User from '../../models/User.js'

import auth from '../../token_verification.js'

dotenv.config()

const router = express.Router()

// @route GET api/users
router.get('/', auth,
    (req, res) => {
        User.findById(req.user.userId)
            .select('-password')
            .select('-email')
            .then(user => res.json(user))
    }
)

// @route POST api/users/register
router.post('/register', 
    [
        check('username', "Invalid username").isLength({ max: 12 }),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            // handling validation errors
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid registration data'
                })
            }

            const {username, email, password} = req.body

            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Invalid registration data' })
            }

            const user_registered = await User.findOne({ email })
            if (user_registered) {
                return res.status(400).json({ message: 'This user has already been registered' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            // creating new user
            const user = new User({ username, email, password: hashedPassword })
            await user.save()

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1d' }
            )

            res.json({
                token, 
                user: {
                    userId: user.id, 
                    username: user.username
                }
            })

        } catch(e) {
            res.status(500).json({ message: 'Something went wrong... Try again' })
        }
    }
)

// @route POST api/users/login
router.post('/login', 
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Invalid password').exists()
    ],
    async (req, res) => {
        try {
            // handling validation errors
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid login data'
                })
            }

            const {email, password} = req.body

            if (!email || !password) {
                return res.status(400).json({ message: 'Invalid login data' })
            }

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Incorrect credentials' })
            }

            const doesMatch = await bcrypt.compare(password, user.password)

            if (!doesMatch) {
                return res.status(400).json({message: 'Incorrect credentials'})
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1d' }
            )

            res.json({
                token, 
                user: {
                    userId: user.id, 
                    username: user.username
                }
            })

        } catch(e) {
            res.status(500).json({ message: 'Something went wrong... Try again' })
        }
    }
)

export default router