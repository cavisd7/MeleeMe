const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../config/webpack.dev')
const DEV_PORT = 3000;

new WebpackDevServer(
    webpack(config), 
    {
        hot: true
    }
).listen(DEV_PORT, '0.0.0.0', (err) => {
    if (err) return console.log(`[WebpackDevServer Error] ${err}`);

    console.log(`Development server started on port ${DEV_PORT}`);
});