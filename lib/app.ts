

import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";
import { UsuarioController } from "./usuarios/controllers/usuario.controller";


const app = express();
const port = 8080; // defaulst port to listen
const usuarioController = new UsuarioController();


app.use(bodyParser.json({limit: '8192mb'}));
app.use(bodyParser.urlencoded({limit: '8192mb', extended: true}));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors({origin: '*', credetials: false}));



// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hola desde mi servidor" );
});

app.route('/usuario').post(usuarioController.crearUsuario);
app.route('/usuario/:id').get(usuarioController.obtenerUsuario);
app.route('/usuarios').get(usuarioController.obtenerUsuarios);

// conetamos a la base de datos
mongoose.connect('mongodb://localhost:27017/base',{keepAlive: true}, (err) => {
    if (err) throw err;
    console.log('Base de Datos conectada');
});
// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );