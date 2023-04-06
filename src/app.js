import express from "express";
import cors from "cors";
//import tweets from "./data/tweetsData.js";

//Variáveis globais para armazenamento
const tweets = [];
const users = [
  {
    username: "bobesponja",
    avatar:
      "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
  },
  {
    username: "bobba",
    avatar: "a",
  },
];

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
  const { username, tweet } = req.body;
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
  const newestTenTweets = tweets.slice(-10);
  let newestTenTweetsAvatar = newestTenTweets.map((tweet) => ({
    ...tweet,
    avatar: users.find((user) => user.username === tweet.username).avatar, //vai dar erro se o usuário procurado não estiver cadastrado
  }));
  res.send(newestTenTweetsAvatar);
  //Adicionar .reverse() para que inverter a ordem em que os tweets são enviados
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
