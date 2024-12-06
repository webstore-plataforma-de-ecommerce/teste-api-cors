
// Function to list the products
exports.teste = async (req, res) => {

    let retorno = await getDataAPI('XXXXXX');

    console.log(retorno);

    return res.json({"sucess": false, "mensagem": retorno})

}

async function getDataAPI(token) {
    async function run_() {
      var config = {
        method: 'get',
        url: 'https://api-dashboard-v2.webstore.net.br/apidashboard/v2/category/list',
        headers: { 'authToken': token}
      };
      const resp = await axios(config)
      return resp.data
  
    }
    return run_()
  }
  