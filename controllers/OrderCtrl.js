import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();

//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async(req, res)=> {
    //find user
    const user = await User.findById(req.userAuthId);
    //check if user has shipping address
    if(!user?.hasShippingAddress){
        throw new Error("Add  a shipping address");
    }
    //get the payload(customer, orderitems, shippingAddress, totalPrice)
    const {orderItems, shippingAddress, totalPrice} = req.body;
    //check if order is not empty
    if(orderItems?.length<=0){
        throw new Error("No order items")
    }
    //place/create the order-save into database
    const order = await Order.create({
        user: req.userAuthId,
        orderItems,
        shippingAddress, 
        totalPrice
    })
    //update the product quantity and quantity sold 
    const products = await Product.find({_id:{$in:orderItems}});
    console.log(products);
    console.log(orderItems);

    orderItems?.map(async(order)=>{
        const product = products?.find((product=>{
            return product?._id?.toString() === order?._id?.toString()
        }));
        if(product){
            product.totalSold += order.qty;
        }
        await product.save();
    
    });

    //push order into user 
    user.orders.push(order?._id);
    await user.save();

    //convert Order items to same structuure as Stripe needs
    const convertedOrders = orderItems.map((item)=>{
        return{
            price_data: {
                currency:"usd",
                product_data: {
                    name: item?.name, 
                    description: item?.description,      
                }, 
                unit_amount: item?.price * 100,
            }, 
            quantity: item?.qty,
        }
    })

    //make payment(stripe)
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: order.id
        },
        mode: 'payment',
        success_url: 'http://localhost:7000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });
    res.send({url: session.url})

})

export const getAllOrdersCtrl = asyncHandler(async(req, res)=> {
    const orders = await Order.find();
    res.json({
        success: true,
        msg: "All Orders",
        orders,
    })
});

export const getSingleOrderCtrl = asyncHandler(async(req, res)=>{
    const id = req.params.id; 
    const order = await Order.findById(id); 

    res.status(200).json({
        success: true, 
        message: "Single Order", 
        order,

    })
})

export const updateOrderCtrl = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const updateOrder = await Order.findByIdAndUpdate(id,
        {
            status: req.body.status,
        },{
            new: true
        });

        res.status(200).json({
            success: true, 
            message: "Order updated", 
            updateOrder,
    
        })

    
})

export const getOrderStatisticsCtrl = asyncHandler(async(req,res)=>{
    //sum 

    const orders = await Order.aggregate([{
        $group:{
            _id: null,
            minimumSale: {
                $min: "$totalPrice",
            },
            totalSales: {
                $sum: "$totalPrice",
            },
            maximumSale:{
                $max: "$totalPrice"
            },
            avgSales: {
                $avg: "$totalPrice"
            },
           
        }
    }])

    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const saletoday = await Order.aggregate([{
        $match: {
            createdAt: {
                $gte: today
            }
        }
    },{
        $group: {
            _id: null,
            totalSales:{
                $sum: "$totalPrice"
            }
        }
    }])

    res.status(200).json({
        success: true,
        message: "stats of orders",
        orders,
        saletoday
    })
})

