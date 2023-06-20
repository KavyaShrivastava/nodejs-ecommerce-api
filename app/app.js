import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoute.js';
import { globalErrhandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRoute from '../routes/productsRoute.js';
import categoryRoute from '../routes/categoryRoute.js';
import brandsRoute from '../routes/brandsRoute.js';
import colorsRoute from '../routes/colorRoute.js';
import reviewsRoute from '../routes/reviewsRoute.js';
import ordersRoute from '../routes/ordersRoute.js';
import Stripe from 'stripe';
import Order from '../model/Order.js';

dbConnect();

const app = express(); 



const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_3a6a436ed31aafbf3768479cc23ac513921a2387801d654e894c7b4bcb84cb3c";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('event');
  } catch (err) {
    console.log('err', err.message)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status; 
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total; 
    const currency = session.currency;  
    console.log({
        orderId, paymentStatus, paymentMethod, totalAmount, currency
    })
    const order = await Order.findByIdAndUpdate(orderId,{
        totalPrice: totalAmount/100, 
        paymentMethod,
        currency,
        paymentStatus,
    },{
        new: true,
    });
        console.log(order)
    }

    else{
        return;
    }

  // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.json());


//pass data

//routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productsRoute);
app.use('/api/v1/categories/', categoryRoute);
app.use('/api/v1/brands/', brandsRoute);
app.use('/api/v1/colors/', colorsRoute);
app.use('/api/v1/reviews/', reviewsRoute);
app.use('/api/v1/orders/', ordersRoute);

//Stripe webhook 


//err middleware 
app.use(notFound);
app.use(globalErrhandler);


export default app;