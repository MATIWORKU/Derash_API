import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;
const API_URL="https://api.qa.derash.gov.et/biller/customer-bill-data"

let isSend = false;
let newData = {};

app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))
app.use(express.static("public"))
env.config();

app.get("/", (req, res) => {
    res.render("index.ejs", { isSend: isSend, data: newData});
})

app.post("/", (req, res) => {
    req.body.filter === "send" ? isSend = true : isSend = false;
    if(isSend) newData = {};
    res.redirect("/");
})

app.post("/get", async (req, res) => {
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
    
    res.redirect("/");
})

app.post("/send", async (req, res) => {
    const  {data} = await axios.post(API_URL, {

            "bill_id": req.body.bill_id,
            "bill_desc": "TAX:200, Interest:100, TotalBalance:3000",
            "reason": "VAT_2017_06,TAX_2017",
            "amount_due": "23390432.20",
            "due_date": "2017-06-08",
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
    res.redirect("/");
} )

app.listen(port, () => {
    console.log("Server running on port " + port);
})