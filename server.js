require('dotenv').config();

/* Importando os módulos */
const colors = require('colors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStrore = require('connect-mongo');
const session = require('express-session');
const path = require('path');
const middleware = require('./src/middlewares/middleware');

/* Importando o arquivo de rotas */
const routes = require('./routes');

/* Invocando o express */
const app = express();

/* Configurando o view template */
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'src', 'views'));

/* Habilitando a captura de dados pelo body */
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

/* Conectando á base de dados */
mongoose.connect(process.env.STRINGCONNECT)
    .then(() => {
        console.warn('Conexão com o mongoDB estabelecida'.blue.bold);
        app.emit('server-on');
    })
    .catch((err) => {
        console.error('Erro ao estabelecer uma conexão com o mongoDB'.red.bold);
        console.error(err);
    })
    .finally(() => {
        console.log(new Date(Date.now()));
    })

/* Segurança */
app.use(cors());
app.use(helmet());

const sessionObj = session({
    secret: 'americalatina1',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7
    },
    store: MongoStrore.create({
        mongoUrl: process.env.STRINGCONNECT,
        ttl: 60 * 60 * 24 * 7
    })
});

/* Criando uma pasta estático */
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionObj);
app.use(flash());
app.use(middleware.middlewareGlobal);
app.use(routes);

/* Subindo o servidor */
app.on('server-on', () => {
    const port = process.env.PORT || 3000;
    const host = 'localhost';
    app.listen(port, host, function() {
        console.warn('Inicializando o Express'.yellow.bold);
        console.log(`Server ON - http://${host}:${port}`.green.bold);
    });
});
