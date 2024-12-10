const Joi = require('joi');
const db = require('../db/db');

const produtoSchema = Joi.object({
    codigoEntregador: Joi.string().required(),
    nomeEntregador: Joi.string().required(). max(50),
    cpfEntregador: Joi.string().length(11).required(),
    telefone: Joi.string().required()
});

exports.listarEntregador = async (req, res) => {
    try{
      const [result] = await db.query('SELECT * FROM entregador');
      res.json(result);
    } catch (err) {
      console.error('Erro ao buscar entregador:', err);
      res.status(500).json({ error: 'Erro interno do servidor'});
}
};

exports.listarEntregadorCpf = async (req, res) => {
    const { codigoEntregador } = req.params;
    try{
      const [result] = await db.query('SELECT * FROM entregador WHERE codigoEntregador = ?', [codigoEntregador]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Entregador não encontrado'});
      }
      res.json(result[0]);
    } catch (err) {
      console.error('Erro ao buscar entregador:', err);
      res.status(500).json({ error: 'Erro interno do servidor'});
}
};

