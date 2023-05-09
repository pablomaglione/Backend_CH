import chai from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";


const { expect } = chai;
const requester = supertest(process.env.BASE_URL);

describe("Session API", () => {
  const user = {
    email: "pablomaglione@gmail.com",
    password: "secret123",
  };
 
  describe("Login", () => {
    it("Redirección a página fallida", async () => {
      const res = await requester.post("/api/sessions/login").send(user);
      expect(res.status).to.be.equal(302);
    });
  });
  it("incorrectPassword message", async () => {
    await requester.post("/api/sessions/login").send(user); 
    const res = await requester.get("/api/sessions/faillogin");
    expect(res.status).to.be.equal(401);
    expect(res.body.response).to.be.equal("Usuario y/o contraseña incorrectos");
  });
});