import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("dbConnection : ", dbConnection);

        console.log(`\n MONGO DB Connected!! DB HOST : ${dbConnection.connection.host}`);

    } catch (error) {
        console.log("MONGO DB Connection ERROR", error);
        process.exit(1)
    }
}

export default connectDB