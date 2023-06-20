import mongoose from "mongoose";

const dbConnect = async() => {
    try{
        const connected = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${(connected).connection.host}`)
    }
    catch (error){
        console.error('Error occurred during MongoDB connection:', error);
        process.exit(1);
    }
};

export default dbConnect;