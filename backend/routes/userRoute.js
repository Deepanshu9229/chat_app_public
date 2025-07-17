//userRoute.js
// Middleware Routing
import express from "express";
import { getOtherUser, register } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";


const router = express.Router();

router.route("/register").post(register);  // sets up a route on the server for the POST request to /register
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated,getOtherUser);

export default router;
