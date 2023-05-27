require('dotenv').config();
const Express = require("express")
const userRouter = require('./routes/userRoute')
const app = Express()
const models = require('./models')
app.use(Express.json())
app.use(userRouter)

models.sequelizeMetaUser.sync().then(() => {
    models.sequelizeUser.sync().then(() => {
        app.listen(3001, () => {
            console.log("User listening on port 3001");
        });
    });
});