import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/auth";

declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}

export const authenticate =async (req:Request, res:Response, next:NextFunction)=>{

    const bearer = req.headers.authorization

    if(!bearer){
        return res.status(401).json({errors:{msg:'usuario no autenticado'}});
        }

    const token = bearer.split(' ')[1]

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        
        if(typeof decoded !=='object'){
            return res.status(500).json({
                errors: {msg:'error en el servidor'}
            });
        }
        const user = await User.findById(decoded?.id).select('__id name email')
        if(!user){
            return res.status(500).json({
                errors: {msg:'error en el servidor'}
            });
        }
        req.user = user

    } catch (error) {
        return res.status(500).json({
            errors: {msg:'error en el servidor'}
        });
    }

    next()
}