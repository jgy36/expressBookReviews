import express from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import { regd_users } from "./router/auth_users.js";
import { public_users } from "./router/general.js";

const app = express();

app.use(express.json());
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    let token;
  
    if (req.session?.authorization?.accessToken) {
      token = req.session.authorization.accessToken;
    } 
    else if (req.headers.authorization) {
      const headerParts = req.headers.authorization.split(" ");
      if (headerParts.length === 2 && headerParts[0] === "Bearer") {
        token = headerParts[1];
      }
    }
  
    if (token) {
      jwt.verify(token, "access", (err, user) => {
        if (!err) {
          req.user = user;
          next();
        } else {
          return res.status(403).json({ message: "User not authenticated" });
        }
      });
    } else {
      return res.status(403).json({ message: "Token missing or invalid" });
    }
  });
  
  

app.use("/customer", regd_users);
app.use("/", public_users);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
