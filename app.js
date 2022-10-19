// server.js

const { parse } = require('url');

const next = require('next');

const dev = process.env.NODE_ENV !== 'production';

const hostname = 'localhost';

const port = 3000;
// when using middleware `hostname` and `port` must be provided below

const nextApp = next({ dev, hostname, port });

const handle = nextApp.getRequestHandler();

const express = require('express');

nextApp.prepare().then(() => {
	const app = express();

	app.get('/a', (req, res) => app.render(req, res, '/a', req.query));

	app.all('*', (req, res) => handle(req, res));

	app.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
