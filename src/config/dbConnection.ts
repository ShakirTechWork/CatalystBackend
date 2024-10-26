import mongoose from "mongoose";

const connectDb = async () => {
    // const connectionString = process.env.CONNECTION_STRING_PROD;
    const connectionString =
        process.env.NODE_ENV === 'production'
            ? process.env.CONNECTION_STRING_PROD
            : process.env.CONNECTION_STRING_STAGING;

    console.log("connectionString", connectionString)

    if (connectionString) {
        try {
            const connect = await mongoose.connect(connectionString);
            console.log("Database Connected: ", connect.connection.host, connect.connection.name);

        } catch (err) {
            console.error("Database connection error:", err);
            process.exit(1);
        }
    } else {
        console.error("No connection string found in environment variables.");
        process.exit(1);
    }
};

// Use `export default` for ES modules
export default connectDb;
