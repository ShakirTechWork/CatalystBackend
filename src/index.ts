import express, { Express, Request, Response } from "express";
import connectDb from "./config/dbConnection"; // Include .js extension
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Initialize database connection
connectDb();

// Create the Express app
const app: Express = express();

// Middleware to parse JSON
app.use(express.json());

// Define a test route
app.get('/', (req: Request, res: Response) => {
    res.send("TypeScript and Node works.");
});

// Start the server
const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
