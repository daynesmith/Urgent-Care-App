const {verify}= require('jsonwebtoken');

//validatetoken along with the role required for specific route   validatetoken('patient') ensures only patients can access specified route
const validateToken = (requiredRole) => {
    (req, res, next) => {
        const accessToken = req.header("accessToken")
        if(!accessToken) return res.status(401).json({error: "user not logged in"});

        try{
            const validToken = verify(accessToken, process.env.jwtsecret)
            req.user = validToken

            //verify that role required matches role of user.
            if (validToken) {
                if (requiredRole && validToken.role !== requiredRole) {
                    return res.status(403).json({ error: "Access denied. Insufficient role." });
                }
                return next();
            }
        }catch(err){
            return res.status(500).json({err: err})
        }
    }
}

module.exports = {validateToken}