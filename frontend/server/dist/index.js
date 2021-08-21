"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
const port = 8080;
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.accepts('application/json');
    res.contentType('application/json');
    next();
});
app.get("/consents", (req, res) => {
    const data = fs_1.default.readFileSync(__dirname + '/../../data/consents.json', 'utf8');
    res.send(JSON.parse(data));
});
app.post("/consents", (req, res) => {
    const data = fs_1.default.readFileSync(__dirname + '/../../data/consents.json', 'utf8');
    const consents = JSON.parse(data);
    if (!('name' in req.body) ||
        !('email' in req.body) ||
        !('consents' in req.body)) {
        throw new Error("invalid data");
    }
    consents.push(req.body);
    const newData = JSON.stringify(consents, null, 2);
    fs_1.default.writeFileSync(__dirname + '/../../data/consents.json', newData);
    res.send(consents);
});
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map