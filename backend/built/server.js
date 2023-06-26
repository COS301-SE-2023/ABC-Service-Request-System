"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.default = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//test
var ticket_router_1 = __importDefault(require("./routers/ticket.router"));
var user_router_1 = __importDefault(require("./routers/user.router"));
var login_router_1 = __importDefault(require("./routers/login.router"));
var signup_router_1 = __importDefault(require("./routers/signup.router"));
var ticketDB_config_1 = require("./configs/ticketDB.config");
(0, ticketDB_config_1.dbConnection)();
var app = (0, express_1.default)();
exports.default = app;
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:4200"]
}));
app.use(express_1.default.json());
app.use('/api/ticket', ticket_router_1.default);
app.use('/api/user', user_router_1.default);
app.use('/api/login', login_router_1.default);
app.use('/api/signup', signup_router_1.default);
app.get('/api/welcome', function (req, res) {
    res.status(200).send({ message: 'Welcome to the server!' });
});
var port = 3000;
var server = app.listen(port, function () {
    console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;
