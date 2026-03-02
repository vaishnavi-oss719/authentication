// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import User from '../Models/user.schema.js';


//  dotenv.config();


//   const authMiddleware = async (req, res, next) => {
//     const token = req.header('Authorization')
//     if (!token) {
//         return res.status(401).json({message:"Token is missing"})
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         const user = await User.findById(req.user._id);

//         if (user.role != 'admin') {
//             return res.status(401).json({ message: 'Access Deny' });
//         }
//         next();
//     } catch (error) {
//         res.status(500).json({message:'Invalid Token, Internal Server Error'})
//     }
// }

// export default authMiddleware;



import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../Models/user.schema.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token is missing or invalid format" });
  }

  const token = authHeader.split(' ')[1];

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded:", decoded);
  next();
} catch (error) {
  console.log("JWT Error:", error.message);
  return res.status(401).json({ message: error.message });
}
};
export default authMiddleware;