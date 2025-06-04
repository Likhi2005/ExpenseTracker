import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            status: "failed",
            message: "Authentication failed, no token provided"
        });
    }

    const token =authHeader.split(" ")[1];

    try {
        
        const userToken = JWT.verify(token,process.env.JWT_SECRET);
        console.log("Decoded token:", userToken);

        req.user={
            userId:userToken?.userId,
        };

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "failed",
            message: "Authentication failed, invalid token"
        });


    }
};

export default authMiddleware;