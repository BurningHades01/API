// IMPORTAÇÃO DE TODAS AS DEPENDÊNCIAS
require('dotenv').config(); // Carrega variáveis de ambiente de um arquivo .env
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const db = require('./db/db')


const routes = require('./routes/routes'); // importa as rotas
const clienteRoutes = require('./routes/clienteroutes');
const produtoRoutes = require('./routes/produtoRoutes');
const entregadorRoutes = require('./routes/entregadorRoutes');
const corsOptions = {
    origin: ['http://localhost:3333', 'https://meudominio.com'], //lista de origens permitidas
    methods: 'GET, POST, PUT, PATCH, DELETE', //métodos HTTP permitidos
    credentials:true, //Permite o envio de Cookies
};


const app = express();
//O APP IRÁ RECEBER O EXPRESS E TODAS SUAS DEPENDÊNCIAS
//Middlewares de segurança e utilidades
app.use(helmet()); // Protege a aplicação com headers de segurança
app.use(cors(corsOptions)); // Habilita o CORS
app.use(morgan('dev')); // Loga as requisições no console
app.use (express.json()); // Converte os dados recebidos para JSON 

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname,'public'))); // Pasta de arquivos estáticos
// O PATH RETORNA O CAMINHO DE FORMA DINÂMICA

//Rota para servir o home.html como sendo nossa página principal
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

// Configuração de rotas
//APÓS DECLARAR NOSSAS ROTAS, AQUI FALAMOS PARA NOSSO APP USAR ELAS COMO REDERÊNCIA
app.use('/', routes);

app.use('/', clienteRoutes);

app.use('/', produtoRoutes);

app.use('/', entregadorRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('algo deu errado !');
});

//Inicialização do servidor
//AQUI DEFINIMOS QUEM IRÁ ESCUTAR NOSSO CHAMADO E NOS RESPONDER
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

