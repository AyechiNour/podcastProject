const Express = require('express')
const tokenRoute = Express.Router()
const bodyParser = Express.urlencoded({ extended: true })
const tokenController = require('../controllers/tokenController')

tokenRoute.post('/getToken', async (req, res, next) => {
    try {
        const result = await tokenController.getToken(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

tokenRoute.get('/verifToken', async (req, res, next) => {
    try {
        const result = await tokenController.verifToken(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

tokenRoute.post('/decodeToken', async (req, res, next) => {
    try {
        const result = await tokenController.decodeToken(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

module.exports = tokenRoute