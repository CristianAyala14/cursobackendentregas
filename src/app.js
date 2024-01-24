import express from "express";

import session from "express-session";
import mongoStore from "connect-mongo";

import __dirname from "./utils.js";
//para views handlebars
import {engine} from "express-handlebars";
//md routers
import productsRoute from "./routes/productsRoute.js"
import cartsRoute from "./routes/cartsRoute.js";
import sessionsRouter from "./routes/sessionsRouter.js";
//views
import viewRouter from "./routes/viewRouter.js"
//socket
import {Server} from "socket.io";
//mongoose
import mongoose from "mongoose";
//autenticaciones
import passport from "passport";
import inicializePassport from "./config/passport.config.js";


//server
const PORT = 8080;
const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`))
//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")
//mongoDB
const MONGO = "mongodb+srv://cristianpabloayala:nolimit14@cluster1.3xzue7l.mongodb.net/Segundapreentrega"
const connection = mongoose.connect(MONGO)
//
app.use(session({
    store: new mongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: "CoderSecret",
    resave:false,
    saveUninitialized: false
}))

//passport
inicializePassport();
app.use(passport.initialize());
app.use(passport.session());

const server = app.listen(PORT, ()=>{
    console.log(`El servidor funciona en el puerto: ${PORT}`)
    
})

//socket
const io = new Server (server);

//routes
app.use("/", viewRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/carts", cartsRoute)
app.use("/api/products", productsRoute)








