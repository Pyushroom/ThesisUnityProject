import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import unityRoutes from "./routes/unity.js";

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
  };

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use("/server/users", userRoutes);
app.use("/server/auth", authRoutes);
app.use("/server/unity", unityRoutes);


app.listen(5000, () =>{
    console.log('Server listening on port 5000');
})