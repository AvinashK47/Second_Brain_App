"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const JWT_SECRET = "passwd";
(0, db_1.ConnectDB)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/api/v1/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = await db_1.UserModel.findOne({ username });
        if (existingUser) {
            res.status(403).json({
                message: "User already exists with this username"
            });
            return;
        }
        else {
            await db_1.UserModel.create({
                username: username,
                password: password
            });
            res.status(200).json({
                message: "User created Successfully"
            });
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server error" });
        return;
    }
});
app.post('/api/v1/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = await db_1.UserModel.findOne({
            username: username,
            password: password
        });
        if (existingUser) {
            const JWtoken = await jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_SECRET);
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
        res.status(500).json({ message: "Server Error" });
        console.log("server error in signup endpoint :", err);
        return;
    }
});
app.post('/api/v1/content', middleware_1.UserMiddleware, async (req, res) => {
    const type = req.body.type;
    const link = req.body.link;
    const title = req.body.title;
    const tags = req.body.tags;
    await db_1.ContentModel.create({
        type: type,
        link: link,
        title: title,
        tags: tags,
    });
    res.json({ message: "Content Added" });
    return;
});
app.get('/api/v1/content', middleware_1.UserMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await db_1.ContentModel.find({
        userId: userId
    }).populate("userId");
    res.json({
        content: content
    });
    return;
});
app.delete('/api/v1/content', middleware_1.UserMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    const selectedContent = await db_1.ContentModel.deleteMany({
        contentId: contentId,
        userId: req.userId
    });
    res.json({ message: "Content deleted", Deleted_Content: selectedContent });
});
app.post('/api/v1/brain/share', middleware_1.UserMiddleware, (req, res) => {
});
app.get('/api/v1/brain/:shareLink', (req, res) => {
});
app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
