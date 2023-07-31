"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _user = _interopRequireDefault(require("./controllers/user.router"));
var _userDB = require("./configs/userDB.config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
(0, _userDB.dbConnection)();
var app = (0, _express["default"])();
exports["default"] = app;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use('/api/user', _user["default"]);
app.get('/api/welcome', function (req, res) {
  res.status(200).send({
    message: 'Welcome to the user service!'
  });
});
var port = process.env.PORT || 3002;
var server = app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;