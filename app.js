require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes/route');
const PORT = process.env.PORT || 5000;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// const connectDB = require('./server/config/db');
// connectDB();

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI
//   }),
//   //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
// }));
mongoose.connect('mongodb+srv://bunny09262002:jEReem70XXaStpLS@987xy.zoq3ox9.mongodb.net/blogs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

process.on('SIGINT', () => {
  mongoose.connection.close()
      .then(() => {
          console.log('Disconnected from MongoDB');
          process.exit(0);
      })
      .catch(error => {
          console.error('Error disconnecting from MongoDB:', error);
          process.exit(1);
      });
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(router);
app.use(express.static('public'));
// app.use('/', router);

// app.get('/',(req, res)=>{
//     res.render('index');
//     // alternative res.render('index',{message : "Hello World"}); put <%= message %> in index.ejs file
// });


app.listen(PORT,()=>{
 console.log(`Server is Running On ${PORT}`);
});

