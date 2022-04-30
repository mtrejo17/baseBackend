import {Request, Response} from "express";
import * as bcrypt from 'bcrypt';
import Usuario from "../models/usuario.model";
import { GENERIC_PASSWORD } from "../../config/config";


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
                password: bcrypt.hashSync(GENERIC_PASSWORD,10)
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

    public actualizarUsuario = async (req: Request, res: Response) => {
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
        if(!req.body.role) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'role no recibido'
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
        Usuario.findByIdAndUpdate(req.params.id, {
            apellidoPaterno: req.body.apellidoPaterno,
            apellidoMaterno: req.body.apellidoMaterno,
            nombre: req.body.nombre,
            role: req.body.role
        })
        .then(usuarioActualizado => {
            res.status(200).json(
                {
                    ok: true,
                    usuario: usuarioActualizado,
                    message: 'usuario actualizado con exito'
                }                
            );
        })
        .catch(error => {
            res.status(503).json(
                {
                    ok: false,
                    message: 'usuario no actualizado',
                    error
                }
            );
        });
    }

    public actualizarDatosUsuario = async (req: Request, res: Response) => {
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
       
        Usuario.findByIdAndUpdate(req.params.id, {
            apellidoPaterno: req.body.apellidoPaterno,
            apellidoMaterno: req.body.apellidoMaterno,
            nombre: req.body.nombre
        })
        .then(usuarioActualizado => {
            res.status(200).json(
                {
                    ok: true,
                    usuario: usuarioActualizado,
                    message: 'usuario actualizado con exito'
                }                
            );
        })
        .catch(error => {
            res.status(503).json(
                {
                    ok: false,
                    message: 'usuario no actualizado',
                    error
                }
            );
        });
    }

    public reestablecerPassword = (req: Request, res: Response) => {
        Usuario.findByIdAndUpdate(req.params.id, {password: bcrypt.hashSync(GENERIC_PASSWORD,10)})
        .then(usuarioActualizado => {
            res.status(200).json(
                {
                    ok: true,
                    usuario: usuarioActualizado,
                    message: 'contrasena reestablecida' 
                }
            );
        })
        .catch(error => {
            res.status(400).json(
                {
                    ok: false,
                    message: 'usuario no encontrado',
                    error
                }
            );
        });
    }

    public actualizarCredenciales = async (req: Request, res: Response) => {       
        if(!req.body.usuario) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'usuario no recibido'
                }
            );
        }
        if(!req.body.passwordActual) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'passwordActual no recibido'
                }
            );
        }
        if(!req.body.nuevoPassword) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'nuevoPassword no recibido'
                }
            );
        } 
        if (! await this.validarUsuario(req.params.id, req.body.usuario)) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'usuario no valido'
                }
            );
        }
        if (!await this.validarPassword(req.params.id, req.body.passwordActual)) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'passwordActual no valido'
                }
            );
        }
        Usuario.findByIdAndUpdate(req.params.id,{usuario: req.body.usuario, password: bcrypt.hashSync(req.body.password,10)})
        .then(usuarioActualizado => {
            res.status(200).json(
                {
                    ok: true,
                    usuario: usuarioActualizado,
                    message: 'credenciales actualizadas'
                }
            );
        })
        .catch(error => {
            res.status(400).json(
                {
                    ok: false,
                    message: 'credenciales no actualizadas',
                    error
                }
            );
        });
    }

    private validarUsuario(idUsuario: string, usuario: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Usuario.findOne({ usuario })
            .then(usuarioEncontrado => {
                if (usuarioEncontrado) {
                    if (String(usuarioEncontrado._id) === usuario) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(true);
                }
            })
            .catch(error => {
                resolve(false);
            })
        });
    }


    private validarPassword(idUsuario: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Usuario.findById(idUsuario)
            .then(usuarioEncontrado => {
                if (usuarioEncontrado) {
                    if (bcrypt.compareSync(password, usuarioEncontrado.password)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                resolve(false);
            });
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