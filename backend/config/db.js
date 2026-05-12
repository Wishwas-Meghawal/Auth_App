import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
      dbName: "Auth_App",
    });
    console.log("MongoDB Connected");
    
  } catch (error) {
    console.log("Failed to Connect");
    process.exit(1);
  }
}

export default connectDB;