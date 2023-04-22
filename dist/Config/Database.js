"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBCONNECTION = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EnvironmentVariables_1 = require("./EnvironmentVariables");
const db_Url = "mongodb://localhost/MalamOnline";
const LIVEURI = EnvironmentVariables_1.EnvironmentVariables.MONGODB_STRING;
const DBCONNECTION = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(db_Url);
        console.log("");
        console.log(`Database is connected to ${conn.connection.host}`);
    }
    catch (error) {
        console.log("An error occured in connecting to DB");
    }
});
exports.DBCONNECTION = DBCONNECTION;
