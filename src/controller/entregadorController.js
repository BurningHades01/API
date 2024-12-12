const Joi = require('joi');
const db = require('../db/db');

const entregadorSchema = Joi.object({
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

exports.adicionarEntregador = async (req, res) => {
    const {codigoEntregador, nomeEntregador, cpfEntregador,  telefone} = req.body;

    //Validação de dados
    const { error } = entregadorSchema.validate({codigoEntregador, nomeEntregador, cpfEntregador,  telefone });
    if (error) {
      return res.status(400).json({ error: error.details[0].messsage});
} 
 try {
   const novoEntregador = { codigoEntregador, nomeEntregador, cpfEntregador,  telefone };
    await db.query('INSERT INTO entregador SET ?', novoEntregador);

    res.json({ message: 'Entregador adicionado com sucesso'});
 } catch (err) {
   console.error('Erro ao adicionar entregador:', err);
   res.status(500).json({ error: 'Erro ao adicionar entregador'});
  }
};

exports.atualizarEntregador = async (req, res) =>{
    const { codigoEntregador } = req.params;
    const {nomeEntregador, cpfEntregador,  telefone} = req.body;
    const { error } = entregadorSchema.validate({ codigoEntregador, nomeEntregador, cpfEntregador,  telefone});
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    try {
      const [result] = await db.query('SELECT * FROM entregador WHERE codigoEntregador = ?', [codigoEntregador]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Entregador não encontrado' });
      }
      const entregadorAtualizado = {codigoEntregador, nomeEntregador, cpfEntregador,  telefone };
    await db.query('UPDATE entregador SET ? WHERE codigoEntregador = ?', [entregadorAtualizado, codigoEntregador]);
    res.json({ message: 'Entregador atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar entregador:', err);
    res.status(500).json({ error: 'Erro ao atualizar entregador' });
  }
};

exports.deletarEntregador = async (req, res) => {
    const { codigoEntregador } = req.params;
    try {
      const [result] = await db.query('SELECT * FROM entregador WHERE codigoEntregador = ?', [codigoEntregador]);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Entregador não encontrado'});
      }
      await db.query('DELETE FROM entregador WHERE codigoEntregador = ?', [codigoEntregador]);
      res.json({ message: 'Entregador deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar entregador:', err);
      res.status(500).json({ error: 'Erro ao deletar entregador' });
    } 
  };