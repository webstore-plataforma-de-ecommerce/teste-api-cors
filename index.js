// Global Variables
require('./config/global.js')

// Declaring Variables
const morgan = require('morgan'), cors = require('cors'),
      http = require('http'), https = require('https'),
      bodyParser = require('body-parser')

// Certificate
const credentials = {
  key: fs.readFileSync(__dirname + '/server.key'),
  cert: fs.readFileSync(__dirname + '/server.cert')
}

// Express settings
const app = express()
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }))
    app.use(express.static(__dirname + '/views'))
    app.use(express.static(__dirname + '/public'))
    app.engine('html', require('ejs').renderFile)
    app.set('view engine', 'html')
    app.use(express.json({limit: '20mb'}))
    app.use(cors())

// Include Routes
fs.readdirSync(__dirname + '/routes/').forEach(file => { app.use(require(__dirname + '/routes/'+file)) })

// Threading Error
app.use((error, req, res, next) => {
  return res.status(400).json({'sucesso': false, 'mensagem': error.toString() })
})

// Starting both http & https servers
const httpServer = http.createServer(app), httpsServer = https.createServer(credentials, app)

httpServer.listen(unsecurePort, console.log('HTTP Server running on port ' + unsecurePort))
httpsServer.listen(securePort, console.log('HTTPS Server running on port ' + securePort))