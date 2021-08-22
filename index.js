const express = require('express');

const app = express();

const port = 3000;

app.use(express.json()); //configura para usar json

const filmes = [
    {
        id: 1,
        nome: "My Hero Academia",
        imagemUrl: "https://derf9v1xhwwx1.cloudfront.net/image/upload/w_404,h_404,c_fill,q_60/oth/FunimationStoreFront/2358905/English/2358905_English_ShowThumbnail_d2c561bf-b5d9-4897-b746-224765b34bee.jpg"
    },
    {
        id: 2,
        nome: "Tensei Shitara Slime Datta Ken",
        imagemUrl: "https://cdn.maioresemelhores.com/imagens/mm-anime-1-cke.jpg"
    },

    {
        id: 3,
        nome: "Haikyuu!!",
        imagemUrl: "https://cdn.maioresemelhores.com/imagens/mm-anime-9-cke.jpg"
    }
];

// funções de validação


// essa função retorna somente os elementos validos, se forem null que é false não será retornada. quando ela só tem uma linha não precisa usar {} nem a palavra return
const getFilmesValidos = () => filmes.filter(Boolean);

// cria uma função que passa como parametro o id
// retorna uma lista de filmes validos, a partir dessa lista passa cada elemento por parametro e vai retornar o primeiro elemento que satisfaz a condiçãoo
// vai procurar elemento.id que for igual ao id passado como parametro  (essa é a condição especiifica do find, portanto ele vai retornar o primeiro elemento com esse id )

const getFilmesById = (id) => getFilmesValidos().find((elemento) => elemento.id == id);

// esse maldito código acima que está cheio de função setinha é a msm coisa que isso aqui 

// const getFilmesById = function (id) {
//     for (let i = 0; i < filmes.length; i++) {
//         if (filmes[id - 1].id == id) {
//             return filmes[id - 1]
//         }
//     }
// }

// o findIndex é parecido com o find mas com a diferença de quando achar o elemento ele vai retornar o indice da primeira ocorrencia
const getIndexByFilme = (id) => getFilmesValidos().findIndex((filme) => filme.id == id);

// function pegaIndice(id) {
//     let filmesValidos = getFilmesValidos(id);
//     for (let i = 0; i < filmesValidos.length; i++) {
//         if(filmesValidos.id == id){
//             console.log();
//         }

//     }

// }

// retorna apenas a msg
app.get('/', (req, res) => {
    res.send('hell bluemer')
});


// rota dos filmes - primeira rota - listagem dos filmes
app.get('/filmes', (req, res) => {
    res.send(getFilmesValidos());
});




// o :id identifica que vamos receber um valor nela
// rota do filme individual por id. req vem do cliente para o servidor(requisição). res é a resposta do servidor para o cliente
app.get('/filmes/:id', (req, res) => {
    const id = req.params.id; // observe que se vc usa o params entao deve usar o nome da "variavel" id, se fosse mortadela vc usaria req.params.mortadela
    // console.log(typeof id)
    const filme = getFilmesById(id);

    if (!filme) {
        res.send("Filme não encontrado")
    }
    res.send(filme)


})

// CRUD   - CREATE, READ, UPDATE, DELETE 
//METODOS -  post, get, put, delete

// lista - get 
// criar - post
// update - put
// delete - delete

// rota que cadastra um novo filme

app.post('/filmes/', (req, res) => {
    const filme = req.body; // no corpo da requisição acesse o filme que foi passado como objeto no seu corpo. (pra passar um novo elemento va em body e usando fomato json e atribua um valor ao filme)

    // se filme ou nome ou imagemurl for false , ou seja, esta vazio, ele se tornará true para passar no bloco de codigo q mostra a mensagem de erro
    if (!filme || !filme.nome || !filme.imagemUrl) {
        res.status(400).send({
            message: "Filme invalido. Tente novamente",
        });
        return; // pra q eu n sei kk
    }

    // ele pega o indice do array do ultimo filme e dps o filme com seus dados
    const ultimoFilme = filmes[filmes.length - 1];

    if (filmes.length) { // se o tamanho do filmes for maior q 0 quer dizer q ele é true, logo passará pela condição
        filme.id = ultimoFilme.id + 1; // aí ele pega o filme que recebemos na requisição acessa o id dele e atribiu um novo indice, esse indice é o ultimo indice dos elementos de filmes + 1 para o atribuito id que está dentro de filme realmente representar a sua posição dentro do array
        filmes.push(filme) // o push adiciona o elemento a ultima posição do array filmes

    } else {
        filme.id = 1;
        filmes.push(filme);
    }



    res.send(`filme adicionado com sucesos ${filme.nome}. O ID do filme é ${filme.id}`)
});

//atualiza

app.put('/filmes/:id', (req, res) => {
    const id = +req.params.id; // esse mais transforma para number(quse igual ao parseTnt)
    console.log(`o id passado é: ${id}`);

    const filmeIndex = getIndexByFilme(id);
    console.log(`o index do id ${id} é ${filmeIndex}`)

    if (filmeIndex < 0) {
        res.status(404).send({
            message: "O filme não foi encontrado, tente novamente."
        });
        return;
    }

    const novoFilme = req.body;

    // esse obj.keys verifica se dentro do objeto passado como parametro existe a configuração de chave:valor
    // ele retorna uma lista com as chaves desse objeto passado como parametro. Dps ele verifica o tamanho e como o js interpreta acima de 1 como true e 0 como false, ele vai dar true usamos ! para transformar em false para não entrar na mensagem de erro, ou seja, o novoFilme tem sim elementos dentro dele tornando-o valido para uso. 
    if (!Object.keys(novoFilme).length) {
        res.status(400).send({
            message: "O body esta vazio!"
        });
        return;
    }

    if (!novoFilme || !novoFilme.nome || !novoFilme.imagemUrl) {
        res.status(400).send({
            message: "filme inválido, tente novamente."
        });
        return;
    }

    const filme = getFilmesById(id);

    // spread operator é uma forma de atribuir valores sem precisar iterar manualmente sobre cada chave dos elemento de um obj. Esse filmes em determinada posição do array vai receber a estrutura de filme (id, nome, imagemUrl) e receber os valores do novoFilme que tbm possui as msm chaves. ele atualiza o elemento!
    filmes[filmeIndex] = {
        ...filme,
        ...novoFilme,
    };

    // se não fosse usando o spread seria algo assim: 

    // function atualizaFilme(id) {
    //     filmes[id].id = novoFilme.id;
    //     filmes[id].nome = novoFilme.nome;
    //     filmes[id].imagemUrl = novoFilme.imagemUrl;
    // }

    res.send(filmes[filmeIndex]);



});

// deleta
app.delete('/filmes/:id', (req, res) => {
    const id = +req.params.id;

    const filmeIndex = getIndexByFilme(id);

    if (filmeIndex < 0) {
        res.status(404).send({
            message: "filme não encontrado, tente novamente."
        });
        return;
    }

    // splice corta o indice passado no primeiro parametro e a quantidade a partir dele do segundo parametro, no caso 1 é somente ele
    filmes.splice(filmeIndex, 1);
    res.send({
        message: "filme removido com sucesso!"
    });


})



app.listen(port, function () {
    console.log(`app rodando na porta http://localhost:${port}/`);
})

