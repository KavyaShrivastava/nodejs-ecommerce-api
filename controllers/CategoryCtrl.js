import Category from "../model/Category.js";
import asyncHandler from 'express-async-handler';

//@desc Create new category
//@route POST /api/v1/categories
//@access Private/Admin

export const createCategoryCtrl = asyncHandler(async(req,res)=> {
    const {name} = req.body;
    //category exists
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new Error('Category already exists')
    }
    //create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req?.file?.path,

    });
    res.json({
        status: "success",
        message: "Category create successfully",
        category,
    });

})


//@desc Get all category
//@route get /api/v1/categories
//@access Public

export const getAllCategoriesCtrl = asyncHandler(async(req,res)=> {
    const categories = await Category.find();
    res.json({
        status: "success",
        message: "Categories found successfully",
        categories,
    });

})


//@desc Get a category
//@route Get /api/v1/categories/:id
//@access Public

export const getSingleCategoriesCtrl = asyncHandler(async(req,res)=> {
    const category = await Category.findById(req.params.id)
    res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
    });

})

//@desc update category
//@route PUT api/v1/categories/:id/update
//@access Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
    const {name, image} = req.body;
    //update
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name, image
    }, {
        new: true,
    })
    res.json({
        status: 'success',
        message: 'Category updated successfully',
        category,
    })
})

//@desc delete Category
//@route DELETE api/v1/category/:id/
//@access Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: 'Category deleted successfully',
    })
});
