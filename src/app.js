import express from "express";
import __dirname from "./utils.js";
//para views handlebars
import {engine} from "express-handlebars";
//md routers
import productsRoute from "./routes/productsRoute.js"
import cartsRoute from "./routes/cartsRoute.js";
import sessionsRouter from "./routes/sessionsRouter.js";
//views
import viewRouter from "./routes/viewRouter.js"
//mongoose
import mongoose from "mongoose";
//autenticaciones
import passport from "passport";
import inicializePassport from "./config/passport.config.js";
//manejo de cookies
import cookieParser from "cookie-parser";

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
const MONGO = "mongodb+srv://cristianpabloayala:nolimit14@cluster1.3xzue7l.mongodb.net/Ecommerce"
const connection = mongoose.connect(MONGO);
//cookies
app.use(cookieParser());
//passport
inicializePassport();
app.use(passport.initialize());

//routes
app.use("/", viewRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/carts", cartsRoute)
app.use("/api/products", productsRoute)

const server = app.listen(PORT, ()=>{
    console.log(`El servidor funciona en el puerto: ${PORT}`)
})






