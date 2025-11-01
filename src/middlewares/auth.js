import jwt from 'jsonwebtoken';

// Middleware para verificar si el usuario está autenticado
function authenticate(req, res, next) {
    try {
        // Obtener el token de la cookie
        const token = req.signedCookies.currentUser;

        if (!token) {
            return res.redirect('/users/login');
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Si el token no es válido, redirigir al login
        res.clearCookie('currentUser');
        return res.redirect('/users/login');
    }
}

// Middleware para verificar si el usuario ya está logueado (redirigir de login si ya está autenticado)
const redirectIfAuthenticated = (req, res, next) => {
    try {
        const token = req.signedCookies.currentUser;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET);
            // Si el token es válido, redirigir a /current
            return res.redirect('/users/current');
        }

        next();
    } catch (error) {
        // Si el token no es válido, continuar (permitir acceso al login)
        next();
    }
};

export { authenticate, redirectIfAuthenticated };
