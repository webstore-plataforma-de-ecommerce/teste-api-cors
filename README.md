<h1>Processo - Marketplace</h1>

# 1- Clone o repositório para dentro do servidor:
Antes de clonar é necessário ter uma URL específica com seu Token de acesso:
<br>
No github, vá em https://github.com/settings/tokens e adicione uma nova key.
```sh
$ git clone https://USUÁRIO:TOKEN@github.com.br/REPO_OWNER/REPO
```
# 5- Prepare seu projeto:
Entre na pasta do seu repositório.
```sh
$ cd pasta\
```
Depois instale as dependências:
```sh
$ sudo npm install
```
# 6- Execute o projeto e faça testes:
Execute o seu projeto para realizar teste (Lembre-se de sempre usar o comando <b>sudo</b>
```sh
$ sudo node index.js
```
# 7- Usando o PM2
Por fim, você precisará manter seu projeto rodando a todo instante e essa é a função do PM2, ele também irá assistir por atualizações e reiniciar o seu projeto de forma automática.
Use o comando:
```sh
$ sudo pm2 start pm2.json
```

<h1>Iniciar a aplicação junto com servidor</h1>

Para iniciar a aplicação junto com o servidor, basta inciar a aplicação pela primeira vez e salvar o dump do processo usando o comando:
```sh
$ pm2 save
```

e após isso, basta usar o comando para iniciar o dump sempre que o servidor reiniciar:
```sh
$ pm2 startup
```


# Pronto, temos um projeto rodando! 😁

#   t e s t e - a p i - c o r s  
 #   t e s t e - a p i - c o r s  
 