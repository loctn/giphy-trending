import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './index.scss'

const GiphyGif = ({ url }) => (
	<img styleName="GiphyGif" src={url} width="100%" />
)

export default CSSModules(GiphyGif, styles)