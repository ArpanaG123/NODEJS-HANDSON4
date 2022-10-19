const exp = require("express").Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken')
const users = []
exp.post('/signup', [
    check("email", "please provide a valid mail")
        .isEmail(),
    check("password", "please provide a valid password greater than 6 character")
        .isLength({
            min: 8
        })
], async (req, res) => {
    const { email, password } = req.body

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        });
    }

    let user = users.find((user) => {
        return user.email == email;
    })
    if (user) {
        res.status(400).json({
            "err": [
                {
                    "massege": "This user is already existed"
                }
            ]
        })
    }
    else if (!user) {
        res.status(400).json({
            "err": [
                {
                    "message": "Registration successful"
                }
            ]
        })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    users.push({
        email,
        password: hashPassword
    })
})

exp.post('/login', async (req, res) => {
    const { password, email } = req.body
    let user = users.find((user) => {
        return user.email === email;
    })

    if (!user) {
        return res.status(400).json({
            "err": [
                {
                    "massege": "Invalid credentail, Please Register with valid crendential first"
                }
            ]
        })
    }

    let match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(400).json({
            "err": [
                {
                    "message": "Invalid credential"
                }
            ]
        })
    }

    const token = await jwtToken.sign({
        email
    }, "lkjasdfjhduiweuyd", {
        expiresIn: 36000
    })
    res.json({
        token
    })
})

exp.get('/api', (req, res) => {
    res.json(users)

})

module.exports = exp;