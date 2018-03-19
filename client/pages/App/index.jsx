import React, { Component } from 'react'
import T from 'prop-types'
import CSSModules from 'react-css-modules'
import axios from 'axios'

import GiphyGif from '~/components/GiphyGif'
import GiphyLightbox from '~/components/GiphyLightbox'

import styles from './index.scss'

const GIF_SPACING = 16
const SCROLL_BOTTOM_MIN = 600
const IMAGE_COUNT_INITIAL = 50
const IMAGE_COUNT_UPDATE = 25

class App extends Component {
	static propTypes = {
		styles: T.object,
	}

	state = {
		images: [[], [], [], []],
		showLightbox: false,
		lightboxRow: 0,
		lightboxCol: 0,
	}

	fetchGifs = async () => {
		if (this.isFetching) return
		this.isFetching = true

		try {
			const { images } = this.state
			const offset = images.reduce((sum, column) => sum + column.length, 0)
			const limit = images.some(column => !!column.length)
				? IMAGE_COUNT_UPDATE
				: IMAGE_COUNT_INITIAL
			
			const res = await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&offset=${offset}&limit=${limit}`)

			const width = parseInt(
				getComputedStyle(this.$columns[0]).width.replace('px', '')
			)
			const heights = this.$columns.map($column =>
				parseInt(getComputedStyle($column).height.replace('px', ''))
			)
			const newImages = [[], [], [], []]

			// Fill shortest columns first
			res.data.data.forEach(item => {
				const image = item.images.fixed_height_still
				const minHeight = Math.min(...heights)
				const newIndex = heights.findIndex(h => h === minHeight)
				image.urlLarge = item.images.original.url
				newImages[newIndex].push(image)
				heights[newIndex] += width * (image.height / image.width) + GIF_SPACING
			})
			
			this.setState({
				images: images.map((column, i) => [...column, ...newImages[i]]),
			}, () => {
				this.isFetching = false
			})
		} catch (e) {
			console.log(e)
			this.isFetching = false
		}
	}

	handleWindowScroll = () => {
		const b = document.body
		const d = document.documentElement
		const scrollHeight = Math.max(b.scrollHeight, b.offsetHeight, d.clientHeight, d.scrollHeight, d.offsetHeight)
		this.scrollY = window.pageYOffset || d.scrollTop || b.scrollTop || 0

		if (!this.isTicking) {
			window.requestAnimationFrame(() => {
				if (this.scrollY > scrollHeight - window.innerHeight - SCROLL_BOTTOM_MIN) {
					this.fetchGifs()
				}
				this.isTicking = false
			})
		}

		this.isTicking = true
	}

	handleThumbnailClick = (r, c) => {
		this.setState({ lightboxRow: r, lightboxCol: c, showLightbox: true })
	}

	// A rough guess of horizontal next/prev gifs
	handleLightboxNav = (direction) => {
		const { images, lightboxRow, lightboxCol } = this.state
		const newLightboxCol = direction === 1
			? (lightboxCol + 1) % images.length
			: lightboxCol ? lightboxCol - 1 : images.length - 1
		let newLightboxRow = lightboxRow

		if (
			direction === -1 && lightboxCol === 0 ||
			direction === 1 && lightboxCol === images.length - 1
		) {
			newLightboxRow = Math.max(0, Math.min(
				images[newLightboxCol].length - 1,
				lightboxRow + direction,
			))
		}

		this.setState({ lightboxCol: newLightboxCol, lightboxRow: newLightboxRow })
	}

	handleLightboxClose = () => {
		this.setState({ showLightbox: false })
	}

	handleLightboxPrev = () => {
		this.handleLightboxNav(-1)
	}

	handleLightboxNext = () => {
		this.handleLightboxNav(1)
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleWindowScroll)
		this.fetchGifs()
	}

	render() {
		const { styles } = this.props
		const { images, showLightbox, lightboxCol, lightboxRow } = this.state

		let lightboxUrl;
		if (images[lightboxCol] && images[lightboxCol][lightboxRow]) {
			lightboxUrl = images[lightboxCol][lightboxRow].urlLarge
		}
		
		this.$columns = this.$columns || []

		return (
			<div styleName="App">
				{showLightbox &&
					<GiphyLightbox
						url={lightboxUrl}
						onClose={this.handleLightboxClose}
						onPrev={this.handleLightboxPrev}
						onNext={this.handleLightboxNext}
					/>
				}
				<div styleName="content">
					{images.map((column, columnIndex) =>
						<div key={columnIndex} className={styles['gif-column']} ref={ref => this.$columns[columnIndex] = ref}>
							{this.state.images[columnIndex].map((item, cellIndex) =>
								<div key={cellIndex} className={styles['gif-cell']}>
									<GiphyGif url={item.url} onClick={
										this.handleThumbnailClick.bind(this, cellIndex, columnIndex)
									} />
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		)
	}
}

export default CSSModules(App, styles)
