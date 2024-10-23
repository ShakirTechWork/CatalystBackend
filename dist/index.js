"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnection_1 = __importDefault(require("./config/dbConnection")); // Include .js extension
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
// Initialize database connection
(0, dbConnection_1.default)();
// Create the Express app
const app = (0, express_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
// Define a test route
app.get('/', (req, res) => {
    res.send("TypeScript and Node works.");
});
// Start the server
const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
