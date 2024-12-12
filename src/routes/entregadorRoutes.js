const express = require('express');
const router = express.Router();
const entregadorController = require('../controller/entregadorController')

router.get('/entregador', entregadorController.listarEntregador);
router.get('/entregador/:codigoEntregador', entregadorController.listarEntregadorCpf);
router.get('/entregador/nome/:nomeEntregador', entregadorController.nomeEntregador);
router.post('/entregador', entregadorController.adicionarEntregador);
router.put('/entregador/:codigoEntregador', entregadorController.atualizarEntregador);
router.delete('/entregador/:codigoEntregador', entregadorController.deletarEntregador);

module.exports = router;
