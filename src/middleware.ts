import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

const JWT_SECRET = "passwd";

export const UserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_SECRET);
    if (decoded) {
        req.userId = (decoded as JwtPayload).id;
        next();
    }
    else {
        res.status(403).json({ message: "You are not Logged In." });
    }
};