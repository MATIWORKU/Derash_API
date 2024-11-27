import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;
const API_URL="https://api.qa.derash.gov.et/biller/customer-bill-data";
const Headers = {
    "api-key": process.env.API_KEY,
    "api-secret": process.env.API_SECRET
}

let isSend = false;
let newData = {};
let message = "";

app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))
app.use(express.static("public"))
env.config();

app.get("/", (req, res) => {
    res.render("index.ejs", { isSend: isSend, data: newData, message: message});
})

app.post("/", (req, res) => {
    req.body.filter === "send" ? isSend = true : isSend = false;
    newData = {};
    message = "";
    res.redirect("/");
})

app.post("/get", async (req, res) => {
    try{
        const {data} = await axios.get(API_URL, {
            params: {
                bill_id: req.body.bill_id
            },
            headers: {
                "api-key": process.env.API_KEY,
                "api-secret": process.env.API_SECRET
            }
        });
        
        newData = data;
        message = "";
        res.redirect("/");
    }catch (err){
        message = err.response.data.message;
        console.log(err.response.data);
        res.redirect("/");
    }
    
})

app.post("/send", async (req, res) => {
    try{
        const  {data} = await axios.post(API_URL, {

            "bill_id": `${req.body.bill_id}`,
            "bill_desc": "TAX:200, Interest:100, TotalBalance:3000",
            "reason": `${req.body.reason}`,
            "amount_due": `${req.body.amount_due}`,
            "due_date": `${req.body.due_date}`,
            "partial_pay_allowed": true,
            "customer_id": "00457890",
            "name": "ABC International PLC",
            "mobile": "0929102030",
            "email": "support@derash.gov.et"
    }, {
        headers: {
            "api-key": process.env.API_KEY,
            "api-secret": process.env.API_SECRET
        }
    })
    data.message = `Successfully created Bill with this confirmation code ${data.confirmation_code}`
    newData = data;
    message = "";
    res.redirect("/");
    }catch (err){
        // newData = {};
        message = err.response.data.message;
        console.log(err.response.data);
        res.redirect("/");
    }
    
} )

app.post("/status", async (req, res) => {
    try{
        const {data} = await axios.get("https://api.qa.derash.gov.et/biller/customer-paid-bill", {
            params: {
                bill_id: `${req.body.bill_id}`
            },
            headers: {
                "api-key": process.env.API_KEY,
                "api-secret": process.env.API_SECRET
            }
        });
        const {paid_dt: date, paid_amount: amount} = data;
        
        message = `The Bill With id ${req.body.bill_id} was paid at ${new Date(date).toISOString().slice(0, 10)} with an amount of ${amount}.`
        res.redirect("/");

    }catch (err){
        // newData = {};
        message = err.response.data.message;
        console.log(err.response.data);
        res.redirect("/");
    }
})

app.listen(port, () => {
    console.log("Server running on port " + port);
})