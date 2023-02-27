import { connect, set } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export class MongoConnection{
    static #instance;

    constructor(){
        set("strictQuery", false);
        connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifieldTopology: true,
            dbName: process.env.DB_NAME,
        });
    }

    static getInstance = () => {
        if (this.#instance){
            console.log("Se encontraba conectado");
            return this.#instance;
        }
        this.#instance = new MongoConnection();
        console.log("Conectado!!!");
        return this.#instance;
    } 
}