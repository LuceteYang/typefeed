import express from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import path from "path";
import expressValidator from "express-validator";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Connect to MongoDB
// const mongoUrl = MONGODB_URI;
// (<any>mongoose).Promise = bluebird;
// mongoose.connect(mongoUrl, {useMongoClient: true}).then(
//   () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
// ).catch(err => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
//   // process.exit();
// });

// Express configuration
app.set("port", process.env.PORT || 3001);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(
  "/static",
  express.static(path.join(__dirname, "./../frontend", "build", "static"), {
    maxAge: 31557600000
  })
);

/**
 * Primary app routes.
 */

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);

// Default every route except the above to serve the index.html
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "./../frontend/build/index.html"));
});

export default app;
