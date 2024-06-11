import express from 'express';
import { addStudents, assignMentor, createMentor, createStudent, getMentors, getPreviousMentors, getStudents, getStudentsOfMentor } from '../Controllers/Controller.js';

const router = express.Router();

router.post('/createMentor',createMentor);
router.post('/createStudent',createStudent);
router.get('/getMentors',getMentors);
router.get('/getStudents',getStudents);
router.put('/addStudents/:id',addStudents);
router.put('/assignMentor/:id',assignMentor);
router.get('/getPreviousmentor/:id',getPreviousMentors);
router.get('/getMentorStudents/:id',getStudentsOfMentor);

export default router;