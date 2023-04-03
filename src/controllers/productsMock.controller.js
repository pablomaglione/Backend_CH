import { saveGenerateProducts } from "../services/productsMock.services.js";

export const generateMockProducts = (req, res) => {
  try {
    const products = saveGenerateProducts();

    res.status(200).send({ payload: products });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send("Ha ocurrido un error");
  }
};
