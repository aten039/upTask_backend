import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document{
    content: string
    createBy: Types.ObjectId
    task: Types.ObjectId
}

const NoteSchema:Schema = new Schema({
    content: {
        type:String,
        require:true
    },
    createBy:{
        type: Types.ObjectId,
        ref: 'User',
        require:true
    },
    task:{
        type: Types.ObjectId,
        ref: 'Task',
        require:true
    }
})

export const Note = mongoose.model<INote>('Note', NoteSchema)
