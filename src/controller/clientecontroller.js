const db = require('../db/db'); // Módulo de conexão com o banco de dados
const Joi = require('joi'); // Biblioteca de validação de dados
const bcrypt = require('bcrypt'); // Para encriptação de senhas

//validação com joi
const clienteSchema = Joi.object({
    nome: Joi.string().required().max(50),
    // Nome deve ser string e é obrigatório
    endereco: Joi.string().required(),
    // Endereçp deve ser uma string e é obrigatório
    bairro: Joi.string().required(),
    // Bairro deve ser uma string e é obrigatório
    cidade: Joi.string().required(),
    // Cidade deve ser uma string e é obrigatório
    telefone: Joi.string().required(),
    // Telefone deve ser uma string e é obrigatório
    cpf: Joi.string().length(11).required(),
    //CPF deve ter uma string de exatamente 11 caracteres
    senha: Joi.string().min(6).required()
    // Senha deve ter no mínimo 6 caracteres e é obrigatório
});
// Listar todos os clientes
exports.listarClientes = async (req, res) => {
    try{
      const [result] = await db.query('SELECT * FROM cliente');
      res.json(result); // Aqui retornamos apenas os dados da consulta
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      res.status(500).json({ error: 'Erro interno do servidor'});
}
};

// Buscar um cliente por CPF
exports.listarClientesCpf = async (req, res) => {
    const { cpf } = req.params;
    try{
      const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado'});
      }
      res.json(result[0]);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      res.status(500).json({ error: 'Erro interno do servidor'});
}
};

// Adicionar um novo cliente
exports.adicionarCliente = async (req, res) => {
    const {nome, endereco, bairro, cidade, telefone, cpf, senha } = req.body;

    //Validação de dados
    const { error } = clienteSchema.validate({ nome, endereco, bairro, cidade, telefone, cpf, senha});
    if (error) {
      return res.status(400).json({ error: error.details[0].messsage});
} 
 try {
    // Criptografando a senha
    const hash = await bcrypt.hash(senha, 10);

    const novoCliente = { nome, endereco, bairro, cidade, telefone, cpf, senha: hash };
    await db.query('INSERT INTO cliente SET ?', novoCliente);

    res.json({ message: 'Cliente adicionado com sucesso'});
 } catch (err) {
   console.error('Erro ao adicionar cliente:', err);
   res.status(500).json({ error: 'Erro ao adicionar cliente'});
  }
};