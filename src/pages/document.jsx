import Document, { Head, Main, NextScript, Html } from 'next/document';
import React from 'react';
import Header from '../component/UI/Header';

export default class CustomDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);

		return initialProps;
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel='shortcut icon' href='/' />
				</Head>
				<body>
					<div className='wrapper'>
						<Header />
						<Main />
					</div>
					<NextScript />
				</body>
			</Html>
		);
	}
}
