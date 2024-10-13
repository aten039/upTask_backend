import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors, taskInProject } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { validateProjectExists } from "../middleware/project";
import { hasAuthorizarion, validateTaskExists } from "../middleware/task";
import { NoteController } from "../controllers/NoteController";

const router = Router();
router.use(authenticate)
router.param('projectId', validateProjectExists)
router.param('taskId', validateTaskExists);
router.param('taskId', taskInProject);

router.post('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject)


router.get('/', ProjectController.getAllProject);

router.get('/:projectId',
    param('projectId').isMongoId().withMessage('id no valido'),
    handleInputErrors,
    ProjectController.getProjectById);


router.put('/:projectId',
    param('projectId').isMongoId().withMessage('id no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    hasAuthorizarion,
    ProjectController.updateProject);

router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    hasAuthorizarion,
    ProjectController.deleteProject
)

// routes for team

router.get('/:projectId/team/all',
    TeamController.getMemberTeamAll
)
router.post('/:projectId/team/find', 
    body('email').isEmail().toLowerCase().withMessage('email no valido'),
    handleInputErrors,
    
    TeamController.findMemberByEmail
)

router.post('/:projectId/team', 
    body('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamController.deleteMemberById
 )

// routes for Notes

router.post('/:projectId/task/:taskId/notes',
    body('content').notEmpty().withMessage('El contenido es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)
router.get('/:projectId/task/:taskId/notes',
    NoteController.getTaskNotes
)
router.delete('/:projectId/task/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    NoteController.deleteNote
)


export default router 