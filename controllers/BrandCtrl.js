import Brand from "../model/Brand.js";
import asyncHandler from 'express-async-handler';

//@desc Create new brand
//@route POST /api/v1/brand
//@access Private/Admin

export const createBrandCtrl = asyncHandler(async(req,res)=> {
    const {name} = req.body;
    //category exists
    const BrandFound = await Brand.findOne({name});
    if(BrandFound){
        throw new Error('Brand already exists')
    }
    //create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Brand created successfully",
        brand,
    });

})


//@desc Get all brands
//@route get /api/v1/brands
//@access Public

export const getAllBrandsCtrl = asyncHandler(async(req,res)=> {
    const brands = await Brand.find();
    res.json({
        status: "success",
        message: "Brands found successfully",
        brands,
    });

})

//@desc Get a category
//@route Get /api/v1/categories/:id
//@access Public

export const getSingleBrandCtrl = asyncHandler(async(req,res)=> {
    const brand = await Brand.findById(req.params.id)
    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    });

})

//@desc update category
//@route PUT api/v1/categories/:id/update
//@access Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
    const {name} = req.body;
    //update
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name
    }, {
        new: true,
    })
    res.json({
        status: 'success',
        message: 'Brand updated successfully',
        brand,
    })
})

//@desc delete Brand
//@route DELETE api/v1/brands/:id/
//@access Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: 'Brand deleted successfully',
    })
});
