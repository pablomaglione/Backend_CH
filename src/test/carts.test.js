import chai from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import dotenv from "dotenv";

dotenv.config();

const { expect } = chai;
const requester = supertest(process.env.BASE_URL);

describe("Cart API", () => {

  describe("GET /cart", () => {
    it("Podria obtener todos los carritos", (done) => {
      requester.get("/api/carts").end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.carts).to.be.an("array");
        done();
      });
    });
  });

  describe("GET /cart/:pid", () => {
    it("Podria obtener un carrito por ID", (done) => {
      const cartId = "";
      requester.get(`/api/carts/${cartId}`).end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body[0]).to.be.an("object");
        expect(res.body[0]._id).to.equal(cartId);
        done();
      });
    });

    it("Podria retornar error si el ID Carrrito es invalido", (done) => {
      const invalidCartId = "invalid_id";
      requester.get(`/api/carts/${invalidCartId}`).end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.an("object");
        done();
      });
    });
  });
});