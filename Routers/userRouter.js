import express from 'express';
import { addStudents, assignMentor, createMentor, createStudent, getMentors, getPreviousMentors, getStudents } from '../Controllers/Controller.js';

const router = express.Router();

router.post('/createMentor',createMentor);
router.post('/createStudent',createStudent);
router.get('/getMentors',getMentors);
router.get('/getStudents',getStudents);
router.put('/addStudents/:id',addStudents);
router.put('/assignMentor/:id',assignMentor);
router.get('/getPreviousmentor/:id',getPreviousMentors);


export default router;