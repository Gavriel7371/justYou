import express from 'express';
import { test } from '../controller/user.controller.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();


router.get('/test', test);
router.get('/getUserByToken/:token', async (req,res)=>{
    try {
        const token = req.params.token;
        const jwt_secret = process.env.JWT_SECRET;
        const userId = jwt.verify(token, jwt_secret);
        const user = await User.findOne({_id: userId.id});
        res.send(user);
    } catch (error) {
        res.status(401).send(error)
    }
   
})

export default router;