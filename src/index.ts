import express, {Request,Response,RequestHandler} from 'express';
import { ConnectDB, UserModel } from './db';

const app = express();

ConnectDB();

app.use(express.json());

app.post('/api/v1/signup',async (req:Request,res:Response) => {
    
    const username: string = req.body.username;
    const password: string | number = req.body.password;

    try {
            
        const existingUser = await UserModel.findOne({ username });
        
        if (existingUser) {
            return res.status(403).json({
                message: "User already exists with this username"
            });
        }
        else {
            await UserModel.create({
                username: username,
                password: password
            })
            return res.json({
                message: "User created Successfully"
            });
                
        }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server error" });
    }
})

app.post('/api/v1/signin', (req, res) => {
    
})


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})