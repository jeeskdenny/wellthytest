const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

var ordersRoutes = require("./routes/orders");

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use("/orders", ordersRoutes);

app.get("*", function (req, res) {
    res.status(200).json({
        status: "notok",
        code: "1000",
        success: false,
        message: "Sorry, this is an invalid Request.",
        data: []
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})