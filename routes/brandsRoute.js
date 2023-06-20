import express from "express";
import { getAllBrandsCtrl, getSingleBrandCtrl, createBrandCtrl, updateBrandCtrl, deleteBrandCtrl  } from "../controllers/BrandCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const brandsRoute = express.Router();

brandsRoute.post('/create',isLoggedIn, isAdmin, createBrandCtrl);
brandsRoute.get('/', getAllBrandsCtrl);
brandsRoute.get('/:id',getSingleBrandCtrl);
brandsRoute.put('/update/:id',isLoggedIn, isAdmin, updateBrandCtrl);
brandsRoute.delete('/delete/:id',isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandsRoute;