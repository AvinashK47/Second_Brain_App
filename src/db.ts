import {connect, model,Schema} from "mongoose"

export async function ConnectDB() {
    try {
        await connect("mongodb+srv://avinash:passwor@123@cluster0.i8r3m.mongodb.net/");
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

export const UserModel = model("User",UserSchema);
