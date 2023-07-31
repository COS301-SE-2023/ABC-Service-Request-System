"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _testUser = require("./testUser.model");
var _crypto = _interopRequireDefault(require("crypto"));
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _multer = _interopRequireDefault(require("multer"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
_dotenv["default"].config();
var router = (0, _express.Router)();
router.get('/', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var users;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _testUser.TestUserModel.find();
        case 2:
          users = _context.sent;
          res.send(users);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()));
router.post("/login", (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var user, validPassword, secretKey, setRoles, token;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _testUser.TestUserModel.findOne({
            emailAddress: req.body.emailAddress
          }).select("+password");
        case 2:
          user = _context2.sent;
          if (!user) {
            _context2.next = 19;
            break;
          }
          _context2.next = 6;
          return _bcryptjs["default"].compare(req.body.password, user.password);
        case 6:
          validPassword = _context2.sent;
          if (validPassword) {
            _context2.next = 10;
            break;
          }
          res.status(401).send({
            auth: false,
            token: null
          });
          return _context2.abrupt("return");
        case 10:
          secretKey = process.env.JWT_SECRET;
          if (secretKey) {
            _context2.next = 13;
            break;
          }
          throw new Error('JWT Secret is not defined');
        case 13:
          //loop through roles and add them to the token
          setRoles = [];
          setRoles = user.roles;
          token = _jsonwebtoken["default"].sign({
            _id: user._id,
            role: setRoles,
            user: user,
            name: user.name,
            objectName: "UserInfo"
          }, secretKey, {
            expiresIn: 86400 // expires in 24 hours
          }); // console.log("Login successful");

          res.status(200).send({
            auth: true,
            token: token
          });
          _context2.next = 20;
          break;
        case 19:
          // console.log("User not found");
          res.status(404).send({
            message: "No user found."
          });
        case 20:
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
    var usersCount, salt, hashedPassword, adminUser, newUser, secretKey, token;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _testUser.TestUserModel.countDocuments();
        case 3:
          usersCount = _context3.sent;
          if (!(usersCount > 0)) {
            _context3.next = 7;
            break;
          }
          res.status(401).send({
            message: "Seed is already done"
          });
          return _context3.abrupt("return");
        case 7:
          _context3.next = 9;
          return _bcryptjs["default"].genSalt(10);
        case 9:
          salt = _context3.sent;
          _context3.next = 12;
          return _bcryptjs["default"].hash("admin123", salt);
        case 12:
          hashedPassword = _context3.sent;
          adminUser = {
            id: "1",
            name: "Admin",
            surname: "admin",
            profilePhoto: "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
            emailAddress: "admin@admin.com",
            emailVerified: true,
            password: hashedPassword,
            roles: ["Admin"],
            groups: [],
            bio: "I am the admin",
            headerPhoto: "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
            linkedin: "https://www.linkedin.com",
            github: "https://www.Github.com"
          };
          _context3.next = 16;
          return _testUser.TestUserModel.create(adminUser);
        case 16:
          newUser = _context3.sent;
          secretKey = process.env.JWT_SECRET;
          token = _jsonwebtoken["default"].sign({
            _id: newUser._id,
            role: 'Admin'
          }, secretKey, {
            expiresIn: '1d'
          }); // console.log("Token:", token);
          // Send the token back to the client
          res.status(200).json({
            message: "Seed is done!",
            token: token
          });
          _context3.next = 26;
          break;
        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Error seeding database'
          });
        case 26:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 22]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));
router.get('/delete', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _testUser.TestUserModel.deleteMany({});
        case 2:
          res.status(200).send({
            message: "Delete is done!"
          });
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));

//JAIMENS ROUTES//

//RESET PASSWORD TO ACTIVATE ACCOUNT//
// router.get('/activate_account', expressAsyncHandler(
//     async (req, res) => {
//       try{
//           const token = req.query.token;
//           res.status(200).send({ message: 'User created successfully', inviteToken: token });
//       }catch(error){
//         console.log(error);
//       }

//     })
// );

