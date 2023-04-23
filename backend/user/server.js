require('dotenv').config();
const Express = require("express")
const userRouter = require('./routes/userRoute')
const app = Express()

const models = require('./models')
app.use(Express.json())
app.use(userRouter)

models.sequelize.sync().then(function () {
    app.listen(3001, () => { console.log("User listening on port 3001") })
});