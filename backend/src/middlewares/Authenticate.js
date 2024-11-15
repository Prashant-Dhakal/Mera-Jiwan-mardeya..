import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/Usermodel.js";
import jwt from "jsonwebtoken";

export const JwtVerify = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(400, "Token not found");
    }
    
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by ID and exclude sensitive fields
    const user = await User.findById(decodedToken?.userId).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification failed:", error);
    res.status(error.statusCode || 401).json({
      statusCode: error.statusCode || 401,
      message: error.message || "JWT verification failed: User not found or token is invalid."
    });
  }
};
