import Head from 'next/head';
import React from 'react';
import '../assets/css/style.scss';
import 'rsuite/dist/rsuite.min.css';

import CommonLayout from '../component/UI/Layout';

export default function MyApp({ Component, pageProps }) {
	const Layout = Component.Layout || CommonLayout;

	return (
		<>
			<Head>
				<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js' />
			</Head>

			{Component.Admin ? (
				<Component.Admin>
					<Component {...pageProps} />
				</Component.Admin>
			) : (
				<Layout>
					<Component {...pageProps} />
				</Layout>
			)}
		</>
	);
}
