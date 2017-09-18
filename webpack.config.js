const webpack = require('webpack'); //webpack itself
const path = require('path'); //nodejs dependancy when dealing with paths
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); //exctract css into a dedicated file
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // require webpack plugin



let config = { //config object

    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './public'), // ouput path
        filename: 'output.js' // output filename
    },
    module: {
        rules: [
            {
                test: /\.js$/, //files ending with .js
                exclude: /node_modules/, //exclude the node modules directory
                loader: 'babel-loader' //use this (babel-core) loader
            },
            {
                test: /\.scss$/, //files ending with .scss
                use: ExtractTextWebpackPlugin.extract({ //call our plugin with extract method
                    use: ['css-loader', 'sass-loader'], //use these loaders
                    fallback: 'style-loader' //fallback for any CSS not extracted
                }) //end extract
                
            },
            {
                test: /\.jsx$/, //all files anding with jsx
                loader: 'babel-loader', // use the babel-loader for all .jsx files
                exclude: /node_modules/ //exclude searching for the files in the node_modules folder

            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', {
                    loader: 'image-webpack-loader',
                    query: {
                        moxjpeg: {
                            progressive: true,
                        },
                        gifscale: {
                            interlaced: false,
                        },
                        optipng: {
                            optimizationLevel: 4,
                        },
                        pngquant: {
                            quality: '75-90',
                            speed: 3,
                        },
                    },
                }],
                exclude: /node_modules/,
                include: __dirname,
            }
        ] //end rules
    },
    plugins: [
        new ExtractTextWebpackPlugin('styles.css'), //call the ExtractTextWebpackPlugin constructor and name our css file 
        
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './public'), //a directory or URL to serve HTML content from.
        historyApiFallback: true, //fallback to /index.html for Signle Page Applications.
        inline: true, //inline mode (set to false to disable including client scripts {like livereload})
        open: true //open default browser while launching
    },
    devtool: 'eval-source-map', //enable devtool for better debuggin experience.
}    

module.exports = config;

if (process.env.NODE_ENV === 'production') { // if we're in production mode, here's what happens next
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin(), // call the uglify plugin
        new OptimizeCSSAssets() // call the css optimizer (minfication)
);
}