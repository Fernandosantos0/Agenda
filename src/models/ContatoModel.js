const mongoose = require('mongoose');

/* Criando o Schema */
const ContatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: String,
    telefone: String,
    email: String
}, { timestamps: true });

/* Criando o model */
const ContatoModel = mongoose.model('Contato', ContatoSchema);

/* Função construtora para a manipulação dos dados */
function Contato(body) {
    this.body = body;
    this.errors = [];
}

Contato.prototype.register = async function() {
    this.validar();
    if(this.errors.length !== 0) return;

    await ContatoModel.create(this.body);
};

Contato.prototype.validar = function() {
    this.cleanUp();

    if(!this.body.nome) this.errors.push('O campo Nome precisa estar preenchido');

    if(!this.body.telefone && !this.body.email) this.errors.push('É preciso ter pelo menos um dos contatos (telefone ou e-mail) preenchido');
};

Contato.findAll = async function() {
    return await ContatoModel.find().sort({ createdAt: 1 });
};

Contato.findOne = async function(id) {
    await ContatoModel.findOne({ _id: id });
};

Contato.delete = async function(id) {
    await ContatoModel.findByIdAndDelete({ _id: id });
};

Contato.prototype.update = async function(id) {
    this.validar();
    if(this.errors.length !== 0) return;

    await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

Contato.prototype.cleanUp = function() {
    for(let key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        telefone: this.body.telefone,
        email: this.body.email
    };
};

/* Exportando o módulo */
module.exports = Contato;