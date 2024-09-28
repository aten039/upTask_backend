import { transport } from "../config/nodemailer"

interface IEmail {
    email: string
    name:string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( {email, token, name}: Pick<IEmail, 'email'|'token' |'name'> )=>{
        await transport.sendMail({
            from:'UpTask <admin@uptask.com>',
            to: email,
            subject:'UpTask -confirma tu cuenta',
            text: 'UpTask confirma tu cuenta',
            html: `<p>Hola ${name}, has creado tu cuenta en UpTask, ya casi todo esta listo, solo debes confirmar tu cuenta</p>
                <p>visita el siguiente enlace: </p>
                <a href=${process.env.FRONTEND_URL}/auth/confirm-account>Confirmar Cuenta</a>
                <p> E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10min</p>
            `
        })
    }
    static sendPasswordResetToken = async ( {email, token, name}: Pick<IEmail, 'email'|'token' |'name'> )=>{
        await transport.sendMail({
            from:'UpTask <admin@uptask.com>',
            to: email,
            subject:'UpTask -reestablece tu password',
            text: 'UpTask reestablece tu password',
            html: `<p>Hola ${name}, has solicitado reestablecer tu password.</p>
                <p>visita el siguiente enlace: </p>
                <a href=${process.env.FRONTEND_URL}/auth/new-password>Reestablecer password</a>
                <p> E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10min</p>
            `
        })
    }
}