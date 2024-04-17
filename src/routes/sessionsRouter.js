import { Router } from "express";
import { createHash } from "../utils.js";
import userModel from "../dao/models/users.js";
import passport from "passport";

const sessionsRouter = Router();

//Cerrar sesión
sessionsRouter.post('/logout', (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.sendStatus(200);
  });
});

//Registrar Usuario
sessionsRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }
);

//Error en el registro
sessionsRouter.get("/failregister", async (req, res) => {
  console.log("error");
  res.send({ error: "Falló" });
});

//Logear usuario localmente
sessionsRouter.post('/login', passport.authenticate('login',{failureRedirect:"/faillogin"}),
async(req,res)=>{
if(!req.user)return res.status(400).send('error')
req.session.user = {
  first_name: req.user.first_name,
  last_name: req.user.last_name,
  email: req.user.email,
  age: req.user.age,
  role: req.user.role || 'user',
  cartId: req.user.cart
};

 res.status(200).send({ status: "success", payload: req.user });
})

sessionsRouter.get("/faillogin", async (req, res) => {
  console.log("error");
  res.send({ error: "Fallo" });
});

// Iniciar sesión usando Github
sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(200).send({ status: "success", message: "Autenticación con GitHub iniciada" });
  }
);

//ruta que nos lleva a github login
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => { 
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cartId: req.user.cart
    };
    res.redirect("/products");
  }
);

sessionsRouter.post("/restore", async (req, res) => {
  
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "No se encuentra el user" });
  const newPass = createHash(password);

  await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

  res.send({ status: "success", message: "Password actualizado" });
});

export default sessionsRouter;