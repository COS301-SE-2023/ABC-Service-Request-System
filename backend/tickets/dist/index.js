"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _ticket = _interopRequireDefault(require("./controllers/ticket.router"));
var _ticketDB = require("./configs/ticketDB.config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
(0, _ticketDB.dbConnection)();
var app = (0, _express["default"])();
exports["default"] = app;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use('/api/ticket', _ticket["default"]);
app.get('/api/welcome', function (req, res) {
  res.status(200).send({
    message: 'Welcome to the ticket service!'
  });
});
var port = process.env.PORT || 3001;
var server = app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;