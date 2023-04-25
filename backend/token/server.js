require('dotenv').config();
const Express = require("express")
const tokenRoute = require("./routes/tokenRoute")
const app = Express()

app.use(Express.json())
app.use(tokenRoute)

app.listen(3004, () => { console.log("Token listening on port 3004") })