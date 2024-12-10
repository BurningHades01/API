const Joi = require('joi');
const db = require('../db/db');

const produtoSchema = Joi.object({
    codigoProduto: Joi.string().required(),
    nomeProduto: Joi.string().required(). max(50),
    descricao: Joi.string().required(). max(100),
    valorUnit: Joi.string().required(),
    imagem: Joi.string().required()
});

exports.listarProdutos = async (req, res) => {
    try{
      const [result] = await db.query('SELECT * FROM produto');
      res.json(result);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro interno do servidor'})
    }
};

exports.listarcodigoProduto = async (req, res) => {
    const { codigoProduto } = req.params;
    try{
      const [result] = await db.query('SELECT * FROM produto WHERE codigoProduto = ?', [codigoProduto]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado'});
      }
      res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        res.status(500).json({ error: 'Erro interno do servidor'});
    }
};

exports.adicionarProduto = async (req, res) => {
    const {codigoProduto, nomeProduto, descricao, valorUnit, imagem } = req.body;

    const { error } = produtoSchema.validate({codigoProduto, nomeProduto, descricao, valorUnit, imagem});
    if (error) {
      return res.status(400).json({ error: error.details[0].message}); 
    }
    try {
        const novoProduto = {codigoProduto, nomeProduto, descricao, valorUnit, imagem};
        await db.query('INSERT INTO produto SET ?', novoProduto);
        res.json({ message: 'Produto adicionado com sucesso'});
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      res.status(500).json({ error: 'Erro ao adicionar produto'});
    }
  };

  exports.atualizarProduto = async (req, res) =>{
    const { codigoProduto } = req.params;
    const {nomeProduto, descricao, valorUnit, imagem} = req.body;

    const { error } = produtoSchema.validate({ codigoProduto, nomeProduto, descricao, valorUnit, imagem});
    if (error) {
      return res.status(400).json({ error: error.details[0].message});
    }
    try {
      const [result] = await db.query('SELECT * FROM cliente WHERE codigoProduto = ?', [codigoProduto]);
      if (result.length === 0) {
        return res.status(400).json({ error: 'Produto não encontrado' });
      }

      const produtoAtualizado = { codigoProduto, nomeProduto, descricao, valorUnit, imagem};
      await db.query('UPDATE produto SET ? WHERE codigoProduto = ?',[produtoAtualizado, codigoProduto]);
      res.json({ message: 'Produto atualizado com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar produto', err);
      res.status(500).json({ error: 'Erro ao atualizar produto'});
    }
  };

  exports.deletarProduto = async (req, res) => {
    const { codigoProduto } = req.params;
    try {
      const [result] = await db.query('SELECT * FROM produto WHERE codigoProduto = ?', [codigoProduto]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado'});
      }
      await db.query('DELETE FROM produto WHERE codigoProduto = ?', [codigoProduto]);
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  };
  exports.buscarProdutoNome = async (req, res) => {
    const { nomeProduto } = req.params;
    try {
      const [result] = await db.query('SELECT * FROM produto WHERE nomeProduto LIKE ?', [`${nomeProduto}%`]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(result);
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
