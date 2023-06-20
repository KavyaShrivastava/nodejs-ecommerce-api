import express from "express";
import { createOrderCtrl, getAllOrdersCtrl, getSingleOrderCtrl, updateOrderCtrl, getOrderStatisticsCtrl} from "../controllers/OrderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const ordersRoute = express.Router();

ordersRoute.post("/", isLoggedIn,  createOrderCtrl);
ordersRoute.get("/", isLoggedIn, getAllOrdersCtrl);
ordersRoute.get("/:id", isLoggedIn, getSingleOrderCtrl);
ordersRoute.put("/:id", isLoggedIn, updateOrderCtrl);
ordersRoute.get("/sales/stats", isLoggedIn, getOrderStatisticsCtrl);

export default ordersRoute;