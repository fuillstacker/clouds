const Router = require('express')
const User = require('../models/User')
const router = new Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 
const config = require('config')
const { check, validationResult } = require('express-validator')
const middlw = require('../middleware/auth.middleware.js')   
const fileService = require('../services/fileService') 
const File = require('../models/File.js')
 
router.post('/register',
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', "Password must be longer than 3 and shorter than 12").isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Uncorrect request', errors })
            }

            const { email, password } = req.body

            const cand = User.findOne({ email })

            if (!cand) {
                return res.status(400).json({ message: 'User exists' })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({ email, password: hashPassword })
            await user.save()
            await fileService.createDir(new File({ user: user.id, name: '' }))
            return res.json({ msg: 'Registered' })
        } catch (e) { 
            console.log(e) 
            res.send({ msg: 'Server error' })
        }
    })

router.post('/login',
    async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({ message: "Invalid password" })
            }
            const token = jwt.sign({ id: user.id }, config.get("secret_key"), { expiresIn: "1h" })
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.useSpace, 
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({ msg: "Server error" })
        }
    })

router.get('/auth', middlw, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id })

        const token = jwt.sign({ id: user.id }, config.get("secret_key"), { expiresIn: '1h' }) 

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.useSpace,
                avatar: user.avatar
            }
        })

    } catch (e) {
        console.log(e)
        res.json({ msg: 'error' })
    }
})

module.exports = router
