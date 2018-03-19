import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './index.scss'

const GiphyLightbox = ({ url, onClose, onPrev, onNext }) => (
	<div styleName="GiphyLightbox">
		<div styleName="frame">
			<div styleName="left" onClick={onPrev}></div>
			<div styleName="image" style={{
				backgroundImage: `url(${url})`
			}}></div>
			<div styleName="right" onClick={onNext}></div>
		</div>
		<div styleName="close" onClick={onClose}></div>
	</div>
)

export default CSSModules(GiphyLightbox, styles)