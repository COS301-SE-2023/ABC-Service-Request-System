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
var ticketUrl;
var userUrl;
var groupUrl;
var notificationUrl;
var clientUrl;
if (process.env.NODE_ENV === 'production') {
  ticketUrl = "https://luna-ticket-service-production.up.railway.app";
} else {
  ticketUrl = "http://localhost:3001";
}
if (process.env.NODE_ENV === 'production') {
  userUrl = "https://luna-user-service-production.up.railway.app";
} else {
  userUrl = "http://localhost:3002";
}
if (process.env.NODE_ENV === 'production') {
  groupUrl = "https://luna-group-service-production.up.railway.app";
} else {
  groupUrl = "http://localhost:3003";
}
if (process.env.NODE_ENV === 'production') {
  notificationUrl = "https://luna-notification-service-production.up.railway.app";
} else {
  notificationUrl = "http://localhost:3004";
}
if (process.env.NODE_ENV === 'production') {
  clientUrl = "https://luna-client-service-d5f98b3f6099.herokuapp.com";
} else {
  clientUrl = "http://localhost:3005";
}
app.use("/api/ticket", proxy(ticketUrl, {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/ticket".concat(req.url);
  }
}));
app.use("/api/user", proxy(userUrl, {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/user".concat(req.url);
  }
}));
app.use("/api/group", proxy(groupUrl, {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/group".concat(req.url);
  }
}));
app.use("/api/notifications", proxy(notificationUrl, {
  proxyReqPathResolver: function proxyReqPathResolver(req) {
    return "/api/notifications".concat(req.url);
  }
}));
app.use("/api/client", proxy(clientUrl, {
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