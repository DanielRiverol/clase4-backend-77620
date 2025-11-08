import { Router } from "express";
import { createToken } from "../utils/index.js";
import passport from "passport";
const router = Router();
// fake db
const users = [{ id: 1, email: "bernarda@gmail.com", password: "password123" }];

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userFound = users.find((user) => {
    return user.email === email && user.password === password;
  });
  console.log(userFound);
  const user = { ...userFound };
  delete user.password;
  // que psas si el usuario no se encuentra

  let token = createToken(user, "8h");

  res
    .cookie("authCookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .send({ message: "LOGIN EXITOSO" });
  //   res.send(token);
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

export default router;
