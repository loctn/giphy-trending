import React from 'react'
import T from 'prop-types'
import CSSModules from 'react-css-modules'

import styles from './index.scss'

const GiphyGif = ({ url }) => (
	<img styleName="GiphyGif" src={url} width="100%" />
)

GiphyGif.propTypes = {
	styles: T.object,
	url: T.string.isRequired,
}

export default CSSModules(GiphyGif, styles)