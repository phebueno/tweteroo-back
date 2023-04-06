import express from "express";
import cors from "cors";
import tweets from "./data/tweetsData.js";

//Variáveis globais para armazenamento
//const tweets=[];
const users = [
  {
    username: "bobesponja",
    avatar:
      "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
  },
  {
    username: "bobba",
    avatar: "a"
  },
];

//Criação do App Servidor
const app = express();

//Configs do servidor
app.use(cors());
app.use(express.json());

//Registro do usuário
app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  users.push({ username, avatar });
  res.send("OK");
});

//Post do tweet
app.post("/tweets", (req, res) => {
  const { username, tweet } = req.body;
  const usuarioCadastrado = users.find((user) => user.username === username);
  if (!usuarioCadastrado) return res.send("UNAUTHORIZED");
  tweets.push({ username, tweet });
  res.send("OK");
});

//Retorna 10 últimos tweets
app.get("/tweets", (req, res) => {
  const newestTenTweets = tweets.slice(-10);
  let newestTenTweetsAvatar = newestTenTweets.map((tweet) => ({
    ...tweet,
    avatar: users.find((user) => user.username === tweet.username).avatar, //vai dar erro se o usuário procurado não estiver cadastrado
  }));
  res.send(newestTenTweetsAvatar);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
