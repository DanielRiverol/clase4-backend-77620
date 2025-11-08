import passport from "passport";
import jwt from "passport-jwt";
import userModel from "../models/user.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  //Strategies
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload); //user o false
        } catch (error) {
          return done(error);
        }
      }
    )
  );



  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    return done(null, user);
  });
};

  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["authCookie"];
    }
    return token;
  };
export default initializePassport;
