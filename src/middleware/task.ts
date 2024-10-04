import type {Request, Response, NextFunction} from 'express';
import Task ,{ ITask} from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}


export async function validateTaskExists(req: Request, res:Response, next:NextFunction) {
    try {
        const { taskId} = req.params
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(404).json({
                errors: {msg:'error, tarea no encontrada'}
            });
        }
        req.task = task;
        next();
    } catch (error) {
        return res.status(500).json({
            errors: {msg:'error en el servidor'}
        });
    }

}
export async function hasAuthorizarion(req: Request, res:Response, next:NextFunction) {
    try {
        if(req.user.id.toString() !== req.project.manager.toString()){
            return res.status(500).json({
                errors: {msg:'acción no valida'}
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            errors: {msg:'error en el servidor'}
        });
    }
}