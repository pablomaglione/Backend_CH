import passport from 'passport'
import passportLocal from 'passport-local'
import userModel from '../models/user.model.js'
import cartModel from '../models/carts.model.js'
import { createHash, isValidPassword } from '../utils.js'
import gitHubStrategy from 'passport-github2'
import UserServices from '../services/users.services.js'

const localStrategy = passportLocal.Strategy
const {registerUser, loginUser} = UserServices;


const initializePassport = () => {

    passport.use('github', new gitHubStrategy({
        clientID: "Iv1.9d8de75113edb6ae",
        clientSecret: "2557c4b67e0f5df8a3fd275f54830b633456baf4",
        callBackURL: "http://localhost:8080/sessions/githubCallback",
    },
    async(accessToken, refreshToken, profile, done) =>{
        console.log(profile);
        try{
            const user = await userModel.findOne({email: profile._json.email})
            if(user){
                console.log('User already exists');
                return done(null, user) // corregir y no pasar todo el user
            }

            const newCart = {
                products: []
            }

            let cart = await cartModel.create(newCart)

            const newUser = {
                first_name: profile._json.name,
                last_name:profile._json.family_name,
                email: profile._json.email,
                password: '',
                cart: cart._id
            }
            const result = await userModel.create(newUser)
            return done(null, result) //corregir y no pasar todo el user
        }catch (error){
            return done('Error to login with github' + error)
        }
    }
    ))

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => registerUser(req, username, password, done)
    ))

    passport.use('login', new localStrategy(
        { usernameField: 'email'},
        async(username, password, done) => loginUser (username, password, done)
    ))
    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport




















