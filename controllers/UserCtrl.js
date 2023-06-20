import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';
//@desc Register User
//@route POST /api/v1/users/register
//@access Private/admin

export const registerUserCtrl = asyncHandler( async(req, res) => {
    //check user exists
    const {fullname, email, password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        throw new Error ("User already exists");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    //create the user
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user,
    })


})

export const loginUserCtrl = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    //Find the user in db by email only

    const userFound = await User.findOne({
        email,
    });
    if(userFound && await bcrypt.compare(password, userFound?.password)){
        res.json({
            status: 'Success',
            msg: "User logged in successfully", userFound,
            token: generateToken(userFound?._id)
        });
    }
    else{
        throw new Error('Invalid login credentials');
    }

});

//@desc Get user Profile 
//@route GET /api/v1/users/profile
//@access Private

export const getUserProfileCtrl = asyncHandler(async(req, res) => {
    const user = await User.findById(req.userAuthId).populate('orders');
    res.json({
        status: "success",
        message: "User profile fetched successfully",
        user
    })
   
})

//@desc update user shipping address 
//@route put /api/v1/users/update/shipping
//@access private

export const updateShippingAddress = asyncHandler(async(req,res)=>
{
    const {firstName, lastName, address, city, postalCode, province, phone}= req.body;
    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress:{
            firstName, lastName, address, city, postalCode, province, phone,
        },
        hasShippingAddress: true
    },{
        new:true,
    });
    res.json({
        status: "success",
        message: "User shipping address updated succesfully",
        user,
    })
})