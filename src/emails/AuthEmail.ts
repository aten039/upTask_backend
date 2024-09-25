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
            subject:'UpTask confirma tu cuenta',
            text: 'UpTask confirma tu cuenta',
            html: `<p>Hola ${name}, has creado tu cuenta en UpTask, ya casi todo esta listo, solo debes confirmar tu cuenta</p>
                <p>visita el siguiente enlace: </p>
                <a href="">Confirmar Cuenta</a>
                <p> E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10min</p>
            `
        })
    }
}