//CREATING A USER//
router.post("/create_user", (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var existingUser, roles, inviteToken, userCount, newUser, transporter, mailOptions;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _testUser.TestUserModel.findOne({
            emailAddress: req.body.email
          });
        case 3:
          existingUser = _context5.sent;
          if (!existingUser) {
            _context5.next = 7;
            break;
          }
          // console.log("User with this email already exists");
          res.status(409).send({
            message: "User with this email already exists."
          });
          return _context5.abrupt("return");
        case 7:
          roles = [];
          if (req.body.manager) {
            roles.push("Manager");
          }
          if (req.body.technical) {
            roles.push("Technical");
          }
          if (req.body.Functional) {
            roles.push("Functional");
          }

          // generate invite token
          inviteToken = _crypto["default"].randomBytes(32).toString("hex");
          _context5.next = 14;
          return _testUser.TestUserModel.countDocuments();
        case 14:
          userCount = _context5.sent;
          // create new user with pending status
          newUser = new _testUser.TestUserModel({
            id: String(userCount + 1),
            // Assign the auto-incremented ID
            name: req.body.name,
            surname: req.body.surname,
            profilePhoto: req.body.profilePhoto || "https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png",
            headerPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1689762139/htddlodqzbzytxmedebh.jpg',
            emailAddress: req.body.email,
            inviteToken: inviteToken,
            status: "pending",
            roles: roles,
            groups: req.body.selectedGroups,
            password: "Admin",
            bio: '',
            github: '',
            linkedin: ''
          }); // console.log("before save");
          _context5.next = 18;
          return newUser.save();
        case 18:
          // console.log("after save");
          // Send the invitation email here, inside the same function where newUser and inviteToken are available
          transporter = _nodemailer["default"].createTransport({
            service: "gmail",
            auth: {
              user: "hyperiontech.capstone@gmail.com",
              pass: "zycjmbveivhamcgt"
            }
          });
          mailOptions = {
            from: process.env.EMAIL,
            to: newUser.emailAddress,
            subject: "Invitation to join Luna",
            html: "\n                    <html>\n                    <head>\n                        <style>\n                            body {\n                                font-family: Arial, sans-serif;\n                                margin: 0;\n                                padding: 0;\n                            }\n                            .email-container {\n                                max-width: 600px;\n                                margin: auto;\n                                background-color: rgba(33, 33, 33, 1);\n                                padding: 20px;\n                            }\n                            .header {\n                                background-color: #04538E;\n                                color: #fff;\n                                padding: 20px;\n                                text-align: center;\n                            }\n                            .header h1 {\n                                margin: 0;\n                            }\n                            .logo {\n                                display: block;\n                                margin: 0 auto 20px;\n                                width: 100px;\n                                height: auto;\n                            }\n                            .greeting {\n                                font-size: 24px;\n                                color: #fff;\n                                text-align: center;\n                            }\n                            .message {\n                                font-size: 18px;\n                                color: rgba(122 , 122 , 122 , 1);\n                                text-align: center;\n                                margin: 20px 0;\n                            }\n                            .activation-link {\n                                display: block;\n                                width: 200px;\n                                margin: 20px auto;\n                                padding: 10px;\n                                background-color: rgba(18, 18, 18, 1);\n                                color: #fff;\n                                text-align: center;\n                                text-decoration: none;\n                                border-radius: 4px;\n                            }\n                            a {\n                                color: #fff;\n                            }\n                        </style>\n                    </head>\n                    <body>\n                        <div class=\"email-container\">\n                            <div class=\"header\">\n                                <img src=\"cid:logo\" alt=\"Luna Logo\" class=\"logo\">\n                                <h1>Welcome to Luna</h1>\n                            </div>\n                            <p class=\"greeting\">Hello ".concat(newUser.name, ",</p>\n                            <p class=\"message\">To complete your signup process, please click the button below.</p>\n                            <a href=\"http://localhost:3000/api/user/activate_account?token=").concat(inviteToken, "\" class=\"activation-link\">Activate Account</a>\n                        </div>\n                    </body>\n                    </html>\n                "),
            attachments: [{
              filename: 'luna-logo.png',
              path: 'assets/luna-logo.png',
              cid: 'logo'
            }]
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              // console.log(error);
            } else {
              // console.log("Email sent: " + info.response);
            }
          });

          // console.log("User created successfully");
          res.status(201).send({
            message: 'User created successfully',
            inviteToken: inviteToken,
            user: newUser
          });
          _context5.next = 27;
          break;
        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](0);
          // console.error("User creation error:", error);
          res.status(500).send("An error occurred during user creation.");
        case 27:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 24]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()));

