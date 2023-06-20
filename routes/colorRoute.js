import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl, deleteColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl } from "../controllers/ColorCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";


const colorsRoute = express.Router();

colorsRoute.post('/create',isLoggedIn, isAdmin, createColorCtrl);
colorsRoute.get('/', getAllColorsCtrl);
colorsRoute.get('/:id',getSingleColorCtrl);
colorsRoute.put('/update/:id',isLoggedIn, isAdmin, updateColorCtrl);
colorsRoute.delete('/delete/:id',isLoggedIn, isAdmin, deleteColorCtrl);

export default colorsRoute;