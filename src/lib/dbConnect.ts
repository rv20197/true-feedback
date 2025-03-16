import mongoose from "mongoose";

type ConnectionObj = {
    isConnected?: number;
}

const connection: ConnectionObj = {};

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState;

        db.connection.on('connected', () => {
            console.log('Mongoose is connected')
        })
    } catch (e) {
        console.error("Database connection error", e);
        process.exit(1)
    }
}

export default dbConnect;