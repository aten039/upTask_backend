import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate)
router.post('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject)


router.get('/', ProjectController.getAllProject);

router.get('/:id',
    param('id').isMongoId().withMessage('id no valido'),
    handleInputErrors,
    ProjectController.getProjectById);


router.put('/:id',
    param('id').isMongoId().withMessage('id no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    
    handleInputErrors,
    ProjectController.updateProject);

router.delete('/:id', 
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

export default router 