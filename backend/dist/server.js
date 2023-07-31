"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _testTicket = _interopRequireDefault(require("./test_routers/testTicket.router"));
var _testUser = _interopRequireDefault(require("./test_routers/testUser.router"));
var _testNotifications = _interopRequireDefault(require("./test_routers/testNotifications.router"));
var _testGroup = _interopRequireDefault(require("./test_routers/testGroup.router"));
var _testClient = _interopRequireDefault(require("./test_routers/testClient.router"));
var _testTicketDB = require("./configs/testTicketDB.config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// import { createProxyMiddleware } from 'http-proxy-middleware';
var proxy = require("express-http-proxy");
_dotenv["default"].config();
//test

//test routers
(0, _testTicketDB.dbConnection)();
var app = (0, _express["default"])();
exports["default"] = app;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/api/ticket", proxy("http://localhost:3001", {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/ticket".concat(req.url);
  }
}));
app.use("/api/user", proxy("http://localhost:3002", {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/user".concat(req.url);
  }
}));
app.use("/api/group", proxy("http://localhost:3003", {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/group".concat(req.url);
  }
}));
app.use("/api/notifications", proxy("http://localhost:3004", {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/notifications".concat(req.url);
  }
}));
app.use("/api/client", proxy("http://localhost:3005", {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/client".concat(req.url); // Prefix the request path with /api/user
  }
}));

//test routers
app.use('/api/test_ticket', _testTicket["default"]);
app.use('/api/test_user', _testUser["default"]);
app.use('/api/test_notifications', _testNotifications["default"]);
app.use('/api/test_group', _testGroup["default"]);
app.use('/api/test_client', _testClient["default"]);
app.get('/api/welcome', function (req, res) {
  res.status(200).send({
    message: 'Welcome to the server!'
  });
});
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;