import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserPayload = {
    id:Types.ObjectId
}

export const generateJWT = ({id}:UserPayload)=>{
    const payload = {
        id:id
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn:'180d'
    })
    return token
}
