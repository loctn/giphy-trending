'use strict'

const webpack = require('webpack')
const path = require('path')
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	entry: {
		app: path.resolve(__dirname, './client'),
	},

	output: {
		path: path.resolve(__dirname, './server/public'),
		filename: '[name].[hash:8].js',
	},

	plugins: [
		new CleanObsoleteChunks(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
				GIPHY_API_KEY: JSON.stringify('8604a01e4a634ffd8287094bb997eb09'),
			},
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				context: __dirname,
			},
		}),
		new HtmlWebpackPlugin({
			title: 'Giphy Trending',
			template: './client/theme/index.ejs',
		}),
		new ExtractTextPlugin({
			filename: '[name].[hash:8].css',
			disable: false,
			allChunks: true,
		}),
		isProd
			? new webpack.LoaderOptionsPlugin({
					minimize: true,
				})
			: null,
		isProd ? new webpack.optimize.UglifyJsPlugin() : null,
	].filter(p => !!p),

	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							query: {
								modules: true,
								localIdentName: '[name]__[local]___[hash:base64:5]',
							},
						},
						'postcss-loader',
						'resolve-url-loader',
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
								includePaths: [path.resolve(__dirname, './client')],
							},
						},
					],
				}),
			},
			{
				test: /\.(png|jpg|svg)$/,
				exclude: /node_modules/,
				loader: 'url-loader?limit=10240&publicPath=assets/',
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},

	resolve: {
		alias: {
			'~': path.resolve(__dirname, './client'),
		},
		extensions: ['.js', '.jsx'],
	},
}
