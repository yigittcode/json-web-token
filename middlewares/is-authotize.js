import { verifyJWTToken } from "./jwt-helper.js"

const isAuth = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Token is missing.' });
    }

    try {
        const decoded = verifyJWTToken(token);

        req.user = decoded; 

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
    }
};

export default isAuth;