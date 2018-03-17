import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import axios from 'axios'

import GiphyGif from '~/components/GiphyGif'

import styles from './index.scss'

const GIF_SPACING = 16
const SCROLL_BOTTOM_MIN = 600
const IMAGE_COUNT_INITIAL = 50
const IMAGE_COUNT_UPDATE = 25

class App extends Component {
	state = {
		images: [[], [], [], []],
		heights: [0, 0, 0, 0],
	}

	fetchGifs = async () => {
		try {
			const limit = this.state.images.some(column => column.length)
				? IMAGE_COUNT_UPDATE
				: IMAGE_COUNT_INITIAL
			const res = await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&offset=${this.offset || 0}&limit=${limit}`)

			const width = parseInt(getComputedStyle(this.column).width.replace('px', ''))
			const heights = this.state.heights.slice(0)
			const newImages = [[], [], [], []]

			res.data.data.forEach(item => {
				const image = item.images.fixed_height_still
				const minHeight = Math.min(...heights)
				const newIndex = heights.findIndex(h => h === minHeight)
				newImages[newIndex].push(image)
				heights[newIndex] += width * (image.height / image.width) + GIF_SPACING
			})
			
			this.setState({
				images: this.state.images.map((column, i) => [...column, ...newImages[i]]),
				heights,
			})

			this.offset = (this.offset || 0) + limit
		} catch (e) {
			console.log(e)
		}
	}

	handleWindowScroll = () => {
		this.scrollY = window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0
		
		const scrollHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight, 
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight,
		)

		if (!this.isTicking) {
			requestAnimationFrame(async () => {
				if (!this.pauseInfiniteScroll && this.scrollY > scrollHeight - window.innerHeight - SCROLL_BOTTOM_MIN) {
					this.pauseInfiniteScroll = true
					await this.fetchGifs()
					this.pauseInfiniteScroll = false
				}
				this.isTicking = false;
			});
		}
		this.isTicking = true;
	}

	componentDidMount = () => {
		window.addEventListener('scroll', this.handleWindowScroll)
		this.fetchGifs()
	}

	render() {
		const { styles } = this.props

		return (
			<div styleName="App">
				<div styleName="content">
					<div styleName="gif-column" ref={ref => this.column = ref}>
						{this.state.images[0].map((item, i) =>
							<div key={i} className={styles['gif-cell']}>
								<GiphyGif url={item.url} />
							</div>
						)}
					</div>
					<div styleName="gif-column">
						{this.state.images[1].map((item, i) =>
							<div key={i} className={styles['gif-cell']}>
								<GiphyGif url={item.url} />
							</div>
						)}
					</div>
					<div styleName="gif-column">
						{this.state.images[2].map((item, i) =>
							<div key={i} className={styles['gif-cell']}>
								<GiphyGif url={item.url} />
							</div>
						)}
					</div>
					<div styleName="gif-column">
						{this.state.images[3].map((item, i) =>
							<div key={i} className={styles['gif-cell']}>
								<GiphyGif url={item.url} />
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}

export default CSSModules(App, styles)
