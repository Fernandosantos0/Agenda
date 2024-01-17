/* Importando o módulo */
const express = require('express');

/* Invocando o método Router */
const routes = express.Router();

/* Importando os controllers */
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { isLogado } = require('./src/middlewares/middleware');

/* PÁGINA INICIAL */
routes.get('/', homeController.index);

/* LOGIN */
routes.get('/login/index', loginController.index);
routes.post('/login/register', loginController.register);
routes.post('/login/logar', loginController.logar);

/* CONTATOS */
routes.get('/login/logout', loginController.logoff);
routes.get('/contatos/add', isLogado, contatoController.index);
routes.post('/contato/register', isLogado, contatoController.register);
routes.get('/contato/edit/:id', isLogado, contatoController.edit);
routes.post('/contato/update', isLogado, contatoController.update);
routes.get('/contato/remove/:id', isLogado, contatoController.remove);

/* Erro 404 */
routes.use((req, res, next) => {
    res.status(404).render('404');
});

/* Exportando o módulo */
module.exports = routes;