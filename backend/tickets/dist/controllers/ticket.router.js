"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _ticket = require("../models/ticket.model");
var _data = require("../utils/data");
var _multer = _interopRequireDefault(require("multer"));
var _cloudinary = require("../configs/cloudinary");
var _jwtVerify = require("../middleware/jwtVerify");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var router = (0, _express.Router)();
var storage = _multer["default"].diskStorage({});
var upload = (0, _multer["default"])({
  storage: storage
});
router.post('/upload', upload.single('file'), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          if (req.file) {
            _context.next = 4;
            break;
          }
          res.status(400).json({
            message: 'No file uploaded'
          });
          return _context.abrupt("return");
        case 4:
          _context.next = 6;
          return _cloudinary.cloudinary.uploader.upload(req.file.path);
        case 6:
          result = _context.sent;
          res.status(200).json({
            url: result.secure_url
          });
          _context.next = 13;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'File upload error'
          });
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 10]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/seed', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var ticketsCount;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _ticket.TicketModel.countDocuments();
        case 2:
          ticketsCount = _context2.sent;
          if (!(ticketsCount > 0)) {
            _context2.next = 6;
            break;
          }
          res.status(400).send("Seed is already done");
          return _context2.abrupt("return");
        case 6:
          _ticket.TicketModel.create(_data.sample_tickets).then(function (data) {
            res.status(201).send(data);
          })["catch"](function (err) {
            res.status(500).send({
              message: err.message
            });
          });
          // res.status(200).send("Seed is done!");
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));
router.get('/', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var tickets;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _ticket.TicketModel.find();
        case 2:
          tickets = _context3.sent;
          res.status(200).send(tickets);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));
router.get('/assigned', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var tickets;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _ticket.TicketModel.find({
            assigned: req.query.id
          });
        case 2:
          tickets = _context4.sent;
          if (tickets) {
            res.status(200).send(tickets);
          } else {
            res.status(404).send("No tickets found");
          }
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));
router.get('/projects', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var groupName, projects, tickets;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          groupName = req.query.groupName;
          projects = [];
          _context5.prev = 2;
          _context5.next = 5;
          return _ticket.TicketModel.find({
            group: groupName
          });
        case 5:
          tickets = _context5.sent;
          if (tickets) {
            tickets.forEach(function (ticket) {
              if (ticket.project && !projects.includes(ticket.project)) projects.push(ticket.project);
            });
            res.status(200).send(projects);
          }
          _context5.next = 12;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](2);
          res.status(500).send("Internal Server Error fetching projects");
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 9]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()));
router.get('/project', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var projectName, tickets;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          projectName = req.query.name;
          _context6.prev = 1;
          _context6.next = 4;
          return _ticket.TicketModel.find({
            project: projectName
          });
        case 4:
          tickets = _context6.sent;
          if (tickets) {
            console.log('tickets found', tickets);
            res.status(200).send(tickets);
          } else {
            console.log('no tickets found');
            res.status(404).send("No tickets for this project");
          }
          _context6.next = 11;
          break;
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](1);
          res.status(500).send("Internal Server Error fetching projects");
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 8]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()));
router.get('/group', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var groupName, tickets;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          groupName = req.query.name;
          _context7.prev = 1;
          _context7.next = 4;
          return _ticket.TicketModel.find({
            group: groupName
          });
        case 4:
          tickets = _context7.sent;
          if (tickets) {
            res.status(200).send(tickets);
          } else {
            res.status(404).send("No tickets found for that group");
          }
          _context7.next = 11;
          break;
        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](1);
          res.status(500).send("Internal error fetching tickets by group name");
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 8]]);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}()));
router.get('/delete', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _ticket.TicketModel.deleteMany({});
        case 2:
          res.status(200).send("Delete is done!");
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}()));

// Edwin's add ticket function

// Add ticket
router.post('/addticket', (0, _jwtVerify.jwtVerify)(['Admin', 'Manager']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var ticketCount, newTicket;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return _ticket.TicketModel.countDocuments();
        case 3:
          ticketCount = _context9.sent;
          newTicket = new _ticket.TicketModel({
            id: String(ticketCount + 1),
            // Assign the auto-incremented ID
            description: req.body.description,
            summary: req.body.summary,
            assignee: req.body.assignee,
            assigned: req.body.assigned,
            group: req.body.group,
            priority: req.body.priority,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status,
            createdTime: new Date(),
            project: req.body.project,
            todo: req.body.todo,
            todoChecked: req.body.todoChecked
          });
          console.log("new ticket: ", newTicket);
          _context9.next = 8;
          return newTicket.save();
        case 8:
          // console.log("New ticket created succesfully");
          res.status(201).send({
            message: "Ticket created succesfully",
            newTicketID: newTicket.id
          });
          _context9.next = 14;
          break;
        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          // console.error("Ticket creation error:", error);
          res.status(500).send("An error occurred during ticket creation.");
        case 14:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 11]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}()));
