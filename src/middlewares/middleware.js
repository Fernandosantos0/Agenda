exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user

    next();
};

exports.isLogado = (req, res, next) => {
    if(!req.session.user) {
        req.flash('errors', 'Você não estar logado no sistema');
        req.session.save(() => {
            res.status(303).redirect('back');
        });
        return;
    }

    next();
};