import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/" , (req,res)=> {
    res.render("index.ejs");
})

app.post("/submit" , async (req,res)=>{
    const URL = "https://v2.jokeapi.dev/joke";
    const category = req.body.Category;
    let Custom_list = req.body.custom;
    if(typeof(Custom_list) == Object) {
        Custom_list = Custom_list.join(",");
    }
    let cat = (category == "Any") ? category : Custom_list;
    const lang = req.body.lang;
    const selected = req.body.options;
    if(typeof(selected) == Object) {
        selected = selected.join(",");
    }
    const amount = req.body.amount;

    if(cat == undefined) {
        res.render("index.ejs" , {
            error : "Category / Categories is Not Defined."
        })
    } else {
    if(amount == 1) {
        if(selected == undefined) {
            let Base_URL = URL+"/"+cat+"?lang="+lang;
            let response = await axios.get(Base_URL);
            const joke = JSON.stringify(response.data.joke);
            const cate = JSON.stringify(response.data.category);
            if(joke != undefined) {
                res.render("response.ejs" , { content : joke , type : cate })
            } else {
                let setup = JSON.stringify(response.data.setup);
                let delivery = JSON.stringify(response.data.delivery);
                const cate = JSON.stringify(response.data.category);
                res.render("response.ejs" , { first : setup , second : delivery , type : cate })
            }
        } else {
            let Base_URL = URL+"/"+cat+"?lang="+lang+"&blacklistFlags="+selected;
            let response = await axios.get(Base_URL);
            const joke = JSON.stringify(response.data.joke);
            const cate = JSON.stringify(response.data.category);
            if(joke != undefined) {
                res.render("response.ejs" , { content : joke , type : cate })
            } else {
                let setup = JSON.stringify(response.data.setup);
                let delivery = JSON.stringify(response.data.delivery);
                const cate = JSON.stringify(response.data.category);
                res.render("response.ejs" , { first : setup , second : delivery , type : cate })
            }
        }
    } else {
        if(selected == undefined) {
            let Base_URL = URL+"/"+cat+"?lang="+lang+"&amount="+amount;
            let response = await axios.get(Base_URL);
            let content = response.data.jokes;
            let count = response.data.amount;
            res.render("response.ejs" , {
                arr : content,
                amt : count
            })
        } else {
            let Base_URL = URL+"/"+cat+"?lang="+lang+"&blacklistFlags="+selected+"&amount="+amount;
            let response = await axios.get(Base_URL);
            let content = response.data.jokes;
            let count = response.data.amount;
            res.render("response.ejs" , {
                arr : content,
                amt : count
            })
        }
    }
    }
})

app.listen(port,()=>{
    console.log("Listining on port : "+port);
})