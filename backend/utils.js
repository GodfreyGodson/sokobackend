// const jwt = require("jsonwebtoken");
// const { JWT_SECRET_CONFIG } = require("./config/app.config");

// const generateToken = (user) => {
//     return jwt.sign({
//         _id:user._id,
//         name:user.name,
//         email:user.email,
//         isAdmin:user.isAdmin
//     },
//     JWT_SECRET_CONFIG.JWT_SECRET
//     )
// }


// module.exports = {
//     generateToken
   
// };




const jwt = require("jsonwebtoken");
const { JWT_SECRET_CONFIG } = require("./config/app.config");// Corrected import path

const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    },
    JWT_SECRET_CONFIG.JWT_SECRET
    );
};



const isAuth  = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if(!bearerToken){
        res.status(401).send({message: 'Token is not Supplied'});
    }else{
        const token = bearerToken.slice(7, bearerToken.length);
        jwt.verify(token, JWT_SECRET_CONFIG.JWT_SECRET, (err, data)=>{
            if(err){
                res.status(401).send({message: 'Invalid Token'})
            }else {
                req.user = data;
                next();
            }
        })
    }
};


const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send({ message: 'Unauthorized - Admins only' });
    }
};
module.exports = {
    generateToken,
    isAuth,
    isAdmin
};
