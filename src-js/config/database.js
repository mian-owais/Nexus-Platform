import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus';
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.error('✗ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};
export const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected');
};
export default mongoose;
