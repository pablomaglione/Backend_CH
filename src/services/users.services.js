import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

class UserServices{
    findAllUsers = async () => {
        try{
            const users = userModel.find().lean().exec();

            return users;
        }catch (error){
            console.log(error);
        }
    };

    findUser = async (username, done) => {
        try{
            const user = await userModel.findOne({email: username}).lean().exec()
                if(!user) {
                    console.error('User donst exist');
                    return done(null, false)
                }
                return done(null, user)
        }catch (error) {
            return done(error)
        }   
    }

    registerUser = async (req, username, password, done) => {
        const newUser= req.body
            try {
                const user = await this.findUser(username)
                if(user) {
                    console.log('User already exits');
                    return done(null, false)
                }

                // const newCart = {
                //     products: []
                // }

                // let cart = await cartModel.create(newCart);
                
                const hashUser = {
                    ...newUser,
                    cart: cart._id,
                    password: createHash(newUser.password)
                }
                const createUser = await userModel.create(hashUser)
                return done(null, createUser)
            }catch (error) {
                return done("Error to register " + error)
            }
    }

    loginUser = async (username, password, done) => {
        try{
            const user = await this.findUser({email: username}).lean().exec()
            if(!user) {
                console.error('User donst exist');
                return done(null, false)
            }

            if(!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        }catch (error) {
            return done(error)
        }
    }
}

const UserService = UserServices();

export default UserService;