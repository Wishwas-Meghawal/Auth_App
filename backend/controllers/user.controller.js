// This file contains the controller functions for user-related operations, such as registration and login.

import sanitize from "mongo-sanitize";
import TryCatch from "../middlewares/TryCatch.js";
import { registerUserSchema } from "../config/zod.js";
import { codec } from "zod";

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

  res.json({
    name,
    email,
    password,
  })
})