router.get('/id', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var ticket;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return _ticket.TicketModel.findOne({
            id: req.query.id
          });
        case 2:
          ticket = _context10.sent;
          if (ticket) {
            res.status(200).send(ticket);
          } else {
            res.status(404).send("Id not found");
          }
        case 4:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}()));
router.put('/comment', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var ticketId, comment, author, type, attachment, authorPhoto, newComment, ticket;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          ticketId = req.body.ticketId;
          comment = req.body.comment;
          author = req.body.author;
          type = req.body.type;
          attachment = req.body.attachment;
          authorPhoto = req.body.authorPhoto;
          newComment = {
            author: author,
            content: comment,
            createdAt: new Date(),
            type: type,
            attachment: attachment,
            authorPhoto: authorPhoto
          };
          _context11.prev = 7;
          _context11.next = 10;
          return _ticket.TicketModel.findOneAndUpdate({
            id: ticketId
          }, {
            $push: {
              comments: newComment
            }
          }, {
            "new": true
          });
        case 10:
          ticket = _context11.sent;
          if (ticket) {
            res.status(200).json({
              message: 'Comment added successfully'
            });
          } else {
            res.status(404).json({
              message: 'Ticket not found'
            });
          }
          _context11.next = 17;
          break;
        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](7);
          res.status(500).json({
            message: 'Internal server error'
          });
        case 17:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[7, 14]]);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}()));
router.put('/updateStatus', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var ticketId, status, ticket;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          ticketId = req.body.ticketId;
          status = req.body.status; // console.log('status is ' +  status);
          // console.log('ticket id is ' + ticketId);
          _context12.next = 5;
          return _ticket.TicketModel.findOneAndUpdate({
            id: ticketId
          }, {
            status: status
          }, {
            "new": true
          });
        case 5:
          ticket = _context12.sent;
          if (!ticket) {
            _context12.next = 14;
            break;
          }
          if (!(status === 'Done' && !ticket.timeToTicketResolution)) {
            _context12.next = 11;
            break;
          }
          // Set timeToTicketResolution if the status is changed to 'Done' and it hasn't been set before
          ticket.timeToTicketResolution = new Date();
          _context12.next = 11;
          return ticket.save();
        case 11:
          res.status(200).json({
            message: 'Ticket status updated successfully'
          });
          _context12.next = 15;
          break;
        case 14:
          res.status(404).json({
            message: 'Ticket not found'
          });
        case 15:
          _context12.next = 20;
          break;
        case 17:
          _context12.prev = 17;
          _context12.t0 = _context12["catch"](0);
          res.status(500).json({
            message: 'Internal server error'
          });
        case 20:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 17]]);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}()));
router.post('/addTimeToFirstResponse', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var ticketId, commentTime, ticket;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          ticketId = req.body.ticketId;
          commentTime = new Date(req.body.commentTime); // Ensure commentTime is Date type
          _context13.prev = 2;
          _context13.next = 5;
          return _ticket.TicketModel.findOne({
            id: ticketId
          });
        case 5:
          ticket = _context13.sent;
          if (!ticket) {
            _context13.next = 15;
            break;
          }
          if (ticket.timeToFirstResponse) {
            _context13.next = 14;
            break;
          }
          // save the commentTime as the first response time
          ticket.timeToFirstResponse = commentTime;
          _context13.next = 11;
          return ticket.save();
        case 11:
          res.status(200).send("Time to first response added");
          _context13.next = 15;
          break;
        case 14:
          res.status(200).send("First response time already recorded");
        case 15:
          _context13.next = 20;
          break;
        case 17:
          _context13.prev = 17;
          _context13.t0 = _context13["catch"](2);
          res.status(500).send("Internal server error");
        case 20:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[2, 17]]);
  }));
  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}()));

// Edwin's Router Functions for Todo list

router.put('/updateTodoChecked/:id', (0, _jwtVerify.jwtVerify)(['Manager', 'Technical', 'Functional', 'Admin']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var ticketId, updatedTodoChecked, ticket;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          ticketId = req.params.id;
          updatedTodoChecked = req.body.todoChecked;
          _context14.prev = 2;
          _context14.next = 5;
          return _ticket.TicketModel.findOne({
            id: ticketId
          });
        case 5:
          ticket = _context14.sent;
          if (!ticket) {
            _context14.next = 13;
            break;
          }
          ticket.todoChecked = updatedTodoChecked;
          _context14.next = 10;
          return ticket.save();
        case 10:
          res.status(200).send({
            message: "Ticket todo checked updated"
          });
          _context14.next = 14;
          break;
        case 13:
          res.status(404).send("Ticket not found");
        case 14:
          _context14.next = 20;
          break;
        case 16:
          _context14.prev = 16;
          _context14.t0 = _context14["catch"](2);
          console.log(ticketId, updatedTodoChecked, req, res);
          res.status(500).send("Internal server error");
        case 20:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[2, 16]]);
  }));
  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}()));
var _default = router;
exports["default"] = _default;