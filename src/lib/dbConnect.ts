import mongoose from "mongoose";

type ConnectionObj = {
    isConnected?: number;
}

const connection: ConnectionObj = {};

/**
 * Connects to the MongoDB database.
 *
 * @returns {Promise<void>} Resolves once the database connection is established.
 */
async function dbConnect(): Promise<void> {
    /**
     * If the database connection is already established, do nothing.
     */
    if (connection.isConnected) {
        return;
    }

    try {
        /**
         * Connect to the MongoDB database with the given URI.
         *
         * @see https://mongoosejs.com/docs/connections.html#options
         */
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;

        /**
         * Listen to the "connected" event of the database connection.
         *
         * @see https://mongoosejs.com/docs/connections.html#connection-events
         */
        db.connection.on('connected', () => {
            console.log('Mongoose is connected');
        });
    } catch (e) {
        /**
         * If there is an error while establishing the database connection, log the error and exit the process with a non-zero status code.
         *
         * @see https://nodejs.org/api/process.html#process_exit_code
         */
        console.error("Database connection error", e);
        process.exit(1);
    }
}

export default dbConnect;