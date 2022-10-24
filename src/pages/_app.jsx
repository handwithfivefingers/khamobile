import Head from 'next/head';

import React from 'react';

import CommonLayout from '../component/UI/Layout';

import '../asset/css/style.scss';

export default function MyApp({ Component, pageProps }) {
	const Layout = Component.Layout || CommonLayout;

	return (
		<>
			<Head>
				<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js' />
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	);
}
