import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const authRouter = Router()

authRouter.post('/create-account',
    body('name').notEmpty().withMessage('el name es obligatorio'),
    body('password').isLength({min:8}).withMessage('el password debe tener mas de 8 caracteres'),
    body('email').isEmail().withMessage('el email no es valido'),
    body('password_confirmation').custom((value, {req})=>{ 
        if( value !== req.body.password){
            throw new Error('el password no coincide')
        }
        return true
    }),
    handleInputErrors,
    AuthController.createAccount)

authRouter.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount
)

authRouter.post('/login', 
    body('email').isEmail().withMessage('el email no es valido'),
    body('password')
        .notEmpty().withMessage('el password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
)

authRouter.post('/request-code', 
    body('email').isEmail().withMessage('el email no es valido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)
authRouter.post('/forgot-password', 
    body('email').isEmail().withMessage('el email no es valido'),
    handleInputErrors,
    AuthController.forgotPassword
)
authRouter.post('/validate-token', 
    body('token').notEmpty().withMessage('el token es obligatorio'),
    handleInputErrors,
    AuthController.validateToken
)
authRouter.post('/change-password/:token', 
    param('token').isNumeric().withMessage('el token no es valido'),
    body('password').isLength({min:8}).withMessage('el password debe tener mas de 8 caracteres'),
    body('password_confirmation').custom((value, {req})=>{ 
        if( value !== req.body.password){
            throw new Error('el password no coincide')
        }
        return true
    }),
    handleInputErrors,
    AuthController.changePassword
)

export default authRouter