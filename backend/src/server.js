const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app); //extraindo servidor criado do express para nosso servidor http
const io = socketio(server); //nosso servidor passa a poder ouvir o protocolo websocket

mongoose.connect('mongodb+srv://<username>:<password>@cluster0-igrf8.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const connectedUsers = {};//Não é a melhor forma caso fosse para produção. Usaria um BD para armazenamento rápido de dados brutos

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;

}); //representa as infos da conexão de um cliente

app.use((req, res, next) => {
    req.io = io;//disponibiliza acesso ao socket.io para toda a aplicação
    req.connectedUsers = connectedUsers; //disponibiliza os usuários conectados para toda a app

    return next();//serve para continuar o fluxo de trabalho (depois disso executará o próximo app.use)
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes);

server.listen(3333);
 
