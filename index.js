const express = require ('express');

const server = express();

server.use(express.json());//avisando para express usar json, 'use' passa o plugin

const users = ['Diego', 'Ygor', 'Victor'];

//middleware global
server.use((req, res, next ) => {
  //console.log('A requisicao foi chamada!');
  console.time(`Request`);
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);//middleware de log

  next();
  console.timeEnd(`Request`);
  
});

function checkUserExists(req, res, next) {
  //const user = users[req.params.index];
  if(!req.body.name){
    return res.status(400).json({error: `User name is required`});
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user){
    return res.status(400).json({error: `User does not exists`});
  }
  req.user = user; //nova variavel
  return next();
}

server.get('/users', (req, res)=> {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  //const {index} = req.params;
  //return res.json({ message: `Buscando o usuario ${id}`}) //route params
  //return res.json({message: `Hello ${nome}`}); //query params
  return res.json(req.user);
})

server.post('/users', checkUserExists, (req,res) => {
  const {name} = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req,res) => {
  const {index} =req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);

});

server.delete('/users/:index', checkUserInArray, (req,res) => {
  const {index} =req.params;
  
  users.splice(index, 1);//splice percorre o vetor e deleta 1 posicao

  return res.json(users);

});


server.listen(3000);