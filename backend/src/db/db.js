import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        const connectInstance = await mongoose.connect("mongodb://localhost:27017/ChatApplication")
        console.log("Server Started Successfully.");
        
    } catch (error) {
        console.error("MongoDB connection failed in database.js,"+ error)
        process.exit(1)
    }
}

export {connectDB}