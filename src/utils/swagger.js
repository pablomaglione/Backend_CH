import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import _dirname from "../dirname.js"

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion",
      description: "Documentación del backend e-commerce",
    },
  },
  apis: [`${_dirname}/Docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

const swaggerConfig = {
  serve: swaggerUiExpress.serve,
  setup: swaggerUiExpress.setup(specs),
};

export default swaggerConfig;
