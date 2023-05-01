require('dotenv').config();
const Express = require("express")
const articleRouter = require('./routes/articleRoute')
const app = Express()

const models = require('./models')
app.use(Express.json())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(articleRouter)

models.sequelize.sync().then(function () {
    app.listen(3002, () => { console.log("Article listening on port 3002") })
});