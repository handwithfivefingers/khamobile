import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.scss';
export default function ImageBlock({ src, alt, className, bordered, height }) {
	const imgClass = clsx([
		styles.img,
		className,
		{
			[styles.border]: bordered,
		},
	]);
	return (
		<div className={imgClass} style={{ '--height-offset': height ? height : '100%' }}>
			<img src={src} alt={alt} />
		</div>
	);
}
