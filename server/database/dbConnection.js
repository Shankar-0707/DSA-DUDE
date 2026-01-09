import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName : "DSA-DUDE"
    }).then(() => {
        console.log(`Connected to Database Successfully`);
    }).catch((err) => {
        console.log(`Error while connecting with database, Error => ${err.message}`);
    })
}

export default dbConnection;