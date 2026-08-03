import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModel";


const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  console.log("Controller JWT_SECRET:", process.env.JWT_SECRET);


  if (!secret) {
    console.log("Current JWT_SECRET:", process.env.JWT_SECRET);
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    { id },
    secret,
    {
      expiresIn: "7d",
    }
  );
};


// Register
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, username, password, confirmPassword } = req.body;


    if (!email || !username || !password || !confirmPassword) {
      res.status(400).json({
        message: "Please fill all fields",
      });
      return;
    }


    if (password !== confirmPassword) {
      res.status(400).json({
        message: "Passwords do not match",
      });
      return;
    }


    const existingUser = await User.findOne({ email });


    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }


    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );


    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });


    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      token: generateToken(user._id.toString()),
    });


  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      error:
        error instanceof Error
          ? error.message
          : error,
    });

  }
};



// Login
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { email, password } = req.body;


    if (!email || !password) {

      res.status(400).json({
        message: "Please enter your email and password",
      });

      return;
    }



    const user = await User.findOne({
      email,
    });



    if (!user) {

      res.status(400).json({
        message: "User does not exist",
      });

      return;
    }



    const isMatch = await bcrypt.compare(
      password,
      user.password
    );



    if (!isMatch) {

      res.status(400).json({
        message: "Invalid credentials",
      });

      return;
    }



    res.status(200).json({

      _id: user._id,

      email: user.email,

      username: user.username,

      token: generateToken(
        user._id.toString()
      ),

    });



  } catch (error) {


    res.status(500).json({

      message: "Internal Server Error",

      error:
        error instanceof Error
          ? error.message
          : error,

    });


  }

};