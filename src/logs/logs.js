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

function login(usuario) {
    let log = "O usuário: " + usuario + " logou no sistema."
    let operacao = "LOGIN"
    let tabela = "usuarios"
    inserirLog(operacao, usuario, tabela, log)
}

function logout(usuario) {
    let log = "O usuário: " + usuario + " deslogou no sistema."
    let operacao = "LOGOUT"
    let tabela = "usuarios"
    inserirLog(operacao, usuario, tabela, log)
}

function inserirLog(operacao, usuario, tabela, log) {
    let clientBancoDeDados = novoClient()
    clientBancoDeDados.connect()
    .then(() => console.log("Conexão bem sucedida com o banco de dados!"))
    .then(async () => {
        let subquery = "(SELECT '" + operacao + "', agora(), id_usuario, '" + tabela + "', '" + log + "' FROM usuarios WHERE usuario like " + usuario + ")"
        await clientBancoDeDados.query("INSERT INTO LOG(operacao, stamp, id_usuario, tabela, log)" + subquery)
        .catch(erro =>console.error("Erro ao tentar inserir log no banco de dados.", erro))
    })
    .catch(erro => {
        console.error("Erro ao tentar inserir log no banco de dados.", erro)
    })
    .finally(() => clientBancoDeDados.end())
}

module.exports.login = login
module.exports.logout = logout