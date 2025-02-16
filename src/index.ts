import express,{Request, Response,Application} from 'express';
import { ConnectDB, UserModel } from './db';
import dotenv from 'dotenv';

const app:Application = express();

ConnectDB();

app.use(express.json());

app.post('/api/v1/signup',async (req:Request,res:Response) => {
    
    const username: string = req.body.username;
    const password: string | number = req.body.password;

    try {
            
        const existingUser = await UserModel.findOne({ username });
        
        if (existingUser) {
            res.status(403).json({
                message: "User already exists with this username"
            });
            return;
        }
        else {
            await UserModel.create({
                username: username,
                password: password
            })
            res.json({
                message: "User created Successfully"
            });
            return;
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server error" });
        return;
    }
})

app.post('/api/v1/signin', (req:Request, res:Response) => {
    
})


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})