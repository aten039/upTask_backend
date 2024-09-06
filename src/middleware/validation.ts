import type { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

export const handleInputErrors = (req: Request, res: Response, next: NextFunction )=>{


    let error = validationResult(req)
    
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    next();
}

export async function taskInProject(req: Request, res: Response, next: NextFunction) {
    try {
        if(req.task.project.toString() !== req.project.id.toString()){
            return res.status(403).json({
                errors: {msg:'no valido'}
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            errors: {msg:'error en el servidor'}
        });  
    }
}