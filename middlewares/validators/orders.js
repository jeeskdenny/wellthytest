const { body, param, query } = require('express-validator/check')

exports.validate = (method) => {
    var cordinatesReg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");

    switch (method) {
        case 'createOrder': {
            return [
                body('origin')
                    .exists()
                    .isArray({ min: 2, max: 2 })
                    .custom((value, { req }) => typeof value[0] == 'string')
                    .custom((value, { req }) => typeof value[1] == 'string')
                    .custom((value, { req }) => !value[0].match(cordinatesReg))
                    .custom((value, { req }) => !value[1].match(cordinatesReg)),

                body('destination')
                    .exists()
                    .isArray({ min: 2, max: 2 })
                    .custom((value, { req }) => typeof value[0] == 'string')
                    .custom((value, { req }) => typeof value[1] == 'string')
                    .custom((value, { req }) => !value[0].match(cordinatesReg))
                    .custom((value, { req }) => !value[1].match(cordinatesReg))
            ]
        }
        case 'takeOrder': {
            return [
                param('id')
                    .exists(),

                body('status')
                    .exists()
                    .custom((value, { req }) => value == 'TAKEN')
            ]
        }

        case 'listOrder': {
            return [
                query('page')
                    .exists()
                    .isInt({ gt: 0 }),

                query('limit')
                    .exists()
                    .isInt({ gt: 0 }),
            ]
        }

    }
}