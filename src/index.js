const express = require('express')
const app = express()
const cors = require('cors')

const bancoDeDados = require('./acesso_ao_banco')
const cadastrosRoutes = require('./routes/cadastros')
const loginRoutes = require('./routes/login')
const logoutRoutes = require('./routes/logout')
const logsRoutes = require('./routes/logs')
const projetosRoutes = require('./routes/projetos')

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
const PORTA = process.env.PORT || 5000

var corOptions = {
    "origin": CORS_ORIGIN,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}

app.use(cors(corOptions)) // Habilitando acesso de outra origem Cross-Origin Resource Sharing
app.use(express.json()) // Transforma o JSON do body em um objeto JavaScript

app.get('/', indexHandler)
app.get('/:usuario', usuarioHandler)

app.use('/login', loginRoutes)
app.use('/logout', logoutRoutes)
app.use('/logs', logsRoutes)
app.use('/cadastro', cadastrosRoutes)
app.use('/projetos', projetosRoutes)

app.listen(PORTA)

function indexHandler(request, response) {
    response.send("Bem-vindo a API do site UXP!")
}

function usuarioHandler(request, response, next) {
    let clientBancoDeDados = bancoDeDados.novoClient()
    let usuario = request.params.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT usuario FROM usuarios WHERE usuario = $1", [usuario]))
    .then(resultado => {
        if (resultado.rows[0] === undefined) {
            response.json({ "usuarioExiste" : false })
        } else {
            response.json({ "usuarioExiste" : true })
        }
    })
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
}