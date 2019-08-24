const express = require('express')
const router = express.Router()

const logs = require('./logs')

router.post('/', async (request, response, next) => {
    let usuario = request.body.usuario
    query = await logs.logout(usuario)
    if (query) {
        response.json({ "query" : true })
    } else {
        response.json({ "query" : false })
    }
})

module.exports = router