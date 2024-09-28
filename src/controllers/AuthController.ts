import { Request, Response } from "express"
import User from "../models/auth"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import Token from "../models/Token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController {

    static createAccount = async (req:Request , res: Response)=>{

        try {

            //prevenir email duplicado
            const userExist = await User.findOne({email:req.body.email})
            if(userExist){
                return res.status(409).json({errors:{msg:'el usuario ya esta registrado'}})
            }
            //nuevo usuario
            const user = new User(req.body)
            //hash password
            user.password = await hashPassword(req.body.password)
            //generar Token
            const token = new Token()
            token.user = user.id
            token.token = generateToken()

           await AuthEmail.sendConfirmationEmail({
            email:user.email, 
            token: token.token, 
            name:user.name
        })

            await Promise.all([user.save(), token.save()])

            res.send('cuenta creada, revisa tu email para verificarla')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
    static confirmAccount = async(req:Request , res: Response)=>{
        try {
            
            const {token} = req.body
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                return res.status(404).json({errors:{msg:'token no valido'}})
            }

            const user = await User.findById(tokenExist.user)

            user.confirmed = true

            await Promise.all([user.save(), tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
    static login = async(req:Request , res: Response)=>{
        try {
            const {email, password} = req.body

            const user = await User.findOne({email})

            if(!user){
                return res.status(404).json({errors:{msg:'usuario no encontrado'}})
            }
            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                token.save()
                await AuthEmail.sendConfirmationEmail({
                    email:user.email, 
                    token: token.token, 
                    name:user.name
                })
                return res.status(401).json({errors:{msg:'usuario no verificado, enviamos un nuevo email de confirmación'}})
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect){
                return res.status(401).json({errors:{msg:'password incorrecto'}})
            }
            
            res.status(200).send('has iniciado sesion')

        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
    static requestConfirmationCode = async (req:Request , res: Response)=>{

        try {

            //prevenir email duplicado
            const user = await User.findOne({email:req.body.email})
            if(!user){
                return res.status(409).json({errors:{msg:'el usuario no esta registrado'}})
            }
            if(user.confirmed){
                return res.status(403).json({errors:{msg:'el usuario ya esta confirmado'}})
            }
            
            //generar Token
            const token = new Token()
            token.user = user.id
            token.token = generateToken()

            await token.save()
            await AuthEmail.sendConfirmationEmail({
                email:user.email, 
                token: token.token, 
                name:user.name
            })
            res.status(200).send('Se envio un nuevo token')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
    static forgotPassword = async (req:Request , res: Response)=>{

        try {

            //prevenir email duplicado
            const user = await User.findOne({email:req.body.email})
            if(!user){
                return res.status(409).json({errors:{msg:'el usuario no esta registrado'}})
            }
            
            //generar Token
            const token = new Token()
            token.user = user.id
            token.token = generateToken()

            await token.save()
            await AuthEmail.sendPasswordResetToken({
                email:user.email, 
                token: token.token, 
                name:user.name
            })
            res.status(200).send('revisa tu email para instrucciones')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
    static validateToken = async(req:Request , res: Response)=>{
        try {
            
            const {token} = req.body
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                return res.status(404).json({errors:{msg:'token no valido'}})
            }

            res.send('Token válido, Define tu nueva contraseña')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
    static changePassword = async(req:Request , res: Response)=>{
        try {
            
            const {token} = req.params
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                return res.status(404).json({errors:{msg:'token no valido'}})
            }
            const user = await User.findById(tokenExist.user)
            
            user.password = await hashPassword(req.body.password)

            Promise.all([user.save(), tokenExist.deleteOne()])
            res.send('contraseña actualizada corrrectamente')
        } catch (error) {
            return res.status(500).json({errors:{msg:'ha ocurrido un error'}})
        }
    }
}
