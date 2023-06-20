import express from "express";
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoriesCtrl, updateCategoryCtrl } from "../controllers/CategoryCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import categoryFileUpload from "../config/categoryUpload.js";

const categoryRoute = express.Router();

categoryRoute.post('/create',isLoggedIn,categoryFileUpload.single('file'),createCategoryCtrl);
categoryRoute.get('/', getAllCategoriesCtrl);
categoryRoute.get('/:id',getSingleCategoriesCtrl);
categoryRoute.put('/update/:id',isLoggedIn, updateCategoryCtrl);
categoryRoute.delete('/delete/:id',isLoggedIn, deleteCategoryCtrl);







export default categoryRoute;