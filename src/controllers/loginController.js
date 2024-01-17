/* Importando o model */
const Login = require('../models/LoginModel');

const colors = require('colors');

exports.index = (req, res, next) => {
    res.status(200).render('login');
};

/* Controller para registrar um nova conta no mongoDB */
exports.register = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length !== 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                res.status(303).redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Conta criada com exito!');
        req.session.save(() => {
            res.status(303).redirect('/login/index');
        });
        return;
    } catch(err) {
        req.flash('errors', 'Ocorreu algum erro');
        req.session.save(() => {
            res.status(303).redirect('/login/index');
        });
    } finally {
        console.log('Fim da operação'.blue.bold);
    }
};

/* Controller para logar no sistema */
exports.logar = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length !== 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                res.status(303).redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Logado com sucesso');
        req.session.user = login.user;
        req.session.save(() => {
            res.status(303).redirect('back');
            return;
        });
        return;
    } catch(err) {
        req.flash('errors', 'Ocorreu algum erro');
        req.session.save(() => {
            res.status(303).redirect('/login/index');
        });
    } finally {
        console.log('Fim da operação'.blue.bold);
    }
};

/* Controller para o logoff do sistema */
exports.logoff = (req, res, next) => {
    req.session.destroy();
    res.status(303).redirect('back');
};