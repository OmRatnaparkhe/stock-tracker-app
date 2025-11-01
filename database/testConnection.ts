import {connectToDatabase} from "@/database/mongoose";

async function main(){
    try{
        await connectToDatabase();
        console.log("Ok Database connection Successful");
        process.exit(0);
    }
    catch(e){
        console.error("Error connecting to database");
        console.error(e);
        process.exit(1);
    }
}


main();