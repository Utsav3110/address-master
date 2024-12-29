import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers['accesstoken'] || req.cookies['accessToken'];

    if (!token) {
      return res.status(401).json({
        messasge: 'anathorized request',
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      return res.status(404).json({
        message: 'Invalid Access Token ',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};
