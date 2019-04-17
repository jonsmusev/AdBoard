import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';
import * as socketIo from 'socket.io';
import ChatController from './controllers/chat';
import ImController from './controllers/im';


import setRoutes from './routes';

//setup /TODO перенеси в отдельный файл

var DIR = './uploads/';
var upload = multer({dest: DIR}).single('file');

//app



const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

//sockets
//let http = require('http').Server(app);
let server = app.listen(3001);
let io = require('socket.io').listen(server);
var userList = [];
let users = {} ;
let socketUsers = {};
const chatController = new ChatController();
var imController: ImController;

io.on('connection', function(socket: any){
  console.log('a user connected ' + socket.id);

  socket.on('auth', (userId) => {
    console.log("auth Received: " + userId);
    users[userId] = socket.id;
    socketUsers[socket.id] = userId;
    console.log("добавлен пользователь: " + JSON.stringify(users) + JSON.stringify(socketUsers));
    userList.push({socketId: socket.id, userId: userId});
  });

   socket.on('getDialog',  async (targetId) => {
     let messages = await chatController.getMessages((socketUsers[socket.id]), targetId);
     //console.log("Список сообщений getDialog: " + JSON.stringify(messages));
     io.to(socket.id).emit('setDialog', messages);
   });

  socket.on('message', async (message) => {
    //chatController.sendTestMessage(message, res, next);
    console.log("Message Received: " + JSON.stringify(message));
    await console.log('Отправляю пользователю: ' + users[message.targetId] + ' ' + message.targetId);
    console.log("Список пользователей:" + JSON.stringify(userList));
    console.log("Socket.getDialog: " + JSON.stringify(users));
    console.log("Socket.getDialog: " + JSON.stringify(socketUsers[socket.id]));
    //io.emit('message', {messageContent: 'Пришло с сервака', senderId: 'avatar3', timestamp: '1542499000524'});
    io.to(users[message.receiverId]).emit('message', message);
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected ' + socket.id);
    userList.splice(userList.indexOf("socketId" === socket.id),1);
  });
});

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(multer({
  dest: DIR,
  rename: function (fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }}).single('file')); //плохо!!


app.use(morgan('dev'));
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

});

// без этого загрузка файлов не работает
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin',  'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/* не работает
app.use(multer({
  dest: DIR,
  rename: function (fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
}));

*/

//todo перенести в роуты


app.get('/api/files', function (req, res) {
  res.end('file catcher example');
});

/*
app.post('/api/files', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.end(err.toString());
    }

    console.log(JSON.stringify(req));
    res.end(req.body.filename);
  });
});
 */

/*
app.post('/api/files', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})
*/

app.post('/api/files', upload/*.single('file')*/, function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req['file'].filename);
  res.end(req['file'].filename);
})

export { app };
