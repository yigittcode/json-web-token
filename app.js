import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import authRoute from './routes/authRoute.js'
import isAuth from './middlewares/is-authotize.js';
dotenv.config();

const privateKeyPath = path.join(process.cwd(), 'keys', 'private_key.pem');

if (!fs.existsSync(privateKeyPath)) {
    // If private key does not exist, generate keys
    import('./generate-keys.js').then(() => {
        console.log('Keys successfully generated.');
    }).catch((err) => {
        console.error('Error generating keys:', err);
    });
} else {
    console.log('Keys already exist.');
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use('/api' , authRoute);

//example route
app.post('/protected-route',isAuth ,(req, res, next) => {
    return res.status(200).json({
        message: "Authorize is successful",
        user : req.user
    });
});

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

connectToDB();
