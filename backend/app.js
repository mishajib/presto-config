const express = require("express");
const app = express();
const cors = require("cors");
const methodOverride = require("method-override");
const apiRoutes = require("./routes/api");

const corsOptions = {
    // origin:'https://prestaconfig.mi-shajib.com',
    AccessControlAllowOrigin: '*',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override
app.use(methodOverride("_method"));

app.use('/', apiRoutes);

// 404 Error Handler
app.use((req, res, next) => {
    console.log('req.status', req);
    if (res.status(404)) {
        return res.status(404).json({error: "Not Found"});
    } else {
        return res.status(500).json({error: "Internal Server Error"});
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    // Check if the error status is 404
    console.log('err.status', err);
    if (err.status === 404) {
        return res.status(404).json({error: "Not Found"});
    } else if (err.status === 401) {
        return res.status(401).json({error: "Unauthorized"});
    } else {
        // For other errors, you can customize the error response
        res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports = app;
