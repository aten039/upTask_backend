import  express  from "express";
import dotenv  from 'dotenv';
import { connectDB } from "./config/db";
import projectRouter from "./routes/projectRouter";
import taskRouter from "./routes/taskRouter";
import { corsConfig } from "./config/cors";
import cors from 'cors'
import authRouter from "./routes/authRouter";
dotenv.config();
connectDB();
const app = express()

app.use(cors(corsConfig));
app.use(express.json());
// configuracion cors sin utilizar biblioteca cors
// app.use((req, res, next)=>{
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Reemplaza con el dominio de tu frontend
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if(req.headers.origin === 'http://localhost:5173' ){
//        next()
//     }
//      res.status(500)
// });

app.use('/api/projects', projectRouter);
app.use('/api/projects', taskRouter);
app.use('/api/auth', authRouter);

export default app