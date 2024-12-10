const express = require('express');
const router = express.Router();
const produtoController = require('../controller/produtoController')

router.get('/produto', produtoController.listarProdutos);
router.get('/produto/:codigoProduto', produtoController.listarcodigoProduto);
router.get('/produto/nome/:nomeProduto', produtoController.buscarProdutoNome);
router.post('/produto', produtoController.adicionarProduto);
router.put('/produto/:codigoProduto', produtoController.atualizarProduto);
router.delete('/produto/:codigoProduto', produtoController.deletarProduto);

module.exports = router;