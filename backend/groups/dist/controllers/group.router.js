"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _sampleGroups = require("../utils/sampleGroups");
var _multer = _interopRequireDefault(require("multer"));
var _cloudinary = require("../configs/cloudinary");
var _group = require("../models/group.model");
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
          console.log(req.file);
          _context.prev = 1;
          if (req.file) {
            _context.next = 5;
            break;
          }
          res.status(400).json({
            message: 'No file uploaded'
          });
          return _context.abrupt("return");
        case 5:
          console.log('in upload router222');
          _context.next = 8;
          return _cloudinary.cloudinary.uploader.upload(req.file.path);
        case 8:
          result = _context.sent;
          res.status(200).json({
            url: result.secure_url
          });
          _context.next = 15;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: 'File upload error'
          });
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 12]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/', (0, _jwtVerify.jwtVerify)(['Admin', 'Manager']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var groups;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _group.groupModel.find();
        case 2:
          groups = _context2.sent;
          res.send(groups);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));
router.get('/seed', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var groupsCount;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _group.groupModel.countDocuments();
        case 2:
          groupsCount = _context3.sent;
          if (!(groupsCount > 0)) {
            _context3.next = 6;
            break;
          }
          res.status(400).send("Seed is already done");
          return _context3.abrupt("return");
        case 6:
          _group.groupModel.create(_sampleGroups.sample_groups).then(function (data) {
            res.status(201).send(data);
          })["catch"](function (err) {
            res.status(500).send({
              message: err.message
            });
          });
          // res.status(200).send("Seed is done!");
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));
router.post('/add', (0, _jwtVerify.jwtVerify)(['Admin', 'Manager']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var maxGroup, maxId, group, createdGroup;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          console.log('in add  router');
          _context4.next = 3;
          return _group.groupModel.find().sort({
            id: -1
          }).limit(1);
        case 3:
          maxGroup = _context4.sent;
          maxId = 0;
          if (maxGroup.length > 0) {
            maxId = Number(maxGroup[0].id);
          }
          console.log(req.body.people);
          group = new _group.groupModel({
            id: String(maxId + 1),
            backgroundPhoto: req.body.backgroundPhoto,
            groupName: req.body.groupName,
            people: req.body.people
          });
          console.log(group);
          _context4.prev = 9;
          _context4.next = 12;
          return _group.groupModel.create(group);
        case 12:
          createdGroup = _context4.sent;
          res.status(201).send(createdGroup);
          _context4.next = 20;
          break;
        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](9);
          console.log(_context4.t0);
          res.status(500).send("An error occurred during group creation");
        case 20:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[9, 16]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));

// router.get("/:groupId/users", expressAsyncHandler(async (req, res) => {
//   const groupId = req.params.groupId;
//   const group = await groupModel.findOne({ id: groupId });
//   console.log(group?.people)
//   if (!group) {
//     res.status(404).send({ message: "Group not found" });
//     return;
//   }

//   const userIds = group.people; 
//   const users = await UserModel.find({ _id: { $in: userIds } });
//   const userArray = users.map(user => ({ name: user.name, surname: user.surname, emailAddress: user.emailAddress, roles:user.roles[0] })); 
//   console.log(userArray);
//   res.send(userArray);
//   // res.send(group.people);
// }));

// router.get("/:groupId/user/:userId", expressAsyncHandler(async (req, res) => {
//   const groupId = req.params.groupId;
//   const userId = req.params.userId;

//   const group = await groupModel.findOne({ id: groupId });

//   console.log(group?.people)
//   if (!group) {
//     res.status(404).send({ message: "Group not found" });
//     return;
//   }

//   const users = await UserModel.find({ _id: { $in: userId } });
//   const userArray = users.map(user => ({ name: user.name, surname: user.surname, emailAddress: user.emailAddress, roles:user.roles })); 
//   console.log(userArray);
//   res.send(userArray);
//   // res.send(group.people);
// }));

router["delete"]("/:groupId/user/:userId", (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var groupId, userId, group, userIndex;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          groupId = req.params.groupId;
          userId = req.params.userId;
          console.log('user id ' + userId);
          _context5.next = 5;
          return _group.groupModel.findOne({
            id: groupId
          });
        case 5:
          group = _context5.sent;
          console.log(group);
          if (group) {
            _context5.next = 10;
            break;
          }
          res.status(404).send({
            message: "Group not found"
          });
          return _context5.abrupt("return");
        case 10:
          userIndex = group.people.indexOf(userId);
          console.log('user index ' + userIndex);
          if (!(userIndex !== -1)) {
            _context5.next = 19;
            break;
          }
          group.people.splice(userIndex, 1);
          _context5.next = 16;
          return group.save();
        case 16:
          res.status(200).send({
            message: 'User removed successfully'
          });
          _context5.next = 20;
          break;
        case 19:
          res.status(404).send({
            message: 'User not found in the group'
          });
        case 20:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()));
