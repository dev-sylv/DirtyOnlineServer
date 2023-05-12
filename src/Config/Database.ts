import mongoose from "mongoose";
import { EnvironmentVariables } from "./EnvironmentVariables";

const db_Url = "mongodb://localhost/MalamOnline";

const LIVEURI = EnvironmentVariables.MONGODB_STRING;

export const DBCONNECTION = async () => {
  try {
    const conn = await mongoose.connect(db_Url);
    console.log("");
    console.log(`Database is connected to ${conn.connection.host}`);
    // if (LIVEURI) {
    //   const conn = await mongoose.connect(LIVEURI);
    //   console.log("");
    //   console.log(`Database is connected to ${conn.connection.host}`);
    // } else {
    //   const conn = await mongoose.connect(db_Url);
    //   console.log("");
    //   console.log(`Database is connected to ${conn.connection.host}`);
    // }
  } catch (error) {
    console.log("An error occured in connecting to DB", error);
  }
};
