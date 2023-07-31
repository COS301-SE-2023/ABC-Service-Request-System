"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _notifications = _interopRequireDefault(require("./controllers/notifications.router"));
var _notificationsDB = require("./configs/notificationsDB.config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
(0, _notificationsDB.dbConnection)();
var app = (0, _express["default"])();
exports["default"] = app;
app.use((0, _cors["default"])({
  credentials: true,
  origin: ["http://localhost:4200"]
}));
app.use(_express["default"].json());
app.use('/api/notifications', _notifications["default"]);
app.get('/api/welcome', function (req, res) {
  res.status(200).send({
    message: 'Welcome to the notifications service!'
  });
});
var port = 3004;
var server = app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;