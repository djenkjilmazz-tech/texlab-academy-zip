import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'texlab-secret';

// In-memory DB
const users:any[] = [];
const courses = [
  { id: '1', title: 'ISO 3071 pH Test', equipment: 'pH Meter' }
];
const exams:any = {
  '1': [
    { q: 'What does ISO 3071 measure?', a: 'pH' }
  ]
};

// Auth
app.post('/auth/register', (req,res)=>{
  const user = { id: uuid(), ...req.body };
  users.push(user);
  res.json(user);
});

app.post('/auth/login', (req,res)=>{
  const user = users.find(u=>u.email===req.body.email);
  if(!user) return res.status(401).send('User not found');
  const token = jwt.sign({id:user.id}, SECRET);
  res.json({token});
});

// Courses
app.get('/courses', (req,res)=> res.json(courses));

// Exam
app.get('/exam/:courseId', (req,res)=>{
  res.json(exams[req.params.courseId]);
});

app.post('/exam/:courseId/submit', (req,res)=>{
  const passed = true;
  res.json({passed, certificateId: uuid()});
});

// Certificate
app.get('/certificate/:id', (req,res)=>{
  res.json({certificate: 'TexLab Certificate', id:req.params.id});
});

// Equipment recommendation
app.get('/equipment/:courseId', (req,res)=>{
  const course = courses.find(c=>c.id===req.params.courseId);
  res.json({recommended: course?.equipment});
});

app.get('/health', (_,res)=> res.json({status:'ok'}));

app.listen(3000, ()=>console.log('TexLab Full System running'));
