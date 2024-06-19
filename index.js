import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import env from "dotenv"


const app = express();
env.config();
const Port = 3000;


const db = new pg.Client({

  user : process.env.USER,
  host : process.env.HOST,
  database : process.env.DATABASE,
  password : process.env.PASSWORD,
  port : process.env.PORT

})

db.connect();
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("select * from items order by id asc");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Todo List",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("insert into items(title) values($1)" , [item]);
    //items.push({ title: item });
    res.redirect("/");

  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try{
    await db.query("update items set title = ($1) where id = ($2)" , [item , id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;

  try{
    await db.query("delete from items where id = ($1)" , [id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});


//Copyright 2024 - Shridhar Reddy
