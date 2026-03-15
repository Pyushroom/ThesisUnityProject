import {db} from "../db.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import generateRandomString from '../functions/emailVerCodeGenerator.js';
import sendVerificationEmail from '../functions/sendEmail.js';


export const register = async (req, res) => {

    // Check if passwords match
    if (req.body.password !== req.body.repeatPassword) {
      return res.status(400).json('Passwords do not match');
    }
    
    //check if user exists
    const q = "SELECT * FROM users WHERE name = ? OR email = ?";
    db.query(q, [req.body.username, req.body.email], async (err, result) => {
      if (err) return res.json(err);
      if (result.length)
        return res.status(409).json("User already exists");
  
      try {
        //hash the password
        const hash = await argon2.hash(req.body.password)
        const verCode = generateRandomString();
  
        //add user to database
        const q =
          "INSERT INTO `users`( `name`, `email`, `password`, `verification_code` ) VALUES (?)";
        const values = [req.body.username, req.body.email, hash, verCode];
        const fromEmail = '***********@gmail.com'; // Replace with your email address
        db.query(q, [values], (err, result) => {
          if (err) return res.json(err);

          //send verification email
          sendVerificationEmail(req.body.username, verCode, req.body.email, fromEmail);
          return res.status(200).json("User has been created");
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong");
      }
    });
  };

  export const login =  (req, res) => {
    const q = "SELECT * FROM users WHERE name = ?";
    console.log(req.body.username);
  
    db.query(q, [req.body.username], async (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
      console.log(data[0].password , req.body.password);
      const hash = data[0].password;
      const inputPassword = req.body.password;
      
      let checkPassword;
      try {
        checkPassword = await argon2.verify(hash, inputPassword);
      } catch (err) {
        return res.status(500).json(err);
      }

      console.log(checkPassword)
  
      if (!checkPassword)
        return res.status(400).json("Wrong password or username!");
  
      const token = jwt.sign({ id: data[0].id }, "secretkey");
  
      const { password, ...others } = data[0];
  
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    });
  };


export const logout = (req, res) =>{
    res.clearCookie('access_token', {
        sameSite:'none',
        secure: true
    }).status(204).json("User has been logged out")
}

export const emailVerify = async (req, res) => {
  const { verificationCode, username, email } = req.body;
  //console.log(username, email, verificationCode)

  const selectQuery = "SELECT verification_code FROM users WHERE name = ? AND email = ?";
  db.query(selectQuery, [username, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!result || result.length === 0) {
      return res.status(400).json({ error: "Something went wrong in verification" });
    }

    const dbVerificationCode = result[0].verification_code;
    //console.log(dbVerificationCode === verificationCode)

    if (verificationCode === dbVerificationCode) {
      // verification code is correct
      const updateQuery = "UPDATE users SET isverify = 1 WHERE name = ? AND email = ?";
      db.query(updateQuery, [username, email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: "Verification successful" });
      });
    } else {
      // verification code is incorrect
      return res.status(400).json({ error: "Incorrect verification code" });
    }
  });
};


