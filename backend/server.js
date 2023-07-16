import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import {notFound,errorHandler} from "./middleware/errorMidleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./config/controllers/uploadRoutes.js";

dotenv.config();

const port = process.env.PORT || 5000;
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/api/config/paypal", (req, res) => res.send({
    clientId: process.env.PAYPAL_CLIENT_ID
}));





app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname,'/uploads')))

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    // any route that is not api will be redirected to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'frontend','build', 'index.html'))
    })
}else{
    app.get('/', (req, res) => res.send('api is running'))
}

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})