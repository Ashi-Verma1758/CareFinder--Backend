import express from 'express'; //d
import cors from "cors";//d
import dotenv from 'dotenv';
import hospitalRoutes from './routes/hospital.routes.js';
import bedRoutes from './routes/bed.routes.js';
import searchRoutes from './routes/search.routes.js';
import userRoutes from "./routes/user.routes.js"

import cookieParser from 'cookie-parser'; //d
const app = express();//d


dotenv.config();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173",  // frontend origin
  credentials: true,
}));
app.use(express.json());


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"})) //allow nested object =urlencoded
app.use(express.static("public"))
app.use(cookieParser())

//routes
app.use('/api/user', userRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/search', searchRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});


export { app }//d








