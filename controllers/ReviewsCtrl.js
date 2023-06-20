import { query } from "express";
import Product from "../model/Product.js";
import Review from "../model/Review.js";
import asyncHandler from 'express-async-handler';


//@desc Create new review 
//@route POST /api/v1/reviews
//@access Private/admin

export const createReviewCtrl = asyncHandler(async(req, res)=> {
    const {product, message, rating} = req.body;
    //find the product 
    const {productID} = req.params;
    const productFound = await Product.findById(productID).populate("reviews");
    if(!productFound){
        throw new Error('No product was found');
    }
    //check if user already reviewwed this product
    const hasReviewed = productFound?.reviews?.find((review)=> {
        return review?.user?.toString() === req?.userAuthId?.toString()
    })
    if(hasReviewed){
        throw new Error("You have already reviewed this product")
    }
    //create Review 
    const review = await Review.create({
        message, 
        rating,
        user: req.userAuthId,
        product: productFound?._id,
    })
    //push review to product
    productFound.reviews.push(review?._id)
    //resave
    await productFound.save();
    res.status(201).json({
        success: true,
        msg: "review created successfully",
    });
});