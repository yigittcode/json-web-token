import bcrypt from 'bcryptjs'; 
import User from '../model/user.js';
import { createJWTToken, verifyJWTToken } from '../middlewares/jwt-helper.js';
export const signup = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({
            message: "User created successfully.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordTrue = await bcrypt.compare(password, existingUser.password);  
    if (!isPasswordTrue) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    console.log(existingUser);
    let jwtToken;
    try {
        jwtToken = createJWTToken({ id: existingUser._id, email: existingUser.email });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }

    return res.status(200).json({
        message: "Login is successful.",
        token: jwtToken,
        userID: existingUser._id
    });
};
