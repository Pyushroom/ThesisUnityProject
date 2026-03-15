import express from "express";
import {notificationData, 
    createTeam, 
    getTeamsData, 
    getStudentList, 
    joinTeam, 
    getAllQuizzes, 
    getAllQuestions, 
    createQuizz, 
    getOneQuizzes, 
    addQuestion, 
    getAllAssigments,
     getUserData, 
     addTeamUser, 
     searchUsers, 
     questionEdit, 
     updateCreatedQuiz,
     getOneTeamData,
     getTeamStudents,
     getTeamAssigments,
     getAssigmentInfo,
    getAssigmentQuiz,
    getAssigmentExercise,
    getAssigmentMemebers,
    getAssigmentQuizzes,
    getAssigmentExercises,
    createAssignment,
    modifyAssignmentInfo,
    getAssigmentStudents,
    quizQuestionDelete,
    updateAssigmentData,
    getAllExercises,
    getAllUserAssigments,
    getUserQuizAssigmentResult,
    deleteTeamUser,
    getAssigmentExerciseResult} from "../controllers/users.js";
import authenticateToken from "../middleware/AuthToken.js";

const router = express.Router()

router.get('/notification', notificationData );
router.post('/:userId/teams', createTeam );
router.get('/:userId/teams', getTeamsData );
router.get('/:userId/students', getStudentList );
router.post('/:userId/teams/join', joinTeam );
router.get('/:userId/quizzes', getAllQuizzes );
router.get('/:userId/quizz/:quizzId/questions', getAllQuestions );
router.post('/:userId/quizzes', createQuizz );
router.get('/:userId/quizz/create/:quizzId', getOneQuizzes );
router.post('/:userId/quizz/:quizzId/addquestion', addQuestion);
router.get('/:userId/assigments/teacher', getAllAssigments );
router.get('/user/profile/:userId', getUserData );
router.get('/search/:userName', searchUsers );
router.post('/:userId/addToTeam', addTeamUser );
router.post('/:userId/quizz/:quizzId/questions/:questionId/edit', questionEdit );
router.put('/:userId/quizz/create/:quizzId/save', updateCreatedQuiz );
router.get('/:userId/teams/team/:teamId', getOneTeamData );
router.get('/:userId/teams/team/:teamId/students', getTeamStudents );
router.get('/:userId/teams/team/:teamId/assigments', getTeamAssigments );
router.get('/:userId/assigments/assigment/:assigmentId/getInfo', getAssigmentInfo );
router.get('/:userId/assigments/assigment/:assigmentId/getQuiz', getAssigmentQuiz );
router.get('/:userId/assigments/assigment/:assigmentId/getExercise', getAssigmentExercise );
router.get('/:userId/assigments/assigment/:assigmentId/getMembers', getAssigmentMemebers );
router.get('/:userId/assigments/assigment/getQuizzes', getAssigmentQuizzes );
router.get('/:userId/assigments/assigment/getExercises', getAssigmentExercises);
router.post('/:userId/assigments/createAssigment', createAssignment);
router.get('/:userId/assigments/assigment/:assigmentId/info', modifyAssignmentInfo);
router.get('/:userId/teams/team/:teamName/assigmentStudents', getAssigmentStudents );
router.delete('/:userId/quizz/:quizzId/questions/:questionId/deleteQuestion', quizQuestionDelete );
router.put('/:userId/assigments/assigment/:assigmentId/update', updateAssigmentData );
router.get('/:userId/exercises', getAllExercises );
router.get('/:userId/assigments/student', getAllUserAssigments );
router.get('/:userId/assigments/assigment/:assigmentId/getResults', getUserQuizAssigmentResult );
router.delete('/:userId/leaveTeam', deleteTeamUser );
router.get('/:userId/assigments/assigment/:assigmentId/getResultsExercise', getAssigmentExerciseResult );



export default router;