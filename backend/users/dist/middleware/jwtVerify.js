"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtVerify = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
// export const jwtVerify = (allowedRoles: string[]) => {
//     return (req: any, res: any, next: any) => {
//         const authHeader = req.headers.authorization || req.headers.Authorization;
//         if (!authHeader?.startsWith('Bearer ')) {
//             console.log('No token provided');
//            // res.status(401).send({ message: 'No token provided' });
//         }

//         console.log('authHeader:', authHeader);

//         const token = authHeader.split(' ')[1];
//         console.log('token:', token);

//         const JWT_SECRET = 'Jetpad2023';

//         jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//             if (err) {
//                 console.log('Unauthorized token:', err.message);
//                 res.status(401).send({ message: 'Unauthorized token' });
//             }

//             console.log('Decoded token:', decoded);

//             req.user = decoded.id; // Access the '_id' property directly
//             req.roles = decoded.role; // Access the 'role' property directly

//             if (!req?.roles) {
//                 console.log("he has no roles", req.roles);
//                 console.log("allowed roles", allowedRoles);
//                 res.status(401).send({ message: 'Unauthorized' , roles: req.roles});
//             } else {
//                 console.log("allowed roles", allowedRoles);
//                 console.log("he has roles", req.roles);
//             }

//             if(allowedRoles.includes(req.roles)){
//                 console.log('he got verified');
//                 //res.status(200).send('verified');
//                // next();
//             } else {
//                 console.log('he not verified');
//                res.status(401).send({ message: 'Unauthorized role' });
//             }

//             next();
//         });
//     }
// };

// export const jwtVerify = (allowedRoles: string[]) => {
//     return (req: any, res: any, next: any) => {
//         const authHeader = req.headers.authorization || req.headers.Authorization;
//         if (!authHeader?.startsWith('Bearer ')) {
//             console.log('No token provided');
//             res.status(401).send({ message: 'No token provided' });
//             return; // Return to prevent further processing
//         }

//         console.log('authHeader:', authHeader);

//         const token = authHeader.split(' ')[1];
//         console.log('token:', token);

//         const JWT_SECRET = 'Jetpad2023';

//         jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//             if (err) {
//                 console.log('Unauthorized token:', err.message);
//                 return res.status(401).send({ message: 'Unauthorized token' });
//             }

//             console.log('Decoded token:', decoded);

//             req.user = decoded.id; // Access the '_id' property directly
//             req.roles = decoded.role; // Access the 'role' property directly

//             if (!req?.roles || !allowedRoles.includes(req.roles)) {
//                 console.log("Unauthorized role");
//                 return res.status(401).send({ message: 'Unauthorized token roles' });
//             }

//             console.log('User has the required roles');
//             next(); // Proceed to the next middleware
//         });
//     };
// };

var jwtVerify = function jwtVerify(allowedRoles) {
  return function (req, res, next) {
    var authHeader = req.headers.authorization || req.headers.Authorization;
    if (!(authHeader !== null && authHeader !== void 0 && authHeader.startsWith('Bearer '))) {
      console.log('No token provided');
      res.status(401).send({
        message: 'No token provided'
      });
      return; // Return to prevent further processing
    }

    console.log('authHeader:', authHeader);
    var token = authHeader.split(' ')[1];
    console.log('token:', token);
    var JWT_SECRET = 'Jetpad2023';
    _jsonwebtoken["default"].verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log('Unauthorized token:', err.message);
        return res.status(401).send({
          message: 'Unauthorized token'
        });
      }

      //  console.log('Decoded token:', decoded);

      var roles = decoded.role; // Access the 'role' property directly
      //   console.log('Decoded roles:', roles);

      req.user = decoded.user; // Access the 'user' property directly
      req.roles = roles; // Store the roles in the 'req' object for later use

      //     console.log('Allowed roles:', allowedRoles);
      //     console.log('Decoded roles:', roles);

      // Check if the user has any allowed role
      var hasAllowedRole = roles.some(function (role) {
        return allowedRoles.includes(role);
      });
      if (!hasAllowedRole) {
        console.log("Unauthorized role");
        return res.status(401).send({
          message: 'Unauthorized token roles'
        });
      }

      //      console.log('User has the required roles');
      next(); // Proceed to the next middleware
    });
  };
};
exports.jwtVerify = jwtVerify;