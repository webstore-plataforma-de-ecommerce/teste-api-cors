// Declaring Global Modules
global.express = require('express') 
global.fs = require('fs')
global.axios = require('axios')
global.app = express.Router()

// Declaring the ERP / Marketplace URL
global.baseurl = 'https://url-base-do-marketplace.com.br/'

// Declaring Ports And Host Application URL
let [unsecurePort, securePort, host] = 
    process.argv[2] != '-dev' 
    ?
    [80, 443, 'https://url-base-do-projeto.com.br/'] 
    : 
    [3000, 3001, `http://localhost:3000/`]

// Inputing the vars on the global scope
global.unsecurePort = unsecurePort
global.securePort = securePort
global.host = host

// Function to save logs
global.infoLog = (obj) => {
    if (!obj) return
    if (!fs.existsSync(__dirname + '/LOGSWITCH.txt')) return
    if (fs.readFileSync(__dirname + '/LOGSWITCH.txt', 'utf-8') != 'true') return
    if (fs.existsSync(__dirname + '/../logs/')) fs.mkdirSync(__dirname + '/../logs/')

    let moment = new Date()
        moment.setHours(moment.getHours() - 3)
        moment = moment.toISOString()
    let name =  moment.replace('Z', '').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '-').replace('T', '_').replace('.', '-') + '_' + obj.title

    // Expected Json
        // obj = {
        //     title: '',
        //     id: '',
        //     head: '',
        //     method: '',
        //     url: '',
        //     statusCode: '',
        //     mktReturn: '',
        //     mktSend: '',
        //     body: ''
        // }

    function printVar(elm) {
        return typeof obj === 'object' && obj !== null ? JSON.stringify(elm) : elm;
    }

    let str = 
        `Data Of Log
        ${moment} ->
        \n\n Request Title:
        ${printVar(obj.title)}
        \n\n Request Order/Product:
        ${printVar(obj.id)}
        \n\n Return Code:
        ${printVar(obj.statusCode)}
        \n\n Return of MarketPlace:
        ${printVar(obj.mktReturn)}
        \n\n Headers send to MarketPlace:
        ${printVar(obj.head)}
        \n\n Request method:
        ${printVar(obj.method)}
        \n\n Endpoint:
        ${printVar(obj.url)}
        \n\n Json send to MarketPlace:
        ${printVar(obj.mktSend)}
        \n\n Json send from Webstore to Application:
        ${printVar(obj.body)}
    `
  
    fs.writeFileSync(__dirname + '/../logs/' + name + '.txt', str)
}
