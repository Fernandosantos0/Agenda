const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

/* Criando um Schema */
const LoginSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

/* Criando o model */
const LoginModel = mongoose.model('Login', LoginSchema);

/* Exportando a class de manipulação do banco */
module.exports = class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.cleanUp();
        this.validador();

        if(this.errors.length !== 0) return;

        await this.accountExists(this.body.email);
        if(this.errors.length !== 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.body = {
            email: this.body.email,
            password: this.body.password
        };

        /* Salvando no banco */
        await LoginModel.create(this.body)
    }

    async login() {
        this.cleanUp2();
        this.validadorLogin();

        if(this.errors.length !== 0) return;

        const conta = await LoginModel.findOne({email: this.body.email});

        if(!conta) this.errors.push('E-mail ou Senha incorreta');
        if(this.errors.length !== 0) return;

        if(!bcryptjs.compareSync(this.body.password ,conta.password)) this.errors.push('E-mail ou Senha incorreta');
        if(this.errors.length !== 0) return;

        this.user = conta;
    }

    validador() {
        if(!this.body.email) this.errors.push('O campo E-mail precisa ser preenchido.');

        if(!this.body.password) this.errors.push('O campo Senha precisa ser preenchido.');

        if(!this.body.repetir_senha) this.errors.push('O campo Repetir Senha precisa ser preenchido.');

        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

        if(this.body.password && this.body.email.length < 8 || this.body.email.length > 35) {
            this.errors.push('A senha precisa estar entre 8 a 35 caracteres');
        }

        if(this.body.password && this.body.repetir_senha && this.body.password !== this.body.repetir_senha) {
            this.errors.push('O campo Senha e Repetir Senha precisa ser iguais');
        }

        if(this.body.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/.test(this.body.password)) {
            this.errors.push('A senha precisa ter letras maiúsculas, letras minúsculas, números e caracteres especias');
        }
    }
    
    validadorLogin() {
        if(!this.body.email) this.errors.push('O campo E-mail precisa ser preenchido.');

        if(!this.body.password) this.errors.push('O campo Senha precisa ser preenchido.');

        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

        if(this.body.password && this.body.email.length < 8 || this.body.email.length > 35) {
            this.errors.push('A senha precisa estar entre 8 a 35 caracteres');
        }

        if(this.body.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/.test(this.body.password)) {
            this.errors.push('A senha precisa ter letras maiúsculas, letras minúsculas, números e caracteres especias');
        }
    }

    cleanUp() {
        for(let key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
            repetir_senha: this.body.repetir
        };
    }

    cleanUp2() {
        for(let key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }

    async accountExists(email) {
        const user = await LoginModel.findOne({email});

        if(user) {
            this.errors.push('Essa conta já existe.');
        }
    }
};