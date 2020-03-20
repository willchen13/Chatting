const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const rooms = {name: {}};

app.get('/', (req,res) => {
  res.render('index', {rooms: rooms})
});


app.post('/room', (req,res) => {
  //if there is already a room of that name

  // console.log(req.body, 'what is request');
  if(rooms[req.body.room] != null) {
    return res.redirect('/');
  }
  //if room doesnt exist create a new room
  rooms[req.body.room] = {users: {}}
  //redirect user to the new room route
  res.redirect(req.body.room);
  io.emit('room-created', req.body.room);
})

app.get('/:room', (req,res) => {
  //only render if the room exists in the rooms object
  // console.log('what is params', req.params.room);
  if(rooms[req.params.room]) {
    return res.render('room', {roomName: req.params.room})
  }
})

server.listen(3000);

const users = {}

io.on('connection', socket => {

    socket.on('new-user', name => {
      users[socket.id] = name;
      socket.broadcast.emit('user-connected', name);
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]});
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id]);
      delete users[socket.id];
    })

})