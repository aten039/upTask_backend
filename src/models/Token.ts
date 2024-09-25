import mongoose, { Document, Schema, Types } from "mongoose";
import { generateToken } from "../utils/token";


export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

const tokenSchema: Schema = new Schema({

    token: {
        type: String,
        require: true,
        default:generateToken()
    },
    user:{
        type:Types.ObjectId,
        require:true,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: '10m'
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token