'use strict'

const path = require('path')
const express = require('express')

const app = express()

app.set('port', 8080)

const buildDir = path.resolve(process.env.NODE_PATH, './public')
app.use(express.static(buildDir))

app.listen(app.get('port'), () => {
	console.log(`Listening on ${app.get('port')}...`)
})
