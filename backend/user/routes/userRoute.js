const Express = require('express')
const userRoute = Express.Router()
const bodyParser = Express.urlencoded({ extended: true })
const userController = require('../controllers/userController')

userRoute.post('/verifUser', async (req, res, next) => {
    try {
        const result = await userController.verifId(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

module.exports = userRoute