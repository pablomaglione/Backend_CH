import chai from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import dotenv from "dotenv";

dotenv.config();

const { expect } = chai;
const requester = supertest(process.env.BASE_URL);

describe("Products API", () => {

  describe("GET /api/products", () => {
    it("Podria obtener todos los productos", (done) => {
      requester.get("/api/products").end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.payload).to.be.an("array");
        done();
      });
    });
  });

  describe("GET /api/products/:pid", () => {
    it("Podria obtener un producto por ID", (done) => {
      const pid = "63d439fa2fd4d00716c44619"; 
      requester.get(`/api/products/${pid}`).end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body[0]).to.be.an("object");
        expect(res.body[0]._id).to.equal(pid);
        done();
      });
    });

    it("Podria retornar error si el ID producto es invalido", (done) => {
      const invalidProductId = "invalid_id";
      requester.get(`/products/${invalidProductId}`).end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.an("object");
        done();
      });
    });
  });
});