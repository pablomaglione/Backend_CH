import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import UserDto from "../DTO/user.dto.js";
import CartServices from "./carts.services.js";

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
      const result = await userModel.findOne({ email: username }).lean().exec();
      if (!result) {
        console.error("Usuario no existe");
        return done(null, false);
      }
      const user = new UserDto(result);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  findUserById = async (uid) => {
    try {
      const user = await userModel.findById({ _id: uid }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  registerUser = async (req, username, password, done) => {
    const newUser = req.body;
    try {
      const user = await this.findUser(username);
      if (user) {
        console.log("User already exits");
        return done(null, false);
      }

      const hashUser = {
        ...newUser,
        cart: await CartServices.createCart(),
        password: createHash(newUser.password),
      };
      const createUser = await userModel.create(hashUser);
      return done(null, createUser);
    } catch (error) {
      return done("Error to register " + error);
    }
  };

  loginUser = async (username, password, done) => {
    try {
      const user = await this.findUser({ email: username }).lean().exec();
      if (!user) {
        console.error("User donst exist");
        return done(null, false);
      }

      if (!isValidPassword(user, password)) return done(null, false);

      const dtoUser = new UserDto(user);
      return done(null, dtoUser);
    } catch (error) {
      return done(error);
    }
  };

  changeRole = async (uid) => {
    try {
      const user = await this.findUserById(uid);

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });
      }

      if (user?.role === "USER") {
        const userDocuments = user?.documents.map((document) => {
          console.log(document);

          if (!document) {
            CustomError.createError({
              name: "DOCUMENT NOT FOUND",
              message: "YOU DONT HAVE ANY DOCUMENT UPLOADED",
            });
          }

          const result = path.parse(document.name).name;

          console.log(result);

          return result;
        });

        console.log(userDocuments);

        if (
          !userDocuments?.includes("identificación") &&
          !userDocuments?.includes("comprobante de domicilio") &&
          !userDocuments?.includes("comprobante de estado de cuenta")
        ) {
          CustomError.createError({
            name: "Credenciales invalidas",
            message: "Must upload ",
          });

          return false;
        }
      }

      const result = await userModel.updateOne(
        { _id: uid },
        { role: user?.role === "USER" ? "PREMIUM" : "USER" }
      );

      if (!result) return false;

      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

const UserService = new UserServices();

export default UserService;
