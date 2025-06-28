const jwt = require('jsonwebtoken')

const authUser = (req, res, next) => {
    try {
        //collect token from cookies
        const {token} = req.cookies
        console.log(token)
        //no token means unauthorized user
        if(!token) {
            return res.status(401).json({ message: "Unauthorized User"})
        }
        //token decode
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        //issue with token
        if(!decodeToken) {
            return res.status(401).json({ message: "Unauthorized User"})
        }
        
        req.user = decodeToken
        //pass execution to next function
        next();
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( {error: error.message || "Internal Server Error"})
    }
}

module.exports = authUser