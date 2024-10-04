import type { Request, Response } from "express"
import User from "../models/auth";
import Project from "../models/Project";

export class TeamController {

    static getMemberTeamAll = async (req:Request, res:Response) => {
        try {

            const project = await Project.findById(req.params.projectId).populate({
                path:'team',
                select:'id name email'
            })

            res.send(project.team)
        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }   

    static findMemberByEmail = async (req:Request, res:Response) => {

        try {
            const email = req.body.email

            if(req.user.email === email){
                return res.status(403).json({errors:{msg:'usuario errado'}});
            }

            const user = await User.findOne({
                email
            }).select('id email name')
            
            if(!user){
                return res.status(404).json({errors:{msg:'usuario no encontrado'}});
            }

            res.json(user)
        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }   

    static addMemberById = async (req:Request, res:Response) => {

        try {
            const {id} = req.body
            const user = await User.findById(id).select('id')

            if(req.user.id === id || !user){
                return res.status(403).json({errors:{msg:'error en el servidor'}});
            }
            
            if(req.project.team.some(team => team.toString() === user.id.toString())){
                return res.status(409).json({errors:{msg:'el usuario ya existe en el proyecto'}});
            }

            req.project.team.push(user.id)
            await req.project.save()

            res.send('se agrego un nuevo miembro al equipo de trabajo')
        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }   

    static deleteMemberById = async (req:Request, res:Response) => {
        try {
            const {userId} = req.params

            if(!req.project.team.some(team => team.toString() === userId)){
                return res.status(409).json({errors:{msg:'el usuario no existe en el proyecto'}});
            }

            req.project.team = req.project.team.filter(team=> team.toString() !== userId)

            await req.project.save()
            res.send('usuario eliminado correctamente')
        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }   

   
}