///create a router.get to display the component that is suppose to get the new password from the user
router.get('/activate_account', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var inviteToken, user;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          // console.log('Account activation request received:', req.query.token);
          inviteToken = req.query.token;
          _context6.next = 3;
          return _testUser.TestUserModel.findOne({
            inviteToken: inviteToken
          });
        case 3:
          user = _context6.sent;
          if (user) {
            _context6.next = 9;
            break;
          }
          // console.log('Invalid token');
          res.status(409).send({
            message: 'Invalid token.'
          });
          return _context6.abrupt("return");
        case 9:
          res.status(200).send({
            message: 'valid token'
          });
          // res.status(200).send({ message: 'Token Authenticated', inviteToken: inviteToken });
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()));

//ACTIVATE THE ACCOUNT WITH THE NEW PASSWORD//
router.post('/activate_account', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _req$body, inviteToken, password, user, salt, hashedPassword, secretKey, token;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _req$body = req.body, inviteToken = _req$body.inviteToken, password = _req$body.password; // console.log('before find one');
          _context7.next = 3;
          return _testUser.TestUserModel.findOne({
            inviteToken: inviteToken
          });
        case 3:
          user = _context7.sent;
          if (user) {
            _context7.next = 7;
            break;
          }
          //   console.log('Invalid token');
          res.status(409).send({
            message: 'Invalid token.'
          });
          return _context7.abrupt("return");
        case 7:
          _context7.next = 9;
          return _bcryptjs["default"].genSalt(10);
        case 9:
          salt = _context7.sent;
          _context7.next = 12;
          return _bcryptjs["default"].hash(password, salt);
        case 12:
          hashedPassword = _context7.sent;
          user.password = hashedPassword;
          user.emailVerified = true; // Assuming the activation also verifies the email
          user.inviteToken = undefined;

          // console.log('before save');
          _context7.next = 18;
          return user.save();
        case 18:
          secretKey = "Jetpad2023";
          token = _jsonwebtoken["default"].sign({
            _id: user._id,
            role: user.roles
          }, secretKey, {
            expiresIn: '1d'
          }); // console.log('Account activated successfully');
          res.status(201).send({
            message: 'Account activated successfully'
          });
        case 21:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}()));

//DASH"S ROUTES//
//UPDATE USER NAME - WORKING

router.post('/get_user_by_token', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var token, user;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          token = req.body.token;
          _context8.next = 3;
          return _testUser.TestUserModel.findOne({
            inviteToken: token
          });
        case 3:
          user = _context8.sent;
          if (!user) {
            res.status(404).send({
              error: 'User not found'
            });
          } else {
            res.status(200).send({
              email: user.emailAddress
            });
          }
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
router.put('/update_user_name', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var _req$body2, name, email, user;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email; // console.log("email: " + email);
          // console.log("name: " + name);
          _context9.next = 3;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              name: name
            }
          }, {
            "new": true
          });
        case 3:
          user = _context9.sent;
          // console.log("user: ", user);

          if (user) {
            res.status(200).json({
              message: 'User name updated successfuly'
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }
        case 5:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}()));
//UPDATE USER PASSWORD - WORKING
router.put('/update_user_password', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var _req$body3, password, email, user;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _req$body3 = req.body, password = _req$body3.password, email = _req$body3.email; // console.log("email: " + email);
          _context10.next = 3;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              password: password
            }
          }, {
            "new": true
          });
        case 3:
          user = _context10.sent;
          if (user) {
            res.status(200).json({
              message: 'User password updated successfuly'
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }
        case 5:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}()));
