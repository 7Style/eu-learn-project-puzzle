const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3000,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/app.html', to: 'index.html' },
                { from: 'src/styles.css', to: 'styles.css' },
                { from: 'src/static', to: 'static' }
            ],
        }),
    ],
    devtool: 'inline-source-map',
};
