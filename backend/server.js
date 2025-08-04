import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';

import dotenv from 'dotenv';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
dotenv.config(); // add this at the top of your server.js

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});


const app = express();
const port = process.env.PORT || 4000; // Define port here or get from environment variables

// middleware
app.use(express.json());
app.use(cors());

app.use('/images', express.static('uploads')); // ✅ correct

app.use("/api/user",userRouter)

app.use("/api/cart",cartRouter)


app.use("/api/order",orderRouter)

connectDB();

//api endpoints

app.use("/api/food",foodRouter)

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});

//mongodb+srv://aravindkumar392004:8341586474@cluster0.2wksfh1.mongodb.net/?