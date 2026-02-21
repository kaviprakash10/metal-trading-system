// const mongoose=require('mongoose');
import mongoose from 'mongoose'
const ConfigureDB=async function(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("connected to db");

    }catch(err){
        console.log(`error connecting to db ${err}`)
    }
}

export default ConfigureDB;