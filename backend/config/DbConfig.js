import mongoose from 'mongoose';

const connectDb = async (DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
            dbName: 'test-cube'
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Connected to database...");
    } catch (error) {
        console.error("Error connecting to database: ", error);
    }
}

export default connectDb;