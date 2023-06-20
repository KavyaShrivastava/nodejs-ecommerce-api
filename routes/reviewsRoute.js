import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/ReviewsCtrl.js";

const reviewsRoute = express.Router();

reviewsRoute.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewsRoute;
