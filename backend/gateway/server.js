require('dotenv').config();
const Express = require("express")
const cors = require("cors")
const proxy = require("express-http-proxy")

const app = Express()

app.use(cors())

app.use('/article', proxy('http://podcastproject-article-1:3002'))
app.use('/audio', proxy('http://podcastproject-audio-1:3003'))
app.use('/user', proxy('http://podcastproject-user-1:3001'))
app.use('/authorisation', proxy('http://podcastproject-token-1:3004'))

app.use((req,res,next)=>{
    res.send('from gateway')
})

app.listen(3000, () => { console.log("Gateway listening on port 3000") })