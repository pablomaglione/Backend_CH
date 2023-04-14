import CustomError from "../errors/customError.js";
import dotenv from "dotenv"
import UserService from "../services/users.services.js";

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
            req.logger.error(err)
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('sessions/login')
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
    res.status(200).res.redirect('sessions/login')
}

export const getCurrentUser = (req, res) => {
    try {
        const user = req.session.user;

        res.status(200).render("sessions/user", { user });
      } catch (error) {
        req.logger.error(error);
      }
}

export const getGithubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
}

export const getAllUsers = async (req, res) => {
    try{
        const users = await UserService.findAllUsers();

        if(!users){
            CustomError.createError({
                message: "No existen usuarios"
            });
        }

        res.status(200).send({payload: users})
    }catch(error){
        req.logger.error(error);
    }
}

export const getRestore = (req, res) => {
    try{
        res.render('sessions/restore')
    }catch(error){
        req.logger.error(error);
    }
}

export const postRestore = async (req, res) => {
    try{
        const {email} = req.body;

        const result = await UserService.restoreMail(email);

        if(!result){
            CustomError.createError({
                message: "No se pudo enviar el mail",
              });
        }
        
        res.status(200).res.redirect('sessions/login')
    }catch(error){
        req.logger.error(error);
    }
}

export const getRestoreForm = async (req, res) => {
    try{
        const {uid, token} = req.params;

        const user = await UserService.findUserById(uid);

        if(!user){
            CustomError.createError({
                message: "Usuario no exite",
            });
            return res.redirect('sessions/restore');
        }

        const userToken = await UserService.findUserToken(uid, token);

        if(!userToken){
            CustomError.createError({
                message: "Token invalido o expirado"
            });
            return res.redirect('sessions/restore');
        }

        res.render("restoreForm",{
            uid,
            token,
        });
    }catch(error){
        req.logger.error(error);
        res.redirect('sessions/restore');
    }
}

export const postRestoreForm = async (req, res) => {
    try{
        const { password } = req.body;
        const { uid, token } = req.params;
    
        const result = await UserService.restorePassword(uid, password, token);
    
        if (!result) {
          CustomError.createError({
            message: ERRORS_ENUM["USER NOT FOUND"],
          });
        }
    
        res.status(200).redirect('sessions/login');
      } catch (error) {
        req.logger.error(error);
      }
}

export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
    
        const result = await UserService.changeRole(uid);
    
        if (!result) {
          CustomError.createError({
            message: "Error",
          });
        }
    
        res.status(200).send({
          message: "Usuario cambio de role correctamente",
        });
      } catch (error) {
        req.logger.error(error);
      }
}