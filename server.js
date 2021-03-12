"use strict";

require('dotenv-defaults').config();

const axios      = require('axios'),
      bodyParser = require('body-parser'),
      chalk      = require('chalk'),
      express    = require('express'),
      morgan     = require('morgan');

const app  = express();
const port = process.env.PORT || 3000;

/**
 * Writes access log to stdout
 */
app.use(morgan('tiny'));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

/**
 * serving static files from ./public folder
 */
app.use(express.static('public'))

app.post('/post', bodyParser.urlencoded({extended: true}), (req, res) => {

    console.log(`post data: ${JSON.stringify(req.body)}`);

    const callbackData = {
        timestamp: new Date().toISOString()
    }

    const targetUrl = '/callback.html' + '#' + new URLSearchParams(callbackData).toString();

    setTimeout(() => res.redirect(targetUrl), 1000);
});

app.listen(port, async () => {
    debugLogger(`server is listening at http://localhost:${port}`);
}).on('error', err => {
    errorLogger('Failed to start webserver');

    if (err.code === 'EADDRINUSE') {
        errorLogger(`Other instance is probably running on port ${port}. If not, other process uses this port. Stop it and try again.`);
    } else {
        errorLogger(err);
    }

    debugLogger('exiting process...');
    process.exit();
})

function debugLogger(message) {
    console.log(chalk.green(`[${new Date().toISOString()}] ${message}`));
}

function errorLogger(message) {
    console.log(chalk.red(`[${new Date().toISOString()}] ${message}`));
}