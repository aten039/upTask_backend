import { Request, Response } from "express"

import User from "../models/auth"
import { hashPassword } from "../utils/auth"

export class AuthController {

    static createAccount = async (req:Request , res: Response)=>{

        try {

            //prevenir email duplicado
            const userExist = await User.findOne({email:req.body.email})
            if(userExist){
                return res.status(409).json({errors:{msg:'el usuario ya esta registrado'}})
            }
            
            const user = new User(req.body)
            user.password = await hashPassword(req.body.password)
            await user.save()
            res.send('cuenta creada, revisa tu email para verificarla')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
}