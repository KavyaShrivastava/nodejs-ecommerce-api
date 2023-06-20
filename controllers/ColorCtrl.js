import Color from "../model/Colors.js";
import asyncHandler from 'express-async-handler';

//@desc Create new color
//@route POST /api/v1/colors
//@access Private/Admin

export const createColorCtrl = asyncHandler(async(req,res)=> {
    const {name} = req.body;
    //category exists
    const colorFound = await Color.findOne({name});
    if(colorFound){
        throw new Error('color already exists')
    }
    //create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Color created successfully",
        color,
    });

})


//@desc Get all colors
//@route get /api/v1/colors
//@access Public

export const getAllColorsCtrl = asyncHandler(async(req,res)=> {
    const colors = await Color.find();
    res.json({
        status: "success",
        message: "Colors found successfully",
        colors,
    });

})

//@desc Get a colors
//@route Get /api/v1/colors/:id
//@access Public

export const getSingleColorCtrl = asyncHandler(async(req,res)=> {
    const color = await Color.findById(req.params.id)
    res.json({
        status: "success",
        message: "Color fetched successfully",
        color,
    });

})

//@desc update category
//@route PUT api/v1/categories/:id/update
//@access Private/Admin
export const updateColorCtrl = asyncHandler(async (req, res) => {
    const {name} = req.body;
    //update
    const color = await Color.findByIdAndUpdate(req.params.id, {
        name
    }, {
        new: true,
    })
    res.json({
        status: 'success',
        message: 'Color updated successfully',
        color,
    })
})

//@desc delete color
//@route DELETE api/v1/color/:id/
//@access Private/Admin
export const deleteColorCtrl = asyncHandler(async (req, res) => {
    const color = await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: 'Color deleted successfully',
    })
});
