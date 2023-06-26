"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var user_model_1 = require("../models/user.model");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var router = (0, express_1.Router)();
router.post("/", (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, validPassword, secretKey, setRoles, _i, _a, role, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log("Login request received:", req.body); // Log the request body
                return [4 /*yield*/, user_model_1.UserModel.findOne({ emailAddress: req.body.emailAddress }).select("+password")];
            case 1:
                user = _b.sent();
                console.log("User found:", user); // Log the user object
                if (!user) return [3 /*break*/, 3];
                console.log("Request password:", req.body.password);
                console.log("User password:", user.password);
                console.log("Hashededed password from DB:", user.password); // Add this line
                console.log("Types:", typeof req.body.password, typeof user.password);
                return [4 /*yield*/, bcryptjs_1.default.compare(req.body.password, user.password)];
            case 2:
                validPassword = _b.sent();
                console.log("Result of bcrypt compare:", validPassword);
                if (!validPassword) {
                    console.log("Invalid password");
                    res.status(401).send({ auth: false, token: null });
                    return [2 /*return*/];
                }
                secretKey = process.env.JWT_SECRET;
                if (!secretKey) {
                    console.log("JWT Secret is not defined");
                    throw new Error('JWT Secret is not defined');
                }
                setRoles = "Default";
                for (_i = 0, _a = user.roles; _i < _a.length; _i++) {
                    role = _a[_i];
                    if (role == "Manager") {
                        setRoles = role;
                        break;
                    }
                    else if (role == "Functional") {
                        setRoles = role;
                        break;
                    }
                    else if (role == "Technical") {
                        setRoles = role;
                    }
                }
                token = jsonwebtoken_1.default.sign({ _id: user._id, role: setRoles, user: user }, secretKey, {
                    expiresIn: 86400, // expires in 24 hours
                });
                console.log("Login successful");
                res.status(200).send({ auth: true, token: token });
                return [3 /*break*/, 4];
            case 3:
                console.log("User not found");
                res.status(404).send("No user found.");
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error("Login error:", error_1);
                res.status(500).send("An error occurred during login.");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
