import mongoose from 'mongoose'

export const connectDB= async() => {
    await mongoose.connect('mongodb+srv://aravindkumar392004:8341586474@cluster0.2wksfh1.mongodb.net/food-del').then(()=>console.log("db connected"));
}