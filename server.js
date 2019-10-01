const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log("Database Connection established");
  })
  .catch(err => {
    console.log("Oh, no! Something went wrong!");
  });

const app = require("./app");

app.listen(port, function() {
  console.log(`Server @ 127.0.0.1:${port}`);
});
