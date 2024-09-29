import { Document, PopulatedDoc, Schema, Types } from "mongoose";
import mongoose from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./auth";

export interface IProject extends Document {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<ITask & Document>[],
    manager:PopulatedDoc<IUser & Document>
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type:String,
        require: true,
        trim:true,
    },
    clientName: {
        type: String,
        require: true,
        trim:true, 
    },
    description: {
        type:String,
        require: true,
        trim:true,
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager:{
        type:Types.ObjectId,
        ref:'User'
    }
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;