import express,{Request, Response,Application} from 'express';
import { ConnectDB, ContentModel, UserModel } from './db';
import jwt from "jsonwebtoken";
import { UserMiddleware } from './middleware';
import cors from "cors";


const app:Application = express();

const JWT_SECRET = "passwd";

ConnectDB();

app.use(express.json());
app.use(cors());

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
			res.status(200).json({
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

app.post('/api/v1/signin', async (req: Request, res: Response) => {
	
	const username: string = req.body.username;
	const password: string | number = req.body.password;

	try {
		const existingUser = await UserModel.findOne({
			username: username,
			password: password
		});
	
		if (existingUser) {
			const JWtoken = await jwt.sign({ id: existingUser._id }, JWT_SECRET);
			res.status(200).json({ message: "You are now signed in", token: JWtoken });
			return;
		}
		else {
			res.status(403).json({
				message: "User Doesnt Exist , go to the signup page"
			});
			return;
		}
	}
	catch (err) {
		res.status(500).json({ message: "Server Error" })
		console.log("server error in signup endpoint :", err);
		return;
	}
});

app.post('/api/v1/content', UserMiddleware, async (req: Request, res: Response) => {
	const type: string = req.body.type;
	const link: string = req.body.link;
	const title: string = req.body.title;
	const tags: string = req.body.tags;

	await ContentModel.create({
		type: type,
		link: link,
		title: title,
		tags: tags,
	});

	res.json({ message: "Content Added" });
	return;
});

app.get('/api/v1/content', UserMiddleware, async (req: Request, res: Response) => {
	
	const userId = req.userId;

	const content = await ContentModel.find({
		userId: userId
	}).populate("userId");

	res.json({
		content: content
	});
	return;
});

app.delete('/api/v1/content', UserMiddleware, async (req: Request, res: Response) => {
	const contentId = req.body.contentId;
	
	const selectedContent = await ContentModel.deleteMany({
		contentId: contentId,
		userId: req.userId
	});
	res.json({ message: "Content deleted", Deleted_Content : selectedContent});
});

app.post('/api/v1/brain/share', UserMiddleware, (req: Request, res: Response) => {
	
});

app.get('/api/v1/brain/:shareLink', (req: Request, res: Response) => {
	
});

app.listen(3000, () => {
	console.log("Server is running at port 3000")
});