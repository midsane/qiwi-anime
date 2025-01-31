import mongoose from "mongoose"

export const connectDb = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);

        console.log(
          `connetion established !! Host: ${connectionInstance.connection.host}`
        );
    }
    catch(error){
        console.log("database connection failed ", error)
        process.exit(1);
    }
}