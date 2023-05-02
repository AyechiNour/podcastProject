require('dotenv').config();
const Express = require("express")
const audioRoute = require("./routes/audioRoute")
const app = Express()
const bodyParser = require('body-parser');

const models = require('./models')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(Express.json())
 app.use(audioRoute)
 const path = require('path');
 app.use('/uploads', Express.static(path.join(__dirname,"uploads")));








models.sequelize.sync().then(function () {
  app.listen(3003, () => { console.log("Audio listening on port 3003") })
});