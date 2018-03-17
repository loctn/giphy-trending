'use strict'

module.exports = {
	plugins: {
		'postcss-import': {
			path: 'client/',
		},
		'postcss-cssnext': {
			browsers: ['last 2 versions', '> 5%'],
		},
	},
}
