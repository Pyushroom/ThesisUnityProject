import express from "express";
import {quizzData, notificationData, UnityRegistration, UnityEmailVer, UnityLogin, getAssigmentsUnity, quizResultSubmitted, exerciseResultSubmitted} from "../controllers/unity.js";

const router = express.Router()

router.get('/quizzAll', quizzData );
router.get('/notification', notificationData );
router.post('/register', UnityRegistration );
router.post('/emailverification', UnityEmailVer);
router.post('/login', UnityLogin);
router.get('/assigments/:userId', getAssigmentsUnity);
router.post('/quizzResult/:userId/:assigmentId', quizResultSubmitted);
router.post('/exerciseResult/:userId/:assigmentId', exerciseResultSubmitted);



export default router;