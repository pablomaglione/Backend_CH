import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const routerSession = Router();

//Register
routerSession.get('/register', (req, res) => {
    res.render('sessions/register')
})

routerSession.get('/register', passport.authenticate("register", {failureRedirect: "/sessions/failregister"}),async (req, res) => {
    res.send("Registro Ok")
})

routerSession.get("/failregister", async (req, res) => {
    console.error("Failed Strategy1");
    res.send({ error: "Failed" });
  });

//Login
routerSession.get("/login", async (req, res) => {
  res.render('sessions/login', {})
});

routerSession.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/sessions/faillogin" }), async (req, res) => {
    if(!req.user){
        return res.status(401).render('errors/base', {error: 'Error en username y/o password'})
    }

    req.session.user = req.user
    // {
    //     first_name: req.session.first_name,
    //     last_name: req.session.last_name,
    //     email: req.session.email
    // };
    req.session.user.role = (req.user.email =='admin@pablo.com') ? 'admin' : 'user'
    //res.send({status: "Login Success", payload: req.session.user})

    res.redirect("/products");
}
);

routerSession.get("/faillogin", (req, res) => {
    res.send({ error: "Failed Login" });
  });

//Creacion User
routerSession.post('/create', passport.authenticate("register", {failureRedirect: "/sessions/failregister"}),async (req, res) => {
    // const userNew = req.body

    // const user = new userModel(userNew);
    // await user.save();

    res.redirect('/sessions/login')
});

routerSession.get("/logout", (req, res)=>{
    req.session.destroy(err =>{
        if(err) {
            console.log(err)
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/sessions/login')
    });
});

routerSession.get("/current",(req, res) => {
    try {
      const user = req.session.user;

  
      res.status(200).render("sessions/user", { user });
    } catch (error) {
      console.log(error);
    }
  });


//Login Github
routerSession.get("/login-github", passport.authenticate("github", { scope: ["user:email"]}), async(req,res) => {});

routerSession.get("/githubCallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
});

export {routerSession as sessionRouter }

