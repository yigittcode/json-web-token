import { Router } from "express";
import * as authController from '../controller/auth-controller.js'
import { body, validationResult } from 'express-validator';  

const router = Router();


router.post('/auth/signup', [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
], (req, res, next) => {
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();  
}, authController.signup);


router.post('/auth/login', [
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
], (req, res, next) => {
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();  
}, authController.login);

export default router;
