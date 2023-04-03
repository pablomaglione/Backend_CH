import dotenv from "dotenv"

dotenv.config();

export const getRegister = (req, res) => {
    try{

        res.render('sessions/register')
    }catch(error){
        req.logger.error(error);
    }
}

export const getLogin = (req, res) => {
    try{

        res.render('sessions/login', {})
    }catch(error){
        req.logger.error(error);
    }
}

export const getLogout = (req, res) => {
    req.session.destroy(err =>{
        if(err) {
            console.log(err)
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/sessions/login')
    });
}

export const postLogin = (req, res) => {
    if(!req.user){
        return res.status(401).render('errors/base', {error: 'Error en username y/o password'})
    }

    req.session.user = req.user
    req.session.user.role = (req.user.email =='admin@pablo.com') ? 'admin' : 'user'
    res.redirect("/products");
}

export const postCreate = (req, res) => {
    res.status(200).res.redirect('/sessions/login')
}

export const getCurrentUser = (req, res) => {
    try {
        const user = req.session.user;

        res.status(200).render("/sessions/user", { user });
      } catch (error) {
        req.logger.error(error);
      }
}

export const getGithubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
}