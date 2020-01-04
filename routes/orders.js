var express = require('express');
var router = express.Router();
const order = require('../controllers/orders');

var validation = require('../middlewares/validators/orders');

router.post('/', validation.validate('createOrder'), order.createOrder);
router.patch('/:id', validation.validate('takeOrder'), order.takeOrder);
router.get('/', validation.validate('listOrder'), order.listOrder);

module.exports = router;