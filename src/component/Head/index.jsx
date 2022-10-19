import React from 'react';
import Head from 'next/head';

const Helmet = ({ ...props }) => {
	return (
		<Head>
			<meta name='description' content={props.meta ? props.meta[2].metadata.description : ''} />
			<meta name='keyword' content={props.meta ? props.meta[2].metadata.keyword : ''} />
			<meta property='image' content={props.meta ? props.meta[2].metadata.image : ''} />
			<meta property='title' content={props.meta ? props.meta[2].metadata.title : ''} />

			<meta property='og:title' content={props.meta ? props.meta[2].metadata.title : ''} />
			<meta property='og:description' content={props.meta ? props.meta[2].metadata.keyword : ''} />
			<meta property='og:image' content={props.meta ? props.meta[2].metadata.image : ''} />
			<meta property='og:keyword' content={props.meta ? props.meta[2].metadata.keyword : ''} />

			<meta name='twitter:title' content={props.meta ? props.meta[2].metadata.title : ''} />
			<meta name='twitter:description' content={props.meta ? props.meta[2].metadata.keyword : ''} />
			<meta name='twitter:image' content={props.meta ? props.meta[2].metadata.image : ''} />
			<meta name='twitter:keyword' content={props.meta ? props.meta[2].metadata.keyword : ''} />
			<title>{props.meta ? props.meta[2].metadata.title : 'HEYOTRIP'}</title>
		</Head>
	);
};

export const getServerSideProps = async () => {
	// try {
	// 	const httpsAgent = new https.Agent({
	// 		rejectUnauthorized: false,
	// 	});
	// 	const config = {
	// 		method: 'GET',
	// 		headers: {
	// 			Accept: 'application/json',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		agent: httpsAgent,
	// 	};
	// 	const res = await fetch(`${process.env.BACKEND_URL}/v2.0/api/cms/init`, config);
	// 	const data = await res.json();
	// 	return {
	// 		props: {
	// 			meta: data.data,
	// 		},
	// 	};
	// } catch (e) {
	// 	console.error(e);
	// }
	// return {
	// 	props: {},
	// };
};

export default React.memo(Helmet);
