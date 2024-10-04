import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { body, param } from "express-validator";
import { handleInputErrors, taskInProject } from "../middleware/validation";
import { validateProjectExists } from "../middleware/project";
import { validateTaskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";



const router = Router();
router.use(authenticate)
router.param('projectId', validateProjectExists);

router.post('/:projectId/task',
    param('projectId').isMongoId().withMessage('el id no es valido'),
    body('name').notEmpty().withMessage('el nombre es obligatorio'),
    body('description').notEmpty().withMessage('la descripcion es obligatorio'),
    handleInputErrors,
    
    TaskController.createTask
);

router.get('/:projectId/task',
    param('projectId').isMongoId().withMessage('el id no es valido'),
    handleInputErrors,
    TaskController.getTasks
);

router.get('/:projectId/task/:taskId',
    param('projectId').isMongoId().withMessage('el id proyecto no es valido'),
    param('taskId').isMongoId().withMessage('el id tarea no es valido'),
    handleInputErrors,
    validateTaskExists,
    taskInProject,
    TaskController.getTaskById
);

router.put('/:projectId/task/:taskId',
    param('projectId').isMongoId().withMessage('el id proyecto no es valido'),
    param('taskId').isMongoId().withMessage('el id tarea no es valido'),
    body('name').notEmpty().withMessage('el nombre es obligatorio'),
    body('description').notEmpty().withMessage('la descripcion es obligatorio'),
    handleInputErrors,
    validateTaskExists,
    taskInProject,
    TaskController.updateTask
)

router.delete('/:projectId/task/:taskId',
    param('projectId').isMongoId().withMessage('el id proyecto no es valido'),
    param('taskId').isMongoId().withMessage('el id tarea no es valido'),
    handleInputErrors,
    validateTaskExists,
    taskInProject,
    TaskController.deleteTask
);

router.post('/:projectId/task/:taskId/status',
    param('projectId').isMongoId().withMessage('el id proyecto no es valido'),
    param('taskId').isMongoId().withMessage('el id tarea no es valido'),
    body('status').notEmpty().withMessage('el status es obligatorio'),
    handleInputErrors,
    validateTaskExists,
    taskInProject,
    TaskController.updateStatusTask
)

export default router;