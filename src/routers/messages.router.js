import express from "express";

const routerMessages = express.Router();

routerMessages.get("/", async (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error,
    });
  }
});

export { routerMessages as messagesRouter };