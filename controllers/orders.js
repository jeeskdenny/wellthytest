const pool = require('../helpers/psql')
const { validationResult } = require('express-validator/check');
var common = require('../methods/common');

/**
* Create Order action.
* URL: http://localhost:3000/orders
* METHOD: POST
*   JSON INPUT FORMAT 
    {
        "origin": ["START_LATITUDE", "START_LONGITUDE"],
        "destination": ["END_LATITUDE", "END_LONGITUDE"]
    }
*/

exports.createOrder = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            var singleError = errors.array()[0];
            throw singleError.msg + ' ' + singleError.param + ' in ' + singleError.location
        }
        var origin = req.body.origin;
        var destination = req.body.destination;
        let theDistancePromise = common.getDistanceFromGoogleMapApi(origin.toString(), destination.toString());
        theDistancePromise.then(value => {
            const text = 'INSERT INTO orders (status, distance) VALUES ($1, $2) RETURNING *'
            const addvalues = ['UNASSIGNED', value]
            pool.query(text, addvalues, (err, results) => {
                if (err) {
                    throw err;
                } else {
                    if (results.rows && results.rows.length > 0) {
                        delete results.rows[0].timestamp;
                        res.status(200).json(results.rows[0]);
                    }
                }
            })
        }).catch(error => {
            res.status(200).json({
                error: error
            });
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({
            error: err
        });
    }
};

/**
* Taking Order action.
* URL: http://localhost:3000/orders/:id
* METHOD: PATCH
*   JSON INPUT FORMAT 
    {
        "status": "TAKEN"
    }
*/

exports.takeOrder = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        var singleError = errors.array()[0];
        res.status(200).json({
            error: singleError.msg + ' ' + singleError.param + ' in ' + singleError.location
        })
    } else {
        const id = parseInt(req.params.id);
        (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const query = {
                    name: 'fetch-order',
                    text: 'SELECT * FROM orders WHERE id = $1',
                    values: [id],
                }
                const getOrder = await client.query(query);
                if (getOrder.rows && getOrder.rows.length > 0) {
                    if (getOrder.rows[0].status === "UNASSIGNED") {
                        const queryText = 'UPDATE orders SET status=($1) WHERE id=($2)'
                        await client.query(queryText, ['SUCCESS', id])
                        await client.query('COMMIT')
                        res.status(200).json({
                            "status": "SUCCESS"
                        })
                    } else {
                        throw new Error("you can take the order only once")
                    }
                }
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
            }
        })().catch(e => {
            res.status(200).json({
                error: e.message
            })
        })
    }
}


/**
* Gert list of Orders action.
* URL: http://localhost:3000/orders?page=:page&limit=:limit
* METHOD: GET
*/
exports.listOrder = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        var singleError = errors.array()[0];
        res.status(200).json({
            error: singleError.msg + ' ' + singleError.param + ' in ' + singleError.location
        })
    } else {
        var PageLimit = req.query.limit
        var RequestPage = req.query.page
        var howMuchSkip = (parseInt(PageLimit) * parseInt(RequestPage)) - parseInt(PageLimit);
        (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const query = {
                    name: 'order-list',
                    text: 'SELECT id,status,distance,count(*) OVER() AS full_count FROM orders ORDER BY timestamp LIMIT ($1) OFFSET ($2)',
                    values: [PageLimit, howMuchSkip]
                }
                const getOrder = await client.query(query);
                const totalCount = await client.query('SELECT COUNT(*) FROM orders');
                await client.query('COMMIT')
                if (totalCount.rows && totalCount.rows[0]) {
                    if ((parseInt(PageLimit) * parseInt(RequestPage)) <= parseInt(totalCount.rows[0].count)) {
                        if (getOrder.rows) {
                            res.status(200).json(getOrder.rows)
                        }
                    }
                    res.status(200).json(getOrder.rows)
                }
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
            }
        })().catch(e => {
            res.status(200).json({
                error: e.message
            })
        })
    }
}