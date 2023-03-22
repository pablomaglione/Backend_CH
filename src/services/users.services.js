import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import UserDto from "../DTO/user.dto.js";
import CartServices from "./carts.services.js";

class UserServices{
    findAllUsers = async () => {
        try{
            const users = await userModel.find().lean().exec();

            const mapUser = users.map((user) => new UserDto(user));

            return mapUser;
        }catch (error){
            console.log(error);
        }
    };

    findUser = async (username, done) => {
        try{
            const result = await userModel.findOne({email: username}).lean().exec()
                if(!result) {
                    console.error('User donst exist');
                    return done(null, false)
                }
            const user = new UserDto(result)
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
  
                const hashUser = {
                    ...newUser,
                    cart: await CartServices.createCart(),
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

            const dtoUser = new UserDto(user)
            return done(null, dtoUser)
        }catch (error) {
            return done(error)
        }
    }
}

const UserService = new UserServices();

export default UserService;