import express, { Express, Request, Response } from "express";
import connectDb from "./Config/DbConnector";
import dotenv from 'dotenv';
import { errorHandler } from "./ErrorHandling/ErrorHandler";
import hubRoutes from './Routes/HubRoutes';
import adminRoutes from "./Routes/AdminRoutes";

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

// Register the routes
app.use('/api/v1', hubRoutes);

app.use('/api/v1', adminRoutes);

//error handling 
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
