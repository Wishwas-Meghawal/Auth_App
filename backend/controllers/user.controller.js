// This file contains the controller functions for user-related operations, such as registration and login.

import sanitize from "mongo-sanitize";
import TryCatch from "../middlewares/TryCatch.js";
import { loginUserSchema, registerUserSchema } from "../config/zod.js";
import { codec } from "zod";
import { redisClient } from "../index.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import crypto from "crypto";
import { generateAccessToken, generateToken, revokeRefreshToken, verifyRefreshToken } from "../config/generateToken.js";

// registerUser function to handle user registration
export const registerUser = TryCatch(async (req, res)=>{

  const sanitezedBody = sanitize(req.body);

  const validation = registerUserSchema.safeParse(sanitezedBody);

 if(!validation.success){
  const zodError = validation.error;

  let firstErrorMessage = "Validation failed";
  let allErrors = [];

  if(zodError?.issues && Array.isArray(zodError.issues)){
    allErrors = zodError.issues.map((issue)=>({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code : issue.code,
    }))

    firstErrorMessage = zodError.issues[0]?.message || "Validation Error";
  }
  return res.status(400).json({
    message: firstErrorMessage,
    errors: allErrors
  })
 }

 const {name, email, password} = validation.data;


 const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

 if(await redisClient.get(rateLimitKey)){
  return res.status(429).json({
    message: "Too many registration attempts. Please try again later."
  })
 }

 const existingUser = await User.findOne({email});

 if(existingUser){
  return res.status(400).json({
    message: "User with this email already exists"
  });
 }

 const hashPassword = await bcrypt.hash(password, 10);

 const verifyToken = crypto.randomBytes(32).toString("hex");

 const verifyKey  = `verify:${verifyToken}`;

 const datatoStore = JSON.stringify ({
  name,
  email,
  padssword : hashPassword,
 });

 await redisClient.set(verifyKey, datatoStore, {EX : 300});

 const subject = "Verify your email for Account Registration";
 const html = getVerifyEmailHtml({email, token: verifyToken});

await sendMail({email, subject, html});

await redisClient.set(rateLimitKey, "true",{EX: 60});


  res.json({
    message: "Registration successful. Please check your email to verify your account it will expire in 5 minutes"
  })
})


// verifyEmail function to handle email verification
export const verifyUser = TryCatch(async (req , res)=>{
  const {token} = req.params;

  if(!token){
    return res.status(400).json({
      message: "Verification token is required.",
    });
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if(!userDataJson){
    return res.status(400).json({
      message: "Invalid or expired verification token.",
    });
  }


  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({email:userData.email});

  if(existingUser){
    return res.status(400).json({
      message: "User with this email already exists"
    });
  }


  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.padssword,
  });

  res.status(201).json({
    message: "Email verified successfully. Your account has been created.",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }
  })
});


// loginUser function to handle user login (not implemented yet)
export const loginUser = TryCatch(async (req, res)=>{
  const sanitezedBody = sanitize(req.body);

  const validation = loginUserSchema.safeParse(sanitezedBody);

 if(!validation.success){
  const zodError = validation.error;

  let firstErrorMessage = "Validation failed";
  let allErrors = [];

  if(zodError?.issues && Array.isArray(zodError.issues)){
    allErrors = zodError.issues.map((issue)=>({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code : issue.code,
    }))

    firstErrorMessage = zodError.issues[0]?.message || "Validation Error";
  }
  return res.status(400).json({
    message: firstErrorMessage,
    errors: allErrors
  })
 }

 const {email, password} = validation.data;

 const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

 if(await redisClient.get(rateLimitKey)){
  return res.status(429).json({
    message: "Too many registration attempts. Please try again later."
  })
 }


 const user = await User.findOne({email})

 if(!user){
  return res.status(400).json({
    message: "Invalid credentials",
  })
 }

 const comaparePassword = await bcrypt.compare(password, user.password);

 if(!comaparePassword){
  return res.status(400).json({
    message: "Invalid credentials",
  })
 }


 const otp = Math.floor(100000 + Math.random() * 900000).toString();

 const otpKey = `otp:${email}`;

 await redisClient.set(otpKey, JSON.stringify(otp),{
  EX: 300,
 });

 const subject = "Your OTP for Verification";

 const html = getOtpHtml({email, otp});

  await sendMail({email, subject, html});

  await redisClient.set(rateLimitKey, "true",{EX: 60});

  res.json({
    message: "If your email is valid, an otp has been sent. it will be valid for 5 minutes.",
  })
});


// verifyOtp function to handle OTP verification (not implemented yet)
export const verifyOtp = TryCatch(async (req, res)=>{
  const {email, otp} =  req.body;

  if(!email || !otp){
    return res.status(400).json({
      message : "Email and OTP are required.",
    })
  }


  const otpKey = `otp:${email}`;

  const storedOtpString = await redisClient.get(otpKey);

  if(!storedOtpString){
    return res.status(400).json({
      message: "expired OTP.",
    })
  }

  const storedOtp = JSON.parse(storedOtpString);

  if(storedOtp !== otp){
    return res.status(400).json({
      message: "Invalid OTP.",
    })
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({email});

  const tokenData =  await generateToken(user._id, res);

  res.status(200).json({
    message: `Welocome ${user.name}`,
    user,
  });
});


export const myProfile = TryCatch(async (req, res)=>{
  const user = req.user;

  res.json(user);
})


export const refreshToken = TryCatch(async (req,res)=>{
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const decode = await verifyRefreshToken(refreshToken);

  if(!decode){
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  generateAccessToken(decode.id, res);

  res.status(200).json({
    message: "Token refreshed",
  });
});


export const logutUser = TryCatch(async(req, res)=>{
  const userId = req.user_id;

  await revokeRefreshToken(userId);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  await redisClient.del(`user:${userId}`);

  res.json({
    message: "Logged out successfully",
  });
})