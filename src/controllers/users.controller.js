import dotenv from "dotenv";
import UserService from "../services/users.services.js";

dotenv.config();

export const getRegister = (req, res) => {
  try {
    res.render("sessions/register");
  } catch (error) {
    req.logger.error(error);
  }
};

export const getLogin = (req, res) => {
  try {
    res.render("sessions/login", {});
  } catch (error) {
    req.logger.error(error);
  }
};

export const getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/sessions/login");
  });
};

export const postLogin = (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .render("errors/base", { error: "Error en username y/o password" });
  }

  req.session.user = req.user;
  req.session.user.role =
    req.user.email == "admin@pablo.com" ? "admin" : "user";
  res.redirect("/products");
};

export const postCreate = (req, res) => {
  res.status(200).res.redirect("/sessions/login");
};

export const getCurrentUser = (req, res) => {
  try {
    const user = req.session.user;

    res.status(200).render("/sessions/user", { user });
  } catch (error) {
    req.logger.error(error);
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { uid } = req.params;

    await UserService.changeRole(uid);

    res.status(200).send({
      message: "Usuario cambio de Rol",
    });
  } catch (error) {
    req.logger.error(error);

    return res.status(404).send({ message: "SOMETHING WENT WRONG" });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!req.files)
      return res.status(404).send({ message: "SOMETHING WENT WRONG" });

    const filesValues = Object.values(req.files);

    filesValues.map(async (arrayOfFiles) => {
      return arrayOfFiles.map(async (file) => {
        const newDocument = {
          name: file.originalname,
          reference: file.path,
        };

        await UserService.updateUpload(uid, newDocument);

        return;
      });
    });

    res.status(200).send({
      message: `Documento cargado correctamente`,
    });
  } catch (error) {
    req.logger.error(error);

    return res.status(404).send({ message: "SOMETHING WENT WRONG" });
  }
};

export const updateUpload = async (uid, newDocument) => {
  try {
    const user = await userModel.findById({ _id: uid }).lean().exec();

    if (!user) {
      CustomError.createError({
        name: ERRORS_ENUM["USER NOT FOUND"],
        message: ERRORS_ENUM["USER NOT FOUND"],
      });

      return;
    }

    return await userModel.updateOne(
      { _id: uid },
      { $push: { documents: newDocument } }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getGithubCallback = (req, res) => {
  req.session.user = req.user;
  res.redirect("/products");
};
