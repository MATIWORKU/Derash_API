import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded( { extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World!!!");
})

app.get("/get", async (req, res) => {
    const result = await axios.get("https://api.qa.derash.gov.et/biller/customer-bill-data", {
        params: {
            bill_id: 120060
        },
        headers: {
            "api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRhbWEgd2F0ZXIgc3VwcGx5IGFuZCBzZXdlcmFnZSBhdXRob3JpdHkiLCJzdWIiOiIyMTk4MjUiLCJwZXJtaXNzaW9ucyI6WyJCSUxMRVIiXSwiaXNzIjoiaHR0cHM6Ly9hcGkuZGVyYXNoLmdvdi5ldCIsImp0aSI6ImQ3ZjQyZGEwLWExNmEtMTFlOS1iZmMyLTc5ZDdmYTA1OGFjMSIsImlhdCI6MTU2MjU4MTU4N30.W2IoDlFgwIKSsyG3z5NSFryPyvKwrr41xf2UK2K3G-o",
            "api-secret": "td4zj8rk0ro84gxnbfkk85xa0s4dx60ugphf"
        }
    });
    console.log(result.data);
})

app.listen(port, () => {
    console.log("Server running on port " + port);
})