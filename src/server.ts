import  express  from "express";
import dotenv  from 'dotenv';
import { connectDB } from "./config/db";
import projectRouter from "./routes/projectRouter";
import taskRouter from "./routes/taskRouter";

dotenv.config();
connectDB();
const app = express()

app.use(express.json())

app.use('/api/projects', projectRouter);
app.use('/api/projects', taskRouter);

export default app