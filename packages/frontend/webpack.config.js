process.env.NODE_ENV = 'production';

const path = require('path');
const webpackConfig = require("react-scripts/config/webpack.config")(process.env.NODE_ENV);

webpackConfig.target = 'node';

webpackConfig.entry = './src/index.ssr.tsx';

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

const rule = webpackConfig.module.rules.find(rule => rule.oneOf)
const [, , loader, loader2] = rule.oneOf;

rule.oneOf = [loader, loader2];
webpackConfig.module.rules = [rule];

module.exports = webpackConfig;

// Función para mantener las dependencias de node_modules como externas
const externals = ["express", "path", "react", "os"];
function nodeExternals(context, request, callback) {
    if (externals.includes(request) || request.startsWith("backend") || request.startsWith("react-dom")) {
        return callback(null, 'commonjs ' + request);
    }

    if (request.startsWith('bootstrap')) {
        // Retorna un módulo vacío
        return callback(null, 'var {}');
    }

    if (/\.(css|scss|sass)$/.test(request)) {
        return callback(null, 'var {}');
    }

    // console.log({ context, request });
    callback();
}
