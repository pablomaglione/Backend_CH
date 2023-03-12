import dotenv from "dotenv";

dotenv.config();

export const Auth = (policies) => (req, res, next) => {
    const role = req.user.role;

    if(role != policies){
        return res.status(403).send({error: "No autorizado"})
    }

    next();
}