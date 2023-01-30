import React from 'react';
import CardBlock from '../Content/CardBlock';

export default function JsonViewer({ data, className }) {
	return (
		<CardBlock className={className}>
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</CardBlock>
	);
}
