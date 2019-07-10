const projetos = require('./projetos/projetos')
const cadastros = require('./cadastros/cadastros')

module.exports.getProjetos = projetos.getProjetos
module.exports.inserirProjeto = projetos.inserirProjeto
module.exports.deletarProjeto = projetos.deletarProjeto
module.exports.editarProjeto = projetos.editarProjeto
module.exports.login = cadastros.login
module.exports.inserirCadastro = cadastros.inserirCadastro
module.exports.deletarCadastro = cadastros.deletarCadastro
module.exports.editarCadastro = cadastros.editarCadastro