router.get("/:groupId/name", (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var groupId, group, groupName;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          groupId = req.params.groupId;
          _context6.next = 3;
          return _group.groupModel.findOne({
            id: groupId
          });
        case 3:
          group = _context6.sent;
          if (group) {
            _context6.next = 7;
            break;
          }
          res.status(404).send({
            message: "Group not found"
          });
          return _context6.abrupt("return");
        case 7:
          groupName = group.groupName;
          if (groupName) {
            console.log(groupName);
            res.status(200).json({
              groupName: groupName
            });
          } else {
            res.status(404).send({
              message: 'Group name not found'
            });
          }
        case 9:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()));
router["delete"]("/:groupId/delete", (0, _jwtVerify.jwtVerify)(['Admin', 'Manager']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var groupId, group;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          groupId = req.params.groupId;
          _context7.next = 3;
          return _group.groupModel.findOne({
            id: groupId
          });
        case 3:
          group = _context7.sent;
          if (group) {
            _context7.next = 7;
            break;
          }
          res.status(404).send({
            message: "Group not found"
          });
          return _context7.abrupt("return");
        case 7:
          _context7.next = 9;
          return _group.groupModel.deleteOne({
            id: groupId
          });
        case 9:
          console.log('group deleted');
          res.status(200).send({
            message: "Group deleted successfully"
          });
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}()));
router.put('/add-people', (0, _jwtVerify.jwtVerify)(['Admin', 'Manager']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var _req$body, group, people, newGroup;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body = req.body, group = _req$body.group, people = _req$body.people;
          console.log('hello from backend');
          console.log(group);
          console.log(people);
          _context8.next = 7;
          return _group.groupModel.findOneAndUpdate({
            _id: group
          }, {
            $addToSet: {
              people: people
            }
          }, {
            "new": true
          });
        case 7:
          newGroup = _context8.sent;
          console.log(newGroup);
          if (newGroup) {
            res.status(200).json({
              message: 'users added to group'
            });
          } else {
            res.status(404).json({
              message: 'Group not found'
            });
          }
          _context8.next = 15;
          break;
        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          res.status(500).send({
            error: 'Internal server error'
          });
        case 15:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 12]]);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}()));
router.get('/objectId/:groupId', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var groupId, group;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          groupId = req.params.groupId;
          console.log(' in router, objectId: ' + groupId);
          _context9.prev = 2;
          _context9.next = 5;
          return _group.groupModel.findOne({
            _id: groupId
          });
        case 5:
          group = _context9.sent;
          if (group) {
            res.status(200).send(group);
          } else {
            res.status(404).send('Group not found');
          }
          _context9.next = 13;
          break;
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](2);
          console.log(_context9.t0);
          res.status(500).send("An error occurred while fetching the group");
        case 13:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[2, 9]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}()));
router.get('/:groupId', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var groupId, group;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          groupId = req.params.groupId;
          _context10.next = 4;
          return _group.groupModel.findOne({
            id: groupId
          });
        case 4:
          group = _context10.sent;
          if (group) {
            _context10.next = 10;
            break;
          }
          res.status(404).send({
            message: "Group not found"
          });
          return _context10.abrupt("return");
        case 10:
          // console.log('hiii');
          res.status(200).send(group);
        case 11:
          _context10.next = 16;
          break;
        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          res.status(500).send({
            error: 'Internal server error'
          });
        case 16:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 13]]);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}()));

// Edwin's Function
router.get('/groupId/:id', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var groupId, group;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          groupId = req.params.id;
          _context11.next = 3;
          return _group.groupModel.findById(groupId);
        case 3:
          group = _context11.sent;
          if (group) {
            res.send(group);
          } else {
            res.status(404).send("Group not found");
          }
        case 5:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}()));
router.put('/update_tickets', (0, _jwtVerify.jwtVerify)(['Admin', 'Manager', 'Technical', 'Functional']), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var ticketId, group;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          ticketId = req.body.ticketId;
          _context12.next = 4;
          return _group.groupModel.findOneAndUpdate({
            id: req.body.groupId
          }, {
            $push: {
              tickets: ticketId
            }
          });
        case 4:
          group = _context12.sent;
          if (group) {
            res.status(200).send({
              message: "Ticket added to group",
              group: group
            });
          } else {
            // console.log('hiii');
            res.status(404).send("invalid group id");
          }
          _context12.next = 11;
          break;
        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          res.status(500).send({
            error: 'Internal server error'
          });
        case 11:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 8]]);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}()));
router.get('/exists/:groupName', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var groupExists;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return _group.groupModel.exists({
            groupName: req.params.groupName
          });
        case 2:
          groupExists = _context13.sent;
          res.send(groupExists);
        case 4:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}()));
router.get('/getGroupByName/:groupName', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var groupName, group;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          groupName = req.params.groupName; // const groupExists = await groupModel.exists({ groupName: req.params.groupName });
          _context14.next = 4;
          return _group.groupModel.findOne({
            groupName: groupName
          });
        case 4:
          group = _context14.sent;
          if (group) {
            _context14.next = 10;
            break;
          }
          res.status(404).send({
            message: "Group not found"
          });
          return _context14.abrupt("return");
        case 10:
          res.status(200).send(group);
        case 11:
          _context14.next = 16;
          break;
        case 13:
          _context14.prev = 13;
          _context14.t0 = _context14["catch"](0);
          res.status(500).send({
            error: 'Internal server error'
          });
        case 16:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 13]]);
  }));
  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}()));
var _default = router;
exports["default"] = _default;