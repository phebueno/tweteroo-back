import express from "express";
import cors from 'cors';
//import tweetsData from "./data/tweetsData.js";

//Variáveis globais para armazenamento
const tweets=[];
const users=[];

//Criação do App Servidor
const app = express();

//Configs do servidor
app.use(cors());
app.use(express.json());

//Registro do usuário
app.post("/sign-up",(req,res)=>{
    const {username, avatar} = req.body;
    users.push({username, avatar})
    res.send("OK");
});

//Post do tweet
app.post("/tweets",(req,res)=>{
    res.send("Postado com sucesso!");
});

//Retorna 10 últimos tweets
app.get("/tweets",(req,res)=>{
    const newestTenTweets = tweets;
    res.send(newestTenTweets);
});

const PORT = 5000;
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));

