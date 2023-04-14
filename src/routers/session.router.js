import { Router } from "express";
import passport from "passport";
import {
  changeUserRole,
  getAllUsers,
  getCurrentUser,
  getGithubCallback,
  getLogin,
  getLogout,
  getRegister,
  getRestore,
  getRestoreForm,
  postCreate,
  postLogin,
  postRestore,
  postRestoreForm,
} from "../controllers/users.controller.js";

const routerSession = Router();

//Register
routerSession.get("/register", getRegister);

routerSession.get(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/sessions/failregister",
  }),
  async (req, res) => {
    res.send("Registro Ok");
  }
);

routerSession.get("/failregister", async (req, res) => {
  console.error("Failed Strategy1");
  res.send({ error: "Failed" });
});

//Login
routerSession.get("/login", getLogin);

routerSession.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/sessions/faillogin" }),
  postLogin
);

routerSession.get("/faillogin", (req, res) => {
  res.send({ error: "Failed Login" });
});

//Creacion User
routerSession.post(
  "/create",
  passport.authenticate("register", {
    failureRedirect: "/sessions/failregister",
  }),
  postCreate
);

routerSession.get("/logout", getLogout);

routerSession.get("/current", getCurrentUser);

//Login Github
routerSession.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => { }
);

routerSession.get(
  "/githubCallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  getGithubCallback
);

routerSession.get("/restore", getRestore);

routerSession.post("/restore", postRestore);

routerSession.get("/restoreForm/:uid/:token", getRestoreForm);

routerSession.post("/restoreForm/:uid/:token", postRestoreForm);

routerSession.get("/", getAllUsers);

routerSession.get("/premium/:uid", changeUserRole);

export { routerSession as sessionRouter };
