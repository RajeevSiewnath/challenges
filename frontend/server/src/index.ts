import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    req.accepts('application/json');
    res.contentType('application/json');
    next();
})

app.get("/consents", (req, res) => {
    const data = fs.readFileSync(__dirname + '/../../data/consents.json', 'utf8');
    res.send(JSON.parse(data));
});

app.post("/consents", (req, res) => {
    const data = fs.readFileSync(__dirname + '/../../data/consents.json', 'utf8');
    const consents = JSON.parse(data);
    if (
        !('name' in req.body) ||
        !('email' in req.body) ||
        !('consents' in req.body)
    ) {
        throw new Error("invalid data");
    }
    consents.push(req.body);
    const newData = JSON.stringify(consents, null, 2);
    fs.writeFileSync(__dirname + '/../../data/consents.json', newData);
    res.send(consents);
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});