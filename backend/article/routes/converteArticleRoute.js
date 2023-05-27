const Express = require('express')
const convertedArticleRoute = Express.Router()
const bodyParser = Express.urlencoded({ extended: true })
const convertedArticleController = require('../controllers/convertedArticleController')

convertedArticleRoute.post('/addConvertedArticle', async (req, res, next) => {
    try {
        const result = await convertedArticleController.addConvertedArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

convertedArticleRoute.post('/getConvertedArticle', async (req, res, next) => {
    try {
        const result = await convertedArticleController.getConvertedArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

convertedArticleRoute.post('/deleteConvertedArticle', async (req, res, next) => {
    try {
        const result = await convertedArticleController.deleteConvertedArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

module.exports = convertedArticleRoute