"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "passwd";
const UserMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = jsonwebtoken_1.default.verify(header, JWT_SECRET);
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({ message: "You are not Logged In." });
    }
};
exports.UserMiddleware = UserMiddleware;
