import mongoose from "mongoose";
import colors  from "colors";
import {exit} from 'node:process';

export const connectDB = async ()=>{

    try {
        const {connection}  = await mongoose.connect(process.env.DATABASE_URL);
        const url = `Conectado ha la DB ${connection.host}:${connection.port}/${connection.name}`
        console.log(colors.magenta.bold(url));
    } catch (error) {
        console.log(colors.red.bold('Error al conectar a mongoDB'));
        exit(1);
    }
   
}
