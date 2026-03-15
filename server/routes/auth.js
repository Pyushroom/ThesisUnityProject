import express from "express";
import {register, login, logout, emailVerify} from "../controllers/auth.js";
import authenticateToken from "../middleware/AuthToken.js";

const router = express.Router()

router.get("/auth", (req, res) => {
    res.json('this is auth')
})

router.post('/register', register );
router.post('/login', login );
router.post('/logout', authenticateToken, logout );
router.post('/emailVerify',  emailVerify );

export default router;
