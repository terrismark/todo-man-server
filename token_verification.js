import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function auth(req, res, next) {
    const token = req.header('todoman-auth-token')

    if (!token) {
        return res.status(401).json({ msg: "Authorization denied!" })
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded_token

        next()

    } catch(error) {
        res.status(400).send("Invalid token!")
    }
}

export default auth