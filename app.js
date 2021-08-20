const express = require('express');

const app = express();

const port = 3000;

app.use(express.json()); //configura para usar json

const filmes = [
    'capitao america',
    'kimetsu no yaiba',
    'tartaruga ninja',
    'Os incrives'
];




// retorna apenas a msg
app.get('/', (req, res) => {
    res.send('hell bluemer')
})


// rota dos filmes - primeira rota - listagem dos filmes
app.get('/filmes', (req, res) => {
    res.send(filmes);
})
// o :id identifica que vamos receber um valor nela
// rota do filme individual por id. req vem do cliente para o servidor(requisição). res é a resposta do servidor para o cliente
app.get('/filmes/:id',(req, res) =>{
    const id = req.params.id - 1; // observe que se vc usa o params entao deve usar o nome da "variavel" id, se fosse mortadela vc usaria req.params.mortadela

    const filme = filmes[id];

    if(!filmes) {
        res.send("Filme não encontrado")
    }
    res.send(filme)


})

// lista - get 
// criar - post
// update - pu
// delete - delete

// rota que cadastra um novo filme

app.post('/filmes/', (req, res) => {
    const filme = req.body.filme; // no corpo da requisição acesse o filme que foi passado como objeto no seu corpo. (pra passar um novo elemento va em body e usando fomato json e atribua um valor ao filme)
    const id = filmes.length;
    filmes.push(filme);

    res.send(`filme adicionado com sucesos ${filme}. O ID do filme é ${id}`)
});


app.put('/filmes/:id', (req, res) => {
    const id = req.params.id - 1;
    const filme = req.body.filme;
    const filmeAnterior = filmes[id];
    filmes[id] = filme;
    res.send(`Filme anterior ${filmeAnterior},atualizado com sucesso para: ${filme}.`)
});


app.delete('/filmes/:id', (req, res) => {
    const id = req.params.id - 1;
    delete filmes[id];
    res.send(`Filme excluido com sucesso`);
})



app.listen(port, function() {
    console.log(`app rodando na porta http://localhost:${port}/`);
})