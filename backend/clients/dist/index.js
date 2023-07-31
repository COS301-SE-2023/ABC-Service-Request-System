"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _client = _interopRequireDefault(require("./controllers/client.router"));
var _client2 = require("./configs/client.config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
(0, _client2.dbConnection)();
var app = (0, _express["default"])();
exports["default"] = app;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use('/api/client', _client["default"]);
app.get('/api/welcome', function (req, res) {
  res.status(200).send({
    message: 'Welcome to the client service!'
  });
});

// Error handling middleware
// app.use((err: any, req: any, res: any, next: any) => {
//     // Handle request abort error
//     if (req.aborted) {
//       console.error('Request aborted:', req.url);
//       return res.status(400).send('Bad Request: Request aborted');
//     }

//     // Handle other errors
//     console.error('Something went wrong:', err);
//     res.status(500).send('Internal Server Error');
//   });

var port = process.env.PORT || 3005;
var server = app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});
exports.server = server;