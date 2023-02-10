import passport from 'passport'
import passportLocal from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import gitHubStrategy from 'passport-github2'

const localStrategy = passportLocal.Strategy

const initializePassport = () => {

    passport.use('github', new gitHubStrategy({
        clientID: "Iv1.9d8de75113edb6ae",
        clientSecret: "2557c4b67e0f5df8a3fd275f54830b633456baf4",
        callBackURL: "http://localhost:8080/sessions/githubCallback",
    },
    async(accessToke, refreshToken, profile, done) =>{
        console.log(profile);
        try{
            const user = await userModel.findOne({email: profile._json.email})
            if(user){
                console.log('User already exists');
                return done(null, user)
            }
            const newUser = {
                first_name: profile._json.name,
                last_name:profile._json.family_name,
                email: profile._json.email,
                password: ''
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        }catch (error){
            return done('Error to login with github' + error)
        }
    }
    ))

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const newUser= req.body
            try {
                const user = await userModel.findOne({email: username})
                if(user) {
                    console.log('User already exits');
                    return done(null, false)
                }

                const hashUser = {
                    ...newUser,
                    password: createHash(newUser.password)
                }
                const result = await userModel.create(hashUser)
                return done(null, result)
            } catch (error) {
                return done("Error to register " + error)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { usernameField: 'email'},
        async(username, password, done) => {
            try {
                const user = await userModel.findOne({email: username}).lean().exec()
                if(!user) {
                    console.error('User donst exist');
                    return done(null, false)
                }

                if(!isValidPassword(user, password)) return done(null, false)

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
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




















