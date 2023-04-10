import express from "express";
import cors from "cors";

//Variáveis globais para armazenamento
const tweets = [];
const users = [];


//Criação do App Servidor
const app = express();

//Configs do servidor
app.use(cors());
app.use(express.json());

function validate400(...fields) {
  let error = "";
  let message = "OK";
  fields.forEach((field) => {
    if (!field || typeof field !== "string") {
      console.log("achou erro");
      error = 400;
      message = "Todos os campos são obrigatórios!";
    }
  });
  return { error, message };
}

function getAvatar(usuarioDoTweet){
    const imgAvatar = users.find((user) => user.username === usuarioDoTweet).avatar;
    return imgAvatar;
}

//Registro do usuário
app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  const { error, message } = validate400(username, avatar);
  if (error) return res.status(error).send(message);
  else {
    users.push({ username, avatar });
    res.status(201).send(message);
  }
});

//Post do tweet
app.post("/tweets", (req, res) => {
  const username = req.headers.user;
  console.log(username);
  const { tweet } = req.body;
  const { error, message } = validate400(username, tweet);
  if (error) return res.status(error).send(message);
  else {
    const usuarioCadastrado = users.find((user) => user.username === username);
    if (!usuarioCadastrado) return res.status(401).send("UNAUTHORIZED");
    tweets.push({ username, tweet });
    res.status(201).send(message);
  }
});

//Retorna 10 últimos tweets
app.get("/tweets", (req, res) => {
  const {page} = req.query;
  let minPage = undefined;
  let maxPage = -10;
  if(page){
    if(page < 1) res.status(400).send("Informe uma página válida!");
    maxPage = -(page*10);
    minPage = Number(page) ===1 ? undefined : maxPage+10;
  }
  
  const newestTenTweets = tweets.slice(maxPage, minPage); //adicionar aqui limites de múltiplos de 10
  const newestTenTweetsAvatar = newestTenTweets.map((tweet) => ({
    ...tweet,
    avatar: getAvatar(tweet.username), //vai dar erro se o usuário procurado não estiver cadastrado
  }));
  res.send(newestTenTweetsAvatar.reverse());
  //Adicionar .reverse() para que inverter a ordem em que os tweets são enviados
});

//Retorna tweets do usuário
app.get("/tweets/:username", (req, res) => {
  const usuario = req.params.username;
  const tweetsUser = tweets.filter(tweet=>tweet.username===usuario);
  if(tweetsUser.length===0) return res.send([]);
  const tweetsObj = tweetsUser.map((tweet) => ({
    ...tweet,
    avatar: getAvatar(usuario),
  }));
  res.send(tweetsObj.reverse());
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
