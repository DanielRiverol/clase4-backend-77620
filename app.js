import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path"
import exphbs from "express-handlebars";
import userApiRoutes from "./src/routes/users.js";
import usersViewRoutes from "./src/routes/view/user.js";
import connectDB from "./src/config/config.js";

connectDB()
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))


app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

// Rutas API
app.use("/api/users", userApiRoutes);

// Rutas de Vistas
app.use('/users', usersViewRoutes);

// Ruta raíz - redirigir a login
app.get('/', (req, res) => {
    res.redirect('/users/login');
});

// Puerto
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app
