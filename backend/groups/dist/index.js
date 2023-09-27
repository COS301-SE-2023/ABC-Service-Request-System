"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _group = _interopRequireDefault(require("./controllers/group.router"));
var _groupDB = require("./configs/groupDB.config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
(0, _groupDB.dbConnection)();
var app = (0, _express["default"])();
exports["default"] = app;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use('/api/group', _group["default"]);
app.get('/api/welcome', function (req, res) {
  res.status(200).send({
    message: 'Welcome to the group service!'
  });
});
var port = process.env.PORT || 3003;
var server = app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;