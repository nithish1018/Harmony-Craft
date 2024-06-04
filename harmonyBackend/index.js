require("dotenv").config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  });
const app = express();
var cors = require('cors')
const {
   User,
   Music,
   Lyrics
  } = require("./models");
  const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const bcrypt = require("bcrypt");
const saltRounds = 10;
const PORT =  3000;
const { default: OpenAI } = require("openai"); 
const openai=new OpenAI({
    apiKey:process.env['OPENAI_API_KEY']
 })

app.use(cors())
app.post("/signup", async (request, response) => {
    try {
      const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
      console.log(hashedPwd);
      if (!request.body.name) {
        return response.status(400).json({ error: "All fields must be entered" });
      }
      if (!request.body.email) {
        return response.status(400).json({ error: "All fields must be entered" });
      }
      if (!request.body.password) {
        return response.status(400).json({ error: "All fields must be entered" });
      }
  
      const user = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: hashedPwd,
      });
      return response.status(200).json({ auth_token:user })
  
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error: "User with same email id already exists" });
    }
  });
  app.post("/login", async (request, response)=>{
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({ error: "All fields must be entered" });
    }
    try {
        const user = await User.getUser(request.body.email);
        if (!user) {
            return response.status(400).json({ error: "User does not exist" });
        }
        const match = await bcrypt.compare(request.body.password, user.password)
        if (!match) {
            return response.status(400).json({ error: "Invalid password" });
        }
        return response.status(200).json({ auth_token:user })
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error: error.message })
    }
  })

  app.post('/upload-music/:userId', upload.single('music'), async (request, response) => {
    console.log('Request URL:', request.url);
    console.log('Request Method:', request.method);
    console.log('Request Headers:', request.headers);
    console.log('Request File:', request.file); 
    try {
        if (!request.file) {
            throw new Error('No file uploaded.');
          }
    
          console.log('File Buffer Length:', JSON.stringify(request.file) + " ekbdjkb");
      // Save the uploaded music file to the database
      const musicBuffer = fs.readFileSync(request.file.path);
      await Music.create({
        music: musicBuffer,
        userID: request.params.userId
      });
  
      response.status(201).send('Music saved successfully!');
    } catch (error) {
      console.error('Error saving music:', error);
      response.status(500).send('Failed to save music.');
    }
  });
  app.post('/upload-lyrics/', async (request, response) => {
    try {
     
      await Lyrics.create({
        lyrics: request.body.lyrics,
      });
  
      response.status(201).send('Lyrics saved successfully!');
    } catch (error) {
      console.error('Error saving music:', error);
      response.status(500).send('Failed to save music.');
    }
  });

  app.get('/music/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Find all music files associated with the specified user ID
      const musicFiles = await Music.findAll({
        where: { userID: userId },
        attributes: ['id', 'music'],
      });
  
      res.json(musicFiles);
    } catch (error) {
      console.error('Error retrieving music files:', error);
      res.status(500).send('Failed to retrieve music files.');
    }
  });


  app.post('/generate_lyrics', async (req, res) => {
    const { theme, sentiment } = req.body;
  
    if (!theme || !sentiment) {
      return res.status(400).json({ error: 'Theme and sentiment are required' });
    }
  
    try {
      const lyrics = await generateLyricsOpenai(theme, sentiment);
      const musicType = await getMusicType(lyrics);
  
      return res.json({ lyrics, musicType });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  async function generateLyricsOpenai(theme, sentiment) {
    const prompt = `Write a full song about ${theme} with a ${sentiment} sentiment.`;
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
    });
    return response.choices[0].message.content.trim();
  }
  
  async function getMusicType(lyrics) {
    const prompt = `Take this lyrics ${lyrics} and strictly give exactly three suitable music patterns and styles names ONLY in a list form`;
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
    });
  
    return response.choices[0].message.content.trim();
  }


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  