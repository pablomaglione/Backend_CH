import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import UserDto from "../DTO/user.dto.js";
import CartServices from "./carts.services.js";
import sendMail from "../utils/nodemailer.js"
import CustomError from "../errors/customError.js";

class UserServices {
    findAllUsers = async () => {
        try {
            const users = await userModel.find().lean().exec();

            const mapUser = users.map((user) => new UserDto(user));

            return mapUser;
        } catch (error) {
            console.log(error);
        }
    };

    findUser = async (username, done) => {
        try {
            const result = await userModel.findOne({ email: username }).lean().exec()
            if (!result) {
                console.error('User donst exist');
                return done(null, false)
            }
            const user = new UserDto(result)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }

    findUserById = async (uid) => {
        try {
            const user = await userModel.findById({ _id: uid }).lean().exec();

            if (!user) {
                CustomError.createError({
                    message: ERRORS_ENUM["USER NOT FOUND"],
                });
            }

            return user;
        } catch (error) {
            console.log(error);
        }
    };

    registerUser = async (req, username, password, done) => {
        const newUser = req.body
        try {
            const user = await this.findUser(username)
            if (user) {
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
        } catch (error) {
            return done("Error to register " + error)
        }
    }

    loginUser = async (username, password, done) => {
        try {
            const user = await this.findUser({ email: username }).lean().exec()
            if (!user) {
                console.error('User donst exist');
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            const dtoUser = new UserDto(user)
            return done(null, dtoUser)
        } catch (error) {
            return done(error)
        }
    }

    changeRole = async (uid) => {
        try {
            const user = await this.findUserById(uid);

            if (!user) {
                CustomError.createError({
                    message: ERRORS_ENUM["USER NOT FOUND"],
                });
            }

            const result = await userModel.updateOne({ _id: uid }, { role: user.role === "User" ? "premium" : "User" });

            if (!result) {
                return false;
            }

            return true
        } catch (error) {
            console.log(error);
        }
    }

    restoreMail = async (email) => {
        try {
            const user = await this.findUser(email);

            if (!user) {
                CustomError.createError({
                    message: "No existe email del usuario"
                })
            }

            let token = await tokenModel.findOne({ email: user._id });

            if (!token) {
                token = await new tokenModel({
                    userId: user._id,
                    toke: generateCode(),
                }).save();
            }

            const link = `${process.env.BASE_URL}/restoreForm/${user._id}/${token.token}`;

            await sendMail.send(user.email, "Password reset", link);

            return true;
        } catch (error) {
            console.log(error)
        }
    }

    findUserToken = async (uid, token) => {
        try {
            const userToken = await tokenModel.findOne({ userId: uid });

            return userToken;
        } catch (error) {
            console.log(error);
        }
    };

    restorePassword = async (uid, pass, token) => {
        try {
            const user = await this.findUserById(uid);

            if (!user) {
                CustomError.createError({
                    message: ERRORS_ENUM["USER NOT FOUND"],
                });
                return;
            }

            const userToken = await this.findUserToken(uid);

            if (!userToken) {
                CustomError.createError({
                    message: "Token invalido o expiro"
                })
                return;
            }

            const verifyPassword = isValidPassword(
                password,
                user.password
            );

            if (verifyPassword) {
                CustomError.createError({
                    message: "Contraseña invalida, utilizar una distinta a las anteriores",
                });

                return;
            }

            const result = await userModel.updateOne(
                { _id: uid },
                { password: createHash(password) }
            );

            if (!result) {
                return false;
            }

            await userToken.delete();

            return true;
        } catch (error) {
            console.log(error);
        }
    }
}

const UserService = new UserServices();

export default UserService;