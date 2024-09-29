const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const db = require('./models'); 
const nodemailer = require('nodemailer');
require('dotenv').config();

const uploadMiddleware = multer({ dest: 'uploads/' });

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
    port: 587, 
    secure: false,
    // service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: 'ynuboubmccwhoqqj',
  },
  tls: {
    rejectUnauthorized: false,
  }
});

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


db.sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => console.error('Error syncing database:', err));


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});


app.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body;
  const user = await db.User.findOne({ where: { username } });
  if (!user) {
    return res.status(400).json('User not found');
  }

  const passOk = bcrypt.compareSync(password, user.password);
  if (passOk) {
    jwt.sign({ username, id: user.id }, secret, {}, (err, token) => {
      if (err) throw err;
    console.log(token);
    return res.json({
        id: user.id,
        username,
        token
      });
    });

  } else {
    res.status(400).json('Wrong credentials');
  }
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  }
  
});


app.get('/profile', (req, res) => {
  try{
    console.log(req)
    const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; 

    // const { token } = req.headers;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  } 
});

app.post('/logout', (req, res) => {
  console.log(here);
  try{
    res.cookie('token', '').json('ok');
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  }

});


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try{
    console.log(req.body)
    const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.body;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const post = await db.Post.create({
      title,
      summary,
      content,
      cover: newPath,
      authorId: info.id,
    });
    res.json(post);
  });
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  }
  
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  try{
    console.log("here updaete")
    let newPath = null;
    console.log(req.file, req.cookies)
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }
  
    const { token } = req.body;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const post = await db.Post.findByPk(id);
      if (post.authorId !== info.id) {
        // return res.json({
        //   statuscode: 400,
        //   message: "you are not the author"
        // })
        return res.status(400).json('You are not the author');
      }
      await post.update({
        title,
        summary,
        content,
        cover: newPath ? newPath : post.cover,
      });
      res.json(post);
    });
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  }
 
});


app.get('/post', async (req, res) => {
  try{
    const posts = await db.Post.findAll({
      include: [{ model: db.User, as: 'author', attributes: ['username'] }],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    console.log("---------------",posts)
    res.json(posts);
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  }

});


app.get('/post/:id', async (req, res) => {
  try{
    const { id } = req.params;
  const post = await db.Post.findByPk(id, {
    include: [{ model: db.User, as: 'author', attributes: ['username'] }],
  });
  console.log(post);
  res.json(post);
  }
  catch(e){
    console.log(e);
    res.status(400).json(e);
  }
  
});






app.post('/resume/forward', uploadMiddleware.single('resume'), async (req, res) => {
  try {
    const { userId, forwardTo } = req.body; 

    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const resume = await db.Resume.create({
      userId,
      filename: req.file.originalname,
      filepath: req.file.path,
    });


    const mailOptions = {
      from: 'sureshsmarty1997@gmail.com', 
      to: forwardTo, 
      subject: 'Forwarded Resume',
      text: 'Please find the attached resume.',
      attachments: [
        {
          filename: resume.filename,
          path: resume.filepath,
        },
      ],
    };

    console.log("Sending email with the following options:", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred during email send:", error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      console.log("Email sent successfully:", info.response);
      res.status(200).json({ message: 'Resume uploaded and forwarded successfully', resume });
    });

  } catch (err) {
    console.error("Error occurred during resume upload or email forwarding:", err);
    res.status(500).json({ error: 'Failed to upload and forward resume' });
  }
});



app.get('/resume', async (req, res) => {
  try {
    const resumes = await db.Resume.findAll({
      include: [{ model: db.User, as: 'user', attributes: ['username'] }],
    });
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});


app.listen(4000, () => {
  console.log('Server running on port 4000');
});
