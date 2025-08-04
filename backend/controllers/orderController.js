// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import necessary modules
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Controller: Place Order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // Create a new order in MongoDB
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();

        // Clear user cart after order is placed
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Create Stripe line items
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80 // Convert to smallest currency unit
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Respond with session URL
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error placing order:", error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Controller: Verify Order
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.json({ success: false, message: "Error verifying order" });
    }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

// Export controller functions

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}


export { placeOrder, verifyOrder,userOrders ,listOrders,updateStatus};
