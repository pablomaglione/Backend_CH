import { Router } from "express";
import sessionModel from "../dao/models/session.model.js";

const routerSession = Router();

routerSession.get('/register', async (req, res) => {
    res.render('sessions/register', {})
})

routerSession.get("/login", async (req, res) => {
  res.render('sessions/login', {})
});

routerSession.post('/create', async (req, res) => {
    const userNew = req.body
    console.log(userNew);

    const user = new sessionModel(userNew);
    await user.save();

    res.redirect('/sessions/login')
})

routerSession.get('/login', async (req, res) => {
    res.render('sessions/login', {})
})

routerSession.post('/login', async(req,res)=>{
    const {email, pass} = req.body;

    const user = await sessionModel.findOne({email, pass}).lean().exec()

    if(!user){
        return res.status(401).render('error/base', {error: 'Error en username y/o password'})
    }

    req.session.user = user;
    req.session.user.rol = (email =='admin@pablo.com') ? 'admin' : 'user'

    res.redirect("/products");
});

routerSession.get("/logout", (req, res)=>{
    req.session.destroy(err =>{
        if(err) {
            console.log(err)
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/sessions/login')
    });
});

export {routerSession as sessionRouter }

