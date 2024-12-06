const controller = require(__filename.replace('routes', 'controllers'))

app.get('/teste', controller.teste)


module.exports = app