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

app.get(':/room', (req,res) => {
  if(rooms[req.params.room]) {
    res.render('room', {roomName: req.params.room})
  }
})

app.post('/room', (req,res) => {
  //if there is already a room of that name
  if(rooms[req.body.name] != null) {
    return res.redirect('/');
  }
  rooms[req.body.room] = {users: {}}
  res.redirect(req.body.room); 
  io.emit('room-created', req.body.room);
})

app.listen(3000);

io.on('connection', socket => {

    const users={}
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