//UPDATE USER Location - WORKING
router.put('/update_user_location', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res, next) {
    var _req$body4, location, email, user;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _req$body4 = req.body, location = _req$body4.location, email = _req$body4.email; // console.log("email: " + email);
          _context11.next = 3;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              location: location
            }
          }, {
            "new": true
          });
        case 3:
          user = _context11.sent;
          if (user) {
            res.status(200).json({
              message: 'User location updated successfully'
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }
        case 5:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function (_x21, _x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}()));

//UPDATE USER GITHUB - 
router.put('/update_user_github', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res, next) {
    var _req$body5, github, email, user;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _req$body5 = req.body, github = _req$body5.github, email = _req$body5.email; // console.log("email: " + email);
          _context12.next = 3;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              github: github
            }
          }, {
            "new": true
          });
        case 3:
          user = _context12.sent;
          if (user) {
            res.status(200).json({
              message: 'User Github updated successfully'
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }
        case 5:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function (_x24, _x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}()));

//UPDATE USER GITHUB - 
router.put('/update_user_linkedin', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res, next) {
    var _req$body6, linkedin, email, user;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _req$body6 = req.body, linkedin = _req$body6.linkedin, email = _req$body6.email; // console.log("email: " + email);
          _context13.next = 3;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              linkedin: linkedin
            }
          }, {
            "new": true
          });
        case 3:
          user = _context13.sent;
          if (user) {
            res.status(200).json({
              message: 'User Linkedin updated successfully'
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }
        case 5:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function (_x27, _x28, _x29) {
    return _ref13.apply(this, arguments);
  };
}()));

