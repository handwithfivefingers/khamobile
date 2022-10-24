// server.js

// const { parse } = require('url');
// const dotenv = require('dotenv');
// const next = require('next');
import dotenv from 'dotenv';
import { parse } from 'url';
import next from 'next';
import express from 'express';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';

const hostname = 'localhost';

const port = process.env.PORT;
// when using middleware `hostname` and `port` must be provided below

const nextApp = next({ dev, hostname, port });

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
	const app = express();

	app.get('/a', (req, res) => app.render(req, res, '/a', req.query));

	app.all('*', (req, res) => handle(req, res));

	app.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
