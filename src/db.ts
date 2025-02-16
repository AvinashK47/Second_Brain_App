import mongoose,{ connect, Model, model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI='';

export async function ConnectDB() {
    try {
        await connect(MONGO_URI);
        console.log("Connected to Database!!!");
    }
    catch(err) {
        console.log("Mongoose Connection Error : ", err);
    }
}

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export const ContentSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    title: {
        type :String
    },
    tags: [{
        type: mongoose.Types.ObjectId,ref:'Tag'
    }],
    userId: [{
        type: mongoose.Types.ObjectId, ref: 'User',
        required :true
    }]
})

export const ContentModel = model("Content", ContentSchema);
export const UserModel = model("User",UserSchema);
