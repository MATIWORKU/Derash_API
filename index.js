import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded( { extended: true }))
env.config();

app.get("/", (req, res) => {
    res.send("Hello World!!!");
})

app.get("/get", async (req, res) => {
    const result = await axios.get("https://api.qa.derash.gov.et/biller/customer-bill-data", {
        params: {
            bill_id: 120060
        },
        headers: {
            "api-key": process.env.API_KEY,
            "api-secret": process.env.API_SECRET
        }
    });
    console.log(result.data);
})

app.listen(port, () => {
    console.log("Server running on port " + port);
})