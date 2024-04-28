process.env.NODE_ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require("react-scripts/config/webpack.config")(process.env.NODE_ENV);

webpackConfig.target = 'node';

webpackConfig.entry = './src/index.server.tsx';

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

//console.log(webpackConfig.module.rules);

const rule = webpackConfig.module.rules.find(rule => rule.oneOf)
const [, , loader, loader2] = rule.oneOf;

//console.log(rule);

rule.oneOf = [
    {
        test: /\.(css|scss|sass)$/,
        use: 'null-loader'
    }, loader, loader2
];

webpackConfig.module.rules = [rule];

module.exports = webpackConfig;

// Función para mantener las dependencias de node_modules como externas
const externals = ["express", "path", "react"];
function nodeExternals(context, request, callback) {
    if (externals.includes(request) || request.startsWith("backend") || request.startsWith("react-dom")) {
        return callback(null, 'commonjs ' + request);
    }

    if (request === 'bootstrap') {
        // Retorna un módulo vacío
        return callback(null, 'var {}');
    }

    // console.log({ context, request });
    callback();
}
