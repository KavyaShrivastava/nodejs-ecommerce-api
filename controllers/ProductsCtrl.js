import asyncHandler from 'express-async-handler';
import Product from '../model/Product.js';
import Category from '../model/Category.js';
import Brand from '../model/Brand.js';

// @desc Create new Product
//@route POST /api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async(req, res) => {
    console.log(req);
    const convertedImages = req.files.map((file)=>{
        return file.path
    });
    const {name, description, brand, category, sizes, colors, price, totalQty} = req.body;
    console.log(req.body)
    //product exists
    const productExists = await Product.findOne({name});
    if(productExists){
        throw new Error("Product already exists");
    }
    const categoryFound = await Category.findOne({name:category,})
    if(!categoryFound){
        throw new Error("Category not found, create category first or check category name")


    }
    const brandFound = await Brand.findOne({name:brand,})
    if(!brandFound){
        throw new Error("Brand not found, create brand first or check brand name")
    }

    const product = await Product.create({
            name,
            description,
            brand,
            category,
            sizes,
            colors,
            user: req.userAuthId,
            price,
            totalQty,
            images: convertedImages
    });
    //push the product into category
    categoryFound.products.push(product._id);

    //resave
    await categoryFound.save()

    brandFound.products.push(product._id);

    await brandFound.save()

    //send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });

});

// @desc Get all products
//@access public
//@route GET /api/v1/products

export const getProductsCtrl = asyncHandler(async(req,res)=> {
    //query
    let productQuery = Product.find();
    //search by name
    if(req.query.name){
        productQuery = productQuery.find({
            name: {$regex: req.query.name, $options: 'i'},
        })
    }
    //search by brand
    if(req.query.brand){
        productQuery = productQuery.find({
            brand: {$regex: req.query.brand, $options: 'i'},
        })
    }
    if(req.query.category){
        productQuery = productQuery.find({
            category: {$regex: req.query.category, $options: 'i'},
        })
    }
    if(req.query.colors){
        productQuery = productQuery.find({
            colors: {$regex: req.query.colors, $options: 'i'},
        })
    }
    if(req.query.sizes){
        productQuery = productQuery.find({
            sizes: {$regex: req.query.sizes, $options: 'i'},
        })
    }

    if(req.query.price){
        const priceRange = req.query.price.split("-");
        //gte: greater than or equal to
        //lte: less than or equal to 
        productQuery = productQuery.find({
            price: {$gte: priceRange[0], $lte: priceRange[1]},
        })
    }

    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //startIdx
    const startIdx = (page-1) * limit;
    //endIndex
    const endIndx = (page*limit);
    //totalProducts
    const totalProducts = await Product.countDocuments();

    productQuery = productQuery.skip(startIdx).limit(limit);

    //pagination results
    const pagination = {}
    if(endIndx < totalProducts){
        pagination.next = {
            page: page+1,
            limit,

        }
    }
    if(startIdx>0){
        pagination.prev = {
            page: page-1,
            limit,
        }
    }

    const products = await productQuery.populate("reviews");
    res.json({
        status:"Success",
        totalProducts,
        results: products.length,
        pagination,
        message: "Products fetched succcessfully",
        products,
    })
});

//@desc Get single Product
//@route GET api/products/:id
//@access Public
export const getSingleProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("reviews");
    if(!product){
        throw new Error('Product not found')
    }
    res.json({
        status: 'success',
        message: 'Product fetched successfully',
        product,
    })
})

//@desc update Product
//@route PUT api/products/:id/update
//@access Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
    const {name, description, brand, category, sizes, colors, user, price, totalQty} = req.body;
    //update
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name, description, brand, category, sizes, colors, user, price, totalQty
    }, {
        new: true,
    })
    res.json({
        status: 'success',
        message: 'Product updated successfully',
        product,
    })
})

//@desc delete Product
//@route DELETE api/products/:id/
//@access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        message: 'Product deleted successfully',
    })
});
