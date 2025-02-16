"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
(0, db_1.ConnectDB)();
app.use(express_1.default.json());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            res.status(403).json({
                message: "User already exists with this username"
            });
            return;
        }
        else {
            yield db_1.UserModel.create({
                username: username,
                password: password
            });
            res.json({
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
}));
app.post('/api/v1/signin', (req, res) => {
});
app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
