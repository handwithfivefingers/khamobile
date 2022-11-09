import parse from 'html-react-parser';
import Head from 'next/head';
import React from 'react';
const PostHelmet = ({ seo }) => {
	return <Head>{parse(seo ? seo.join('') : '')}</Head>;
};

export default React.memo(PostHelmet);
