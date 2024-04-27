process.env.NODE_ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require("react-scripts/config/webpack.config")(process.env.NODE_ENV);

webpackConfig.target = 'node';

webpackConfig.entry = './src/index.server.ts';

webpackConfig.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
}

webpackConfig.externals = [nodeExternals]

webpackConfig.node = {
    __dirname: false,
    __filename: false
}

delete webpackConfig.cache;
delete webpackConfig.optimization;
delete webpackConfig.resolve.alias;
delete webpackConfig.resolve.plugins;
delete webpackConfig.plugins;

webpackConfig.module.rules[1].oneOf[0] = {
    test: /\.(css|scss|sass)$/,
    use: 'null-loader'
};

webpackConfig.module.rules[1].oneOf.splice(1, 1); // css
webpackConfig.module.rules[1].oneOf.splice(1, 1); // css
webpackConfig.module.rules[1].oneOf.pop(); // css
webpackConfig.module.rules[1].oneOf.pop(); // css
webpackConfig.module.rules[1].oneOf.pop(); // css
webpackConfig.module.rules[1].oneOf.pop(); // css
webpackConfig.module.rules[1].oneOf.pop(); // css

module.exports = webpackConfig;

// Función para mantener las dependencias de node_modules como externas
const externals = ['react', "express", "path"];
function nodeExternals(context, request, callback) {
    if (externals.includes(request) || request.startsWith("backend")) {
        return callback(null, 'commonjs ' + request);
    }
   // console.log({ context, request });
    callback();
}