//GET USER
router.get('/id', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var user;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return _testUser.TestUserModel.findOne({
            id: req.query.id
          });
        case 2:
          user = _context14.sent;
          if (user) {
            res.status(200).send(user);
          } else {
            res.status(404).send({
              message: "Id not found"
            });
          }
        case 4:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return function (_x30, _x31) {
    return _ref14.apply(this, arguments);
  };
}()));
router.get('/email', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var user;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return _testUser.TestUserModel.findOne({
            emailAddress: req.query.email
          });
        case 2:
          user = _context15.sent;
          if (user) {
            res.status(200).send(user);
          } else {
            res.status(404).send({
              message: "Id not found"
            });
          }
        case 4:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return function (_x32, _x33) {
    return _ref15.apply(this, arguments);
  };
}()));
router.post('/:id/add-group', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(req, res) {
    var groupId, user, updatedUser;
    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          groupId = req.body.groupId;
          _context16.next = 3;
          return _testUser.TestUserModel.findById(req.params.id);
        case 3:
          user = _context16.sent;
          if (!user) {
            _context16.next = 12;
            break;
          }
          user.groups.push(groupId);
          _context16.next = 8;
          return user.save();
        case 8:
          updatedUser = _context16.sent;
          res.status(200).send(updatedUser);
          _context16.next = 13;
          break;
        case 12:
          res.status(404).send({
            message: 'User Not Found'
          });
        case 13:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return function (_x34, _x35) {
    return _ref16.apply(this, arguments);
  };
}()));
/* THESE ARE DIFFERENT FUNCTIONS, DO NOT DELETE EITHER */
router.post('/add-group-to-users', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(req, res) {
    var groupId, userIds, users;
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          groupId = req.body.groupId;
          userIds = req.body.userIds;
          _context17.prev = 2;
          _context17.next = 5;
          return _testUser.TestUserModel.updateMany({
            _id: {
              $in: userIds
            }
          }, {
            $addToSet: {
              groups: groupId
            }
          });
        case 5:
          users = _context17.sent;
          res.status(201).send(users);
          _context17.next = 13;
          break;
        case 9:
          _context17.prev = 9;
          _context17.t0 = _context17["catch"](2);
          console.log(_context17.t0);
          res.status(500).send("An error occurred while adding the group to the users");
        case 13:
        case "end":
          return _context17.stop();
      }
    }, _callee17, null, [[2, 9]]);
  }));
  return function (_x36, _x37) {
    return _ref17.apply(this, arguments);
  };
}()));
router.get('/:id', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(req, res) {
    var user;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return _testUser.TestUserModel.findById(req.params.id);
        case 2:
          user = _context18.sent;
          if (user) {
            res.send(user);
          } else {
            res.status(404).send("User not found");
          }
        case 4:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  }));
  return function (_x38, _x39) {
    return _ref18.apply(this, arguments);
  };
}()));
router["delete"]('/:userId/group/:groupId', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(req, res) {
    var user, groupIndex, updatedUser;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return _testUser.TestUserModel.findById(req.params.userId);
        case 2:
          user = _context19.sent;
          if (!user) {
            _context19.next = 16;
            break;
          }
          groupIndex = user.groups.indexOf(req.params.groupId);
          if (!(groupIndex !== -1)) {
            _context19.next = 13;
            break;
          }
          user.groups.splice(groupIndex, 1);
          _context19.next = 9;
          return user.save();
        case 9:
          updatedUser = _context19.sent;
          res.status(200).send({
            message: "Group removed from user's groups",
            user: updatedUser
          });
          _context19.next = 14;
          break;
        case 13:
          res.status(404).send({
            message: "Group not found in user's groups"
          });
        case 14:
          _context19.next = 17;
          break;
        case 16:
          res.status(404).send({
            message: "User not found"
          });
        case 17:
        case "end":
          return _context19.stop();
      }
    }, _callee19);
  }));
  return function (_x40, _x41) {
    return _ref19.apply(this, arguments);
  };
}()));
var storage = _multer["default"].diskStorage({});
var upload = (0, _multer["default"])({
  storage: storage
});
router.put('/updateProfilePicture', /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(req, res) {
    var _req$body7, userId, url, result;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _req$body7 = req.body, userId = _req$body7.userId, url = _req$body7.url;
          _context20.next = 4;
          return _testUser.TestUserModel.updateOne({
            id: userId
          }, {
            profilePhoto: url
          });
        case 4:
          result = _context20.sent;
          if (result.modifiedCount <= 0) {
            res.status(400).json({
              message: 'No user found with the provided ID or no update was needed.'
            });
          } else {
            res.status(200).json({
              message: 'Profile picture updated successfully.'
            });
          }
          _context20.next = 11;
          break;
        case 8:
          _context20.prev = 8;
          _context20.t0 = _context20["catch"](0);
          res.status(500).json({
            message: 'Error updating profile picture',
            error: _context20.t0.message
          });
        case 11:
        case "end":
          return _context20.stop();
      }
    }, _callee20, null, [[0, 8]]);
  }));
  return function (_x42, _x43) {
    return _ref20.apply(this, arguments);
  };
}());
router.put('/updateProfileHeader', /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(req, res) {
    var _req$body8, userId, url, result;
    return _regeneratorRuntime().wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          _req$body8 = req.body, userId = _req$body8.userId, url = _req$body8.url;
          _context21.next = 4;
          return _testUser.TestUserModel.updateOne({
            id: userId
          }, {
            headerPhoto: url
          });
        case 4:
          result = _context21.sent;
          if (result.modifiedCount <= 0) {
            res.status(400).json({
              message: 'No user found with the provided ID or no update was needed.'
            });
          } else {
            res.status(200).json({
              message: 'Profile header updated successfully.'
            });
          }
          _context21.next = 11;
          break;
        case 8:
          _context21.prev = 8;
          _context21.t0 = _context21["catch"](0);
          res.status(500).json({
            message: 'Error updating profile header',
            error: _context21.t0.message
          });
        case 11:
        case "end":
          return _context21.stop();
      }
    }, _callee21, null, [[0, 8]]);
  }));
  return function (_x44, _x45) {
    return _ref21.apply(this, arguments);
  };
}());
router.put('/updateBio', /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(req, res) {
    var _req$body9, userId, bio, result;
    return _regeneratorRuntime().wrap(function _callee22$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          _req$body9 = req.body, userId = _req$body9.userId, bio = _req$body9.bio;
          _context22.next = 4;
          return _testUser.TestUserModel.updateOne({
            id: userId
          }, {
            bio: bio
          });
        case 4:
          result = _context22.sent;
          if (result.modifiedCount <= 0) {
            res.status(400).json({
              message: 'No user found with the provided ID or no update was needed.'
            });
          } else {
            res.status(200).json({
              message: 'Bio updated successfully.'
            });
          }
          _context22.next = 11;
          break;
        case 8:
          _context22.prev = 8;
          _context22.t0 = _context22["catch"](0);
          res.status(500).json({
            message: 'Error updating bio',
            error: _context22.t0.message
          });
        case 11:
        case "end":
          return _context22.stop();
      }
    }, _callee22, null, [[0, 8]]);
  }));
  return function (_x46, _x47) {
    return _ref22.apply(this, arguments);
  };
}());
router.put('/updateGithub', /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23(req, res) {
    var _req$body10, userId, githubLink, result;
    return _regeneratorRuntime().wrap(function _callee23$(_context23) {
      while (1) switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          _req$body10 = req.body, userId = _req$body10.userId, githubLink = _req$body10.githubLink;
          _context23.next = 4;
          return _testUser.TestUserModel.updateOne({
            id: userId
          }, {
            github: githubLink
          });
        case 4:
          result = _context23.sent;
          if (result.modifiedCount <= 0) {
            res.status(400).json({
              message: 'No user found with the provided ID or no update was needed.'
            });
          } else {
            res.status(200).json({
              message: 'Github link updated successfully.'
            });
          }
          _context23.next = 11;
          break;
        case 8:
          _context23.prev = 8;
          _context23.t0 = _context23["catch"](0);
          res.status(500).json({
            message: 'Error updating Github link',
            error: _context23.t0.message
          });
        case 11:
        case "end":
          return _context23.stop();
      }
    }, _callee23, null, [[0, 8]]);
  }));
  return function (_x48, _x49) {
    return _ref23.apply(this, arguments);
  };
}());
router.put('/updateLinkedin', /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(req, res) {
    var _req$body11, userId, linkedinLink, result;
    return _regeneratorRuntime().wrap(function _callee24$(_context24) {
      while (1) switch (_context24.prev = _context24.next) {
        case 0:
          _context24.prev = 0;
          _req$body11 = req.body, userId = _req$body11.userId, linkedinLink = _req$body11.linkedinLink;
          _context24.next = 4;
          return _testUser.TestUserModel.updateOne({
            id: userId
          }, {
            linkedin: linkedinLink
          });
        case 4:
          result = _context24.sent;
          if (result.modifiedCount <= 0) {
            res.status(400).json({
              message: 'No user found with the provided ID or no update was needed.'
            });
          } else {
            res.status(200).json({
              message: 'LinkedIn link updated successfully.'
            });
          }
          _context24.next = 11;
          break;
        case 8:
          _context24.prev = 8;
          _context24.t0 = _context24["catch"](0);
          res.status(500).json({
            message: 'Error updating LinkedIn link',
            error: _context24.t0.message
          });
        case 11:
        case "end":
          return _context24.stop();
      }
    }, _callee24, null, [[0, 8]]);
  }));
  return function (_x50, _x51) {
    return _ref24.apply(this, arguments);
  };
}());
router.post('/addGroup', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25(req, res) {
    var user;
    return _regeneratorRuntime().wrap(function _callee25$(_context25) {
      while (1) switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          _context25.next = 3;
          return _testUser.TestUserModel.findById(req.body.userId);
        case 3:
          user = _context25.sent;
          if (!user) {
            _context25.next = 11;
            break;
          }
          user.groups.push(req.body.groupId);
          _context25.next = 8;
          return user.save();
        case 8:
          res.status(201).send(user);
          _context25.next = 12;
          break;
        case 11:
          res.status(404).send("User not found");
        case 12:
          _context25.next = 18;
          break;
        case 14:
          _context25.prev = 14;
          _context25.t0 = _context25["catch"](0);
          console.log(_context25.t0);
          res.status(500).send("An error occurred during user update");
        case 18:
        case "end":
          return _context25.stop();
      }
    }, _callee25, null, [[0, 14]]);
  }));
  return function (_x52, _x53) {
    return _ref25.apply(this, arguments);
  };
}()));
router.get("/email/:userEmail", (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26(req, res) {
    var userEmail, user;
    return _regeneratorRuntime().wrap(function _callee26$(_context26) {
      while (1) switch (_context26.prev = _context26.next) {
        case 0:
          userEmail = decodeURIComponent(req.params.userEmail);
          _context26.next = 3;
          return _testUser.TestUserModel.findOne({
            emailAddress: userEmail
          });
        case 3:
          user = _context26.sent;
          if (user) {
            _context26.next = 7;
            break;
          }
          res.status(404).send({
            message: 'User not found'
          });
          return _context26.abrupt("return");
        case 7:
          res.status(200).send(user);
        case 8:
        case "end":
          return _context26.stop();
      }
    }, _callee26);
  }));
  return function (_x54, _x55) {
    return _ref26.apply(this, arguments);
  };
}()));
router.get('/:id', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27(req, res) {
    var user;
    return _regeneratorRuntime().wrap(function _callee27$(_context27) {
      while (1) switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return _testUser.TestUserModel.findById(req.params.id);
        case 2:
          user = _context27.sent;
          if (user) {
            res.status(200).send(user);
          } else {
            res.status(404).send({
              message: "User not found"
            });
          }
        case 4:
        case "end":
          return _context27.stop();
      }
    }, _callee27);
  }));
  return function (_x56, _x57) {
    return _ref27.apply(this, arguments);
  };
}()));

//UPDATE USER BACKGROUND PICTURE -
router.put('/update_background_picture', upload.single('file'), (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref28 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee28(req, res) {
    var email, user;
    return _regeneratorRuntime().wrap(function _callee28$(_context28) {
      while (1) switch (_context28.prev = _context28.next) {
        case 0:
          if (req.file) {
            _context28.next = 3;
            break;
          }
          res.status(400).json({
            message: 'No file uploaded'
          });
          return _context28.abrupt("return");
        case 3:
          email = req.body.email;
          _context28.next = 6;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              backgroundPhoto: req.file.path
            }
          }, {
            "new": true
          });
        case 6:
          user = _context28.sent;
          if (user) {
            res.status(200).send({
              message: 'User background photo updated successfuly',
              url: req.file.path
            });
          } else {
            res.status(404).send({
              message: 'User not found'
            });
          }
        case 8:
        case "end":
          return _context28.stop();
      }
    }, _callee28);
  }));
  return function (_x58, _x59) {
    return _ref28.apply(this, arguments);
  };
}()));

//UPDATE USER BIO - WORKING
router.put('/update_user_bio', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref29 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29(req, res, next) {
    var _req$body12, bio, email, user;
    return _regeneratorRuntime().wrap(function _callee29$(_context29) {
      while (1) switch (_context29.prev = _context29.next) {
        case 0:
          _req$body12 = req.body, bio = _req$body12.bio, email = _req$body12.email;
          _context29.next = 3;
          return _testUser.TestUserModel.findOneAndUpdate({
            emailAddress: email
          }, {
            $set: {
              bio: bio
            }
          }, {
            "new": true
          });
        case 3:
          user = _context29.sent;
          if (user) {
            res.status(200).json({
              message: 'User bio updated successfuly'
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }
        case 5:
        case "end":
          return _context29.stop();
      }
    }, _callee29);
  }));
  return function (_x60, _x61, _x62) {
    return _ref29.apply(this, arguments);
  };
}()));
var _default = router;
exports["default"] = _default;