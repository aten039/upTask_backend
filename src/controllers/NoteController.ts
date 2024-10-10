import type { Request, Response } from "express"
import { INote, Note } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController { 
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const {content} = req.body
            const note = new Note()
            note.content = content
            note.createBy = req.user.id
            note.task = req.task.id
            req.task.notes.push(note.id)

            await Promise.allSettled([note.save(), req.task.save()])

            res.status(201).send('se ha creado la nota correctamente')
        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }
    static getTaskNotes = async (req: Request<{}, {}, INote>, res: Response)=> {
        try {

            const notes = await Note.find({task:req.task.id})

            res.status(200).json(notes)

        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }
    static deleteNote = async (req: Request<NoteParams>, res: Response)=> {
        try {

            const {noteId} = req.params
            const note = await Note.findById(noteId)

            if(!note){
                return res.status(404).json({errors:{msg:'nota no encontrada'}});
            }
            if(note.createBy.toString() !== req.user.id.toString()){
                return res.status(401).json({errors:{msg:'Acción no valida'}});
            }

            req.task.notes = req.task.notes.filter((note)=> note.toString() !== noteId.toString())

            await Promise.allSettled([note.deleteOne(), req.task.save()])

            res.status(200).send('nota eliminada correctamente')
        } catch (error) {
            return res.status(500).json({errors:{msg:'error en el servidor'}});
        }
    }
}