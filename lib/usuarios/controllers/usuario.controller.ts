import {Request, Response} from "express";
import * as bcrypt from 'bcrypt';
import Usuario from "../models/usuario.model";


export class UsuarioController {
    //CRUD
    /*
        CREATE post
        READ get
        UPDATE put
        DETELE detele
        params
        body
    */
    public crearUsuario = async (req: Request, res: Response) => {
        if(!req.body.apellidoPaterno) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'apellidoPaterno no recibido'
                }
            );
        }
        if(!req.body.apellidoMaterno) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'apellidoMaterno no recibido'
                }
            );
        }
        if(!req.body.nombre) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'nombre no recibido'
                }
            );
        }        
        if(!req.body.usuario) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'usuario no recibido'
                }
            );
        }
        if(!req.body.role) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'role no recibido'
                }
            );
        }
        if(!req.body.password) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'password no recibido'
                }
            );
        }
        if(await this.existeUsuario(req.body.usuario)){
            return res.status(400).json(
                {
                    ok: false,
                    message: `el usuario ${req.body.usuario}, ya fue utilizado`
                }
            );
        }
        if(!await this.validarRole(req.body.role)){
            return res.status(400).json(
                {
                    ok: true,
                    message: `el role ${req.body.role}, no es valido`
                }
            );
        }

        let nuevoUsuario = new Usuario(
            {
                apellidoPaterno: req.body.apellidoPaterno,
                apellidoMaterno: req.body.apellidoMaterno,
                nombre: req.body.nombre,                
                role: req.body.role,
                usuario: req.body.usuario,
                password: bcrypt.hashSync(req.body.password,10)
            }
        );
        nuevoUsuario.save()
        .then(usuarioCreado => {
            res.status(201).json(
                {
                    ok: true,
                    usuarioCreado,
                    message: 'usuario creado exitosamente'
                }
            );
        })
        .catch(error => {
            res.status(500).json(
                {
                    ok: false,
                    error
                }
            )
        });
    }

    public obtenerUsuarios = (req: Request, res: Response) => {
        Usuario.find()
        .then(usuarios => {
            res.status(200).json(
                {
                    ok: true,
                    usuarios
                }
            )
        })
        .catch(error => {
            res.status(503).json(
                {
                    ok: false,
                }
            )
        });
    }

    public obtenerUsuario = (req: Request, res: Response) => {
        Usuario.findById(req.params.id)
        .then(usuario => {
            if (usuario) {
                res.status(200).json(
                    {
                        ok: true,
                        usuario
                    }
                );
            } else {
                res.status(404).json(
                    {
                        ok: false,
                        message: 'usuario no encontrado'
                    }
                );
            }
        })
        .catch(error => {
            res.status(503).json(
                {
                    ok: false,
                    error
                }
            );
        });
    }


    private existeUsuario(usuario: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Usuario.countDocuments({usuario})
            .then(usuariosCount => {
                if(usuariosCount > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                reject(error);
            })
        });
    }

    private validarRole(role: string): Promise<boolean> {
        return new Promise((resolve) => {
            let rolesUsuarioValidos = ['ADMIN', 'USUARIO'];
            let posicion = rolesUsuarioValidos.findIndex(mRole => String(mRole) === role);
            if(posicion >= 0){
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
}