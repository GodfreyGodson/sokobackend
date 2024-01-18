const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const { generateToken, isAuth } = require("../utils");

const userRouter = express.Router();

userRouter.get('/createadmin', expressAsyncHandler( async (req, res) => {
    try {
        const user = new User({
            name: 'admin',
            email: 'admin@example.com',
            password: 'sokomkononi',
            isAdmin: true,
        });
        const createUser = await user.save();
        res.send(createUser);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})
);
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const signUser = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (!signUser) {
        res.status(401).send({
            message: 'Invalid Email or Password'
        });
    } else {
        res.send({
            _id: signUser._id,
            name: signUser.name,
            email: signUser.email,
            isAdmin: signUser.isAdmin, // Corrected typo here
            token: generateToken(signUser), // Corrected typo here
        });
    }
}));



userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password


    });

    const createdUser = await user.save()
    
   

    if (!createdUser) {
        res.status(401).send({
            message: 'Invalid User Data'
        });
    } else {
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin, // Corrected typo here
            token: generateToken(createdUser), // Corrected typo here
        });
    }
}));



userRouter.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
    // const user = new User({
    //     name:req.body.name,
    //     email:req.body.email,
    //     password:req.body.password


    // });

    // const createdUser = await user.save()
    
   

    if (!user) {
        res.status(404).send({
            message: 'User Not Found'
        });
    } else {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin, // Corrected typo here
            token: generateToken(updatedUser), // Corrected typo here
        });
    }
}));


// userRouter.post('/signin', expressAsyncHandler(async (req, res)=>{

//     const signUser = await User.findOne({
//         email: req.body.email,
//         password:req.body.password
//     });

//     if(!signUser){
//         res.status(401).send({
//             message:'Invalid Email or Password'
//         })
//     }else{
//         res.send({
//             _id: signUser._id,
//             name: signUser.name,
//             email: signUser.email,
//             isAdmin: signUser.isAdmin, // Fix typo here
//             token: generateToken(signUser), // Fix typo here
//         });
        
//     }

// }));

module.exports = userRouter;
