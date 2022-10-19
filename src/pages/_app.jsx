import Head from 'next/head';

import React from 'react';

import CommonLayout from '../component/UI/Layout';
import 'primereact/resources/primereact.min.css'; //core css
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';

export default function MyApp({ Component, pageProps }) {
	const Layout = Component.Layout || CommonLayout;

	return (
		<>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	);
}
