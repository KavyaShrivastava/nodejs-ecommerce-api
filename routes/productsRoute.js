import express from "express";
import { createProductCtrl, deleteProductCtrl, getProductsCtrl, getSingleProductCtrl, updateProductCtrl } from "../controllers/ProductsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";


const productsRoute = express.Router();

productsRoute.post("/", isLoggedIn, isAdmin, upload.array('files'), createProductCtrl);
productsRoute.get("/", getProductsCtrl);
productsRoute.get("/:id", getSingleProductCtrl);
productsRoute.put("/:id/", isLoggedIn, isAdmin, updateProductCtrl);
productsRoute.delete("/:id/", isLoggedIn, isAdmin, deleteProductCtrl);






export default productsRoute;