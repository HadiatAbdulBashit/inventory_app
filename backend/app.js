const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
const { notFound, errorHandler, appLog } = require('./middleware/error.middleware')
const cookieParser = require('cookie-parser');
const FileUpload = require("express-fileupload");


dotenv.config()

const app = express();
const PORT = dotenv.PORT || 8080;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(FileUpload());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static("backend/public"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "This is API for inventory App." });
});

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

require("./routes/user.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/item.routes")(app);
require("./routes/transaction.routes")(app);
require("./routes/transactionDetail.routes")(app);
require("./routes/returnItem.routes")(app);
require("./routes/itemDetail.routes")(app);
require("./routes/app.routes")(app);

app.use(notFound);
app.use(appLog);
app.use(errorHandler);

// listen for requests
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));