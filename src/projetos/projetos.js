const DATABASE_POSTGRE = process.env.DATABASE_POSTGRE
const HOST_POSTGRE = process.env.HOST_POSTGRE
const PASSWORD_POSTGRE = process.env.PASSWORD_POSTGRE
const PORT_POSTGRE = process.env.PORT_POSTGRE
const USER_POSTGRE = process.env.USER_POSTGRE
const SSL_POSTGRE = process.env.SSL_POSTGRE

const {Client} = require('pg')

function novoClient() {
    clientBancoDeDados = new Client({
        user: USER_POSTGRE,
        password: PASSWORD_POSTGRE,
        host: HOST_POSTGRE,
        port: PORT_POSTGRE,
        database: DATABASE_POSTGRE,
        ssl: SSL_POSTGRE
    })
    return clientBancoDeDados
}

function getProjetos(request, response) {
    let clientBancoDeDados = novoClient()
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(() => clientBancoDeDados.query("SELECT titulo, descricao, usuario as autor FROM projetos, usuarios WHERE id_autor = id_usuario"))
    .then(resultados => response.json(resultados.rows))
    .catch(erro => console.error("Erro ao tentar conectar com o banco de dados.", erro))
    .finally(() => clientBancoDeDados.end())
}

function inserirProjeto(request, response) {
    let clientBancoDeDados = novoClient()
    let titulo = request.body.titulo
    let descricao = request.body.descricao
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        let subquery = "(SELECT '" + titulo + "', '" + descricao + "', id_usuario FROM usuarios WHERE usuario like '" + usuario +"')"
        await clientBancoDeDados.query("INSERT INTO projetos(titulo, descricao, id_autor) " + subquery)
        .catch(erro =>console.error("Erro ao tentar cadastrar projeto no banco de dados.", erro))
    })
    .then(response.json({ "query" : true }))
    .catch(erro => {
        console.error("Erro ao tentar cadastrar projeto no banco de dados.", erro)
        response.json({ "query" : false })
    })
    .finally(() => clientBancoDeDados.end())
}

function deletarProjeto(request, response) {
    let clientBancoDeDados = novoClient()
    let titulo = request.body.titulo
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        let subquery = "(SELECT id_usuario FROM usuarios WHERE usuario = '" + usuario + "')"
        await clientBancoDeDados.query("DELETE FROM projetos WHERE titulo = $1 AND id_autor = " + subquery , [titulo])
        .catch(erro =>console.error("Erro ao tentar cadastrar projeto no banco de dados.", erro))
    })
    .then(response.json({ "query" : true }))
    .catch(erro => {
        console.error("Erro ao tentar deletar projeto no banco de dados.", erro)
        response.json({ "query" : false })
    })
    .finally(() => clientBancoDeDados.end())
}

function editarProjeto(request, response) {
    let clientBancoDeDados = novoClient()
    let titulo = request.body.titulo
    let tituloAntigo = request.body.tituloAntigo
    let descricao = request.body.descricao
    let usuario = request.body.usuario
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        let subquery = "(SELECT id_usuario FROM usuarios WHERE usuario = '" + usuario + "')"
        await clientBancoDeDados.query("UPDATE projetos SET titulo = $1, descricao = $2 WHERE titulo = $3 AND id_autor = " + subquery, [titulo, descricao, tituloAntigo])
        .catch(erro =>console.error("Erro ao tentar cadastrar projeto no banco de dados.", erro))
    })
    .then(response.json({ "query" : true }))
    .catch(erro => {
        console.error("Erro ao tentar editar projeto no banco de dados.", erro)
        response.json({ "query" : false })
    })
    .finally(() => clientBancoDeDados.end())
}

module.exports.getProjetos = getProjetos
module.exports.inserirProjeto = inserirProjeto
module.exports.deletarProjeto = deletarProjeto
module.exports.editarProjeto = editarProjeto