const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Usuario = require('./models/Usuario'); // Importa o modelo Usuario
const app = express();
const SECRET_KEY = 'seu_segredo_super_secreto'; // Troque por uma chave segura

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware para processar dados do corpo da requisição e cookies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login', error: null });
});

// Rota para processar o login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await Usuario.findOne({ where: { email } });
        if (user && await user.validPassword(senha)) {
            const token = jwt.sign({ id: user.id_usuario }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/home');
        } else {
            res.render('login', { pageTitle: 'Login', error: 'Email ou senha incorretos' });
        }
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.render('login', { pageTitle: 'Login', error: 'Erro ao conectar ao banco de dados' });
    }
});

// Rota para a página de cadastro
app.get('/register', (req, res) => {
    res.render('register', { pageTitle: 'Cadastro', error: null });
});

// Rota para processar o cadastro
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const existingUser = await Usuario.findOne({ where: { email } });

        if (existingUser) {
            res.render('register', { pageTitle: 'Cadastro', error: 'Email já está em uso' });
        } else {
            await Usuario.create({ nome, email, senha });
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.render('register', { pageTitle: 'Cadastro', error: 'Erro ao cadastrar usuário' });
    }
});

// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.redirect('/login');
            }
            req.user = user;
            next();
        });
    } else {
        res.redirect('/login');
    }
};

// Rota para a página inicial (home)
app.get('/home', authenticateJWT, (req, res) => {
    res.render('home', { pageTitle: 'Home' });
});

// Redireciona a rota raiz para a página de login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Inicia o servidor
app.listen(8080, () => {
    console.log('App rodando na porta 8080');
});
