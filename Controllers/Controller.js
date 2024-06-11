import { Mentor, Student } from "../Models/Schema.js";

export const createMentor = async(req,res) =>{
    try{
        const mentor = new Mentor(req.body)
        await mentor.save();
        console.log(mentor)
        res.status(200).json({message:"mentor created",data:mentor});
    }catch(err){
        if(err.keyValue){
            res.status(500).json({message:"mentor already exists in this email",error:err});
        }
    }
   
}

export const createStudent = async(req,res) =>{
    try{
        const student = new Student(req.body)
        await student.save();
        console.log(student)
        res.status(200).json({message:"student created",data:student});
    }catch(err){
        if(err.keyValue){
            res.status(500).json({message:"student already exists in this email",error:err});
        }
    }   
   
}

export const addStudents = async(req,res,next) =>{
    try{
        const mentorId = req.params.id;
        const {studentValues} = req.body;
        if(!Array.isArray(studentValues)){
            res.status(404).json({message:"Values are not in an array"})
         };

        const selectedMentor = await Mentor.findById(mentorId) ;
         if(!selectedMentor){
            res.status(404).json({message:"No mentor in this ID"})
         }

         const allStudents = await Student.find();
         const already = allStudents.filter((e)=> e.mentor[0]).map(e=>e._id);
        const toAssign = allStudents.filter((e)=> !e.mentor[0]);

        const result = toAssign.filter(e=>studentValues.includes(e._id+'')).map(e=>e._id)
         selectedMentor.students.push(...result);
         await selectedMentor.save()
        
        await Student.updateMany({_id:{$in:result}},{$set:{mentor:selectedMentor}});
    
        res.status(200).json({data:selectedMentor,NotAdded:already})
    }catch(err){
        console.log(err)
        res.status(500).json({data:"erro in operation",error:err})
    }
    
}

export const assignMentor = async(req,res) =>{
    try{
        const studId = req.params.id;
        const {newMentor} = req.body;
        const stud = await Student.findById(studId);
      const oldMentor = await Mentor.findById(stud.mentor[0]);
      if(oldMentor){
        console.log(oldMentor);
        oldMentor.students.pull(studId)
        oldMentor.save();
      }
       
        if(!stud){
            res.status(404).json({message:"No student in the ID"})
        }

        const mentor = await Mentor.findById(newMentor);
        if(!mentor){
            res.status(404).json({message:"No mentor in the ID"})
        }

        if(stud.mentor.length>0){
            const studMentor = stud.mentor+'';
            stud.mentor.pull(studMentor);
            stud.mentor.push(newMentor);
            stud.previousMentor.push(studMentor);
        }else{
            stud.mentor.push(newMentor);
        } 
       
        await stud.save();
        console.log(mentor.students)
        if(mentor.students.includes(studId)){
            mentor.students.pull(studId);
            mentor.students.push(studId);
        }else{
            mentor.students.push(studId);
        }
       
        await mentor.save();

        res.status(200).json({student:stud,mentor:mentor});
    }catch(err){
        res.status(500).json({error:err});
        console.log(err)
    }
    
}

export const getStudents = async(req,res) => {
    try{
        const students = await Student.find({},{_id:1,studentName:1,studentEmail:1,course:1,mentor:1}).populate('mentor');
        if(!students){
            res.status(500).json({message:"error in students data"});
        }
        res.status(200).json({message:"students",Students:students});
    }catch(err){
        console.log(err);
        res.status(500).json('error in getting students');
    }
    
}

export const getMentors = async(req,res) => {
    try{
        const mentor = await Mentor.find().populate('students','-previousMentor');
        if(!mentor){
            res.status(500).json({message:"error in mentor data"});
        }
        res.status(200).json({message:"mentors",mentor:mentor});
    }catch(arr){
        console.log(err);
        res.status(500).json('error in getting mentor');
    }
    
}

export const getPreviousMentors = async(req,res) =>{
    try{
      const studId = req.params.id;
      const student = await Student.findById(studId,{_id:1,studentName:1,studentEmail:1,course:1,previousMentor:1}).populate('previousMentor');
      if(!student){
        res.status(404).send('student Could not be found');
      }

      res.status(200).json({data:student})
    }catch(err){
     res.status(500).json({message:"error",error:err})
    }
}