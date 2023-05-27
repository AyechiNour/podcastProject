require('dotenv').config();
const Express = require("express")
const articleRouter = require('./routes/articleRoute')
const convertedArticleRouter = require('./routes/converteArticleRoute')
const app = Express()
const { Configuration, OpenAIApi } = require("openai")

const models = require('./models')
app.use(Express.json())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(articleRouter)
app.use(convertedArticleRouter)
app.get('/test', async (req, res, next) => {
    try {

        const config = new Configuration({
            apiKey: process.env.OPEN_AI_API
        })
        const openai = new OpenAIApi(config)
        const test = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "prompt",
            max_tokens: 150,
            temperature: 0.9
        })
        res.status(200).json(test)
    } catch (error) {
        res.status(400).json(error)
    }
})

models.sequelizeArticle.sync().then(() => {
    models.sequelizeConvertedArticle.sync().then(() => {
        app.listen(3002, () => { console.log("Article listening on port 3002") })
    });
});
