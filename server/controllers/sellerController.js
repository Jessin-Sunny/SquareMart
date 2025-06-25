//sign-up
const signup = async(req, res, next) => {
    try {
        //db connection logic
        console.log("Registered Successfully")
        res.send("Registered Successfully")
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

//signin

module.exports = {signup} 