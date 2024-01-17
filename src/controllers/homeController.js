const Contato = require('../models/ContatoModel');

exports.index = async (req, res, next) => {
    try {
        const contatos = await Contato.findAll();
        res.status(200).render('index', { contatos: contatos });
    } catch(err) {
        console.error(err);
        req.flash('errors', 'Ocorreu algum erro');
        req.session.save(() => {
            req.status(303).redirect('back');
            return;
        }); 
        return;
    }
};