import { connect, set } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export class MongoConnection{
    static #instance;

    constructor(){
        set("strictQuery", false);
        connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifieldTopology: true,
            dbName: process.env.MONGO_DB,
        });
    }

    static getInstance = () => {
        if (this.#instance){
            console.log("Se encontraba conectado");
            return this.#instance;
        }
        this.#instance = new MongoConnection();
        //console.log("Conectado!!!");
        return this.#instance;
    } 
}