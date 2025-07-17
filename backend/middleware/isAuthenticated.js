import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Retrieve token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.id = decoded.userId; // Attach the userId to the request
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default isAuthenticated;

const req = {
    id:"",
}
req.id = "sdlbgnjdfn"