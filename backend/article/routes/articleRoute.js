const Express = require('express')
const articleRoute = Express.Router()
const bodyParser = Express.urlencoded({ extended: true })
const articleController = require('../controllers/articleController')

articleRoute.post('/addArticle', async (req, res, next) => {
    try {
        const result = await articleController.addArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

articleRoute.post('/getArticle', async (req, res, next) => {
    try {
        const result = await articleController.getArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

articleRoute.post('/getArticleNonConverted', async (req, res, next) => {
    try {
        const result = await articleController.getArticleNonConverted(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

articleRoute.post('/deleteArticle', async (req, res, next) => {
    try {
        const result = await articleController.deleteArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

articleRoute.post('/verifArticle', async (req, res, next) => {
    try {
        const result = await articleController.verifIdArticle(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

articleRoute.post('/generateArticle',async (req,res,next)=>{
    try {
        const result = await articleController.generateArticle(req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
})

articleRoute.post('/updateArticleStatus',async (req,res,next)=>{
    try {
        const result = await articleController.updateStatusArticle(req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = articleRoute