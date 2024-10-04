
import Task from "../models/Task";
import type { Request, Response } from "express"

export class TaskController {

    static createTask = async (req: Request, res:Response)=>{
        
        try {
            const task = new Task(req.body);
            
            const project = req.project
            task.project = project.id
            project.tasks.push(task.id)
            await Promise.all([task.save(), project.save()]);
            return res.status(201).send('tarea creada correctamente');
        } catch (error) {
            return res.status(500).json({
                errors: {msg:'error al crear tarea'}
            })
        }
    }

    static getTasks = async (req: Request, res:Response)=>{
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project');

            res.status(200).json({tasks})
        } catch (error) {
            return res.status(500).json({
                errors: {msg:'error obtener tareas'}
            });
        }
    }

    static  getTaskById = async (req: Request, res:Response)=>{
        try {
            
            res.status(200).json(req.task)
        } catch (error) {
            return res.status(500).json({
                errors: {msg:'error obtener tarea'}
            });
        }
    }
    
    static  updateTask = async (req: Request, res:Response)=>{
        try {
            
            req.task.name = req.body.name;
            req.task.description = req.body.description;

            await req.task.save();
            res.status(200).send('tarea actualizada correctamente');
        } catch (error) {
            return res.status(500).json({
                errors: {msg:'error obtener tarea'}
            });
        }
    }

    static deleteTask = async (req: Request, res:Response)=>{
        try {
            const { taskId} = req.params
           
            req.project.tasks = req.project.tasks.filter((itask)=> itask.toString() !== taskId);

            await Promise.all([req.task.deleteOne(), req.project.save()]);

            res.status(200).send('tarea eliminada correctamente');
        } catch (error) {
            return res.status(500).json({
                errors: {msg:'error al eliminar tarea'}
            });
        }
    }

    static updateStatusTask =  async (req: Request, res:Response)=>{
        try {
            
            const { status } = req.body

            req.task.status = status;
            await req.task.save();
            res.status(200).send('estado actualizado');

        } catch (error) {
            return res.status(500).json({
                errors: {msg:'error al actualizar tarea'}
            });
        }
    }

}