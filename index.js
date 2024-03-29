const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server,{
    cors: {
        origin: '*',
        methods : ['GET', 'POST'] 
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on("connection",(socket)=>{
    console.log('User connected');

    socket.emit("me",socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on('call_user', ({userToCall , signalData , From , name }) => {
        io.to(userToCall).emit('calluser', {signal : signalData , From , name});
    });

    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal);
    });

})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

