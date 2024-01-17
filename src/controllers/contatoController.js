const Contato = require('../models/ContatoModel');

exports.index = (req, res, next) => {
    res.status(200).render('addcontato');
};

exports.register = async (req, res, next) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                res.status(303).redirect('/contatos/add');
            });
            return;
        }

        req.flash('success', 'Contato cadastrado com sucesso');
        req.session.save(() => {
            res.status(303).redirect('/contatos/add');
        });
        return;

    } catch(err) {
        console.error(err);
        req.flash('errors', 'Ocorreu algum erro');
        req.session.save(() => {
            req.status(303).redirect('/contatos/add');
            return;
        }); 
        return;
    }
};

exports.edit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contato = await Contato.findOne(id);

        res.status(200).render('editcontato', { contato });

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

exports.update = async (req, res, next) => {
    try {
        const { id } = req.body;
        const contato = new Contato(req.body);
        await contato.update(id);

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                res.status(303).redirect(`/contato/edit/${id}`);
            });
            return;
        }

        req.flash('success', 'Contato atualizado com sucesso');
        req.session.save(() => {
            res.status(303).redirect(`/contato/edit/${id}`);
        });
        return;

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

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Contato.delete(id);

        req.flash('success', 'Contato deletado com sucesso');
        req.session.save(() => {
            res.status(303).redirect('back');
            return;
        });
        return;
    } catch(err) {
        console.error(err);
        req.flash('errors', 'Ocorreu algum erro ao tentar remover o contato');
        req.session.save(() => {
            req.status(303).redirect('back');
            return;
        }); 
        return;
    } 
};