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
var sampleUsers_1 = require("../sampleUsers"); // Replace this with your actual sample user data
var crypto_1 = __importDefault(require("crypto"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var router = (0, express_1.Router)();
router.get('/', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.UserModel.find()];
            case 1:
                users = _a.sent();
                res.send(users);
                return [2 /*return*/];
        }
    });
}); }));
router.get('/seed', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersCount, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, user_model_1.UserModel.countDocuments()];
            case 1:
                usersCount = _a.sent();
                if (usersCount > 0) {
                    res.send("Seed is already done");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user_model_1.UserModel.create(sampleUsers_1.sample_users)];
            case 2:
                _a.sent();
                res.status(200).json("Seed is done!");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).json({ message: 'Error seeding database' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
router.get('/delete', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.UserModel.deleteMany({})];
            case 1:
                _a.sent();
                res.send("Delete is done!");
                return [2 /*return*/];
        }
    });
}); }));
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
router.post("/create_user", (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, inviteToken, newUser, transporter, mailOptions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log("User creation request received:", req.body);
                return [4 /*yield*/, user_model_1.UserModel.findOne({ emailAddress: req.body.emailAddress })];
            case 1:
                existingUser = _a.sent();
                if (existingUser) {
                    console.log("User with this email already exists");
                    res.status(409).send("User with this email already exists.");
                    return [2 /*return*/];
                }
                inviteToken = crypto_1.default.randomBytes(32).toString("hex");
                newUser = new user_model_1.UserModel({
                    name: req.body.name,
                    surname: req.body.surname,
                    profilePhoto: req.body.profilePhoto,
                    emailAddress: req.body.emailAddress,
                    inviteToken: inviteToken,
                    status: "pending",
                    roles: req.body.roles,
                    groups: req.body.groups,
                    password: "Admin"
                });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _a.sent();
                transporter = nodemailer_1.default.createTransport({
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
                    attachments: [
                        {
                            filename: 'luna-logo.png',
                            path: 'assets/luna-logo.png',
                            cid: 'logo'
                        }
                    ]
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log("Email sent: " + info.response);
                    }
                });
                console.log("User created successfully");
                res.status(201).send({ message: 'User created successfully', inviteToken: inviteToken });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("User creation error:", error_2);
                res.status(500).send("An error occurred during user creation.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
//const token = req.query.token;
///create a router.get to display the component that is suppose to get the new password from the user
router.get('/activate_account', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inviteToken, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Account activation request received:', req.query.token);
                inviteToken = req.query.token;
                return [4 /*yield*/, user_model_1.UserModel.findOne({ inviteToken: inviteToken })];
            case 1:
                user = _a.sent();
                console.log("When in here");
                if (!user) {
                    console.log('Invalid token');
                    res.status(409).send('Invalid token.');
                    return [2 /*return*/];
                }
                else {
                    res.redirect("http://localhost:4200/activate_account/".concat(inviteToken));
                    // res.status(200).send({ message: 'Token Authenticated', inviteToken: inviteToken });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); }));
//ACTIVATE THE ACCOUNT WITH THE NEW PASSWORD//
router.post('/activate_account', (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, inviteToken, password, user, salt, hashedPassword, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log('Account activation request received:', req.body);
                _a = req.body, inviteToken = _a.inviteToken, password = _a.password;
                return [4 /*yield*/, user_model_1.UserModel.findOne({ inviteToken: inviteToken })];
            case 1:
                user = _b.sent();
                if (!user) {
                    console.log('Invalid token');
                    res.status(409).send('Invalid token.');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
            case 3:
                hashedPassword = _b.sent();
                user.password = hashedPassword;
                user.emailVerified = true; // Assuming the activation also verifies the email
                user.inviteToken = undefined;
                return [4 /*yield*/, user.save()];
            case 4:
                _b.sent();
                console.log('Account activated successfully');
                res.status(201).send({ message: 'Account activated successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error('Account activation error:', error_4);
                res.status(500).send('An error occurred during account activation.');
                return [3 /*break*/, 6];
            case 6:
                console.log(req.body);
                return [2 /*return*/];
        }
    });
}); }));
router.post('/get_user_by_token', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                token = req.body.token;
                return [4 /*yield*/, user_model_1.UserModel.findOne({ inviteToken: token })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                res.status(200).json({ email: user.emailAddress });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error retrieving user by token:', error_5);
                res.status(500).json({ error: 'An error occurred while retrieving user by token' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
