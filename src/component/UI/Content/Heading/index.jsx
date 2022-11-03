import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.scss';

export default function Heading(props) {
	const classProps = clsx([
		styles.header,
		{
			[styles.center]: props?.center,
		},
	]);
	const getHeading = () => {
		switch (props.type) {
			case 'h1':
				return <h1 className={classProps}>{props.children}</h1>;
			case 'h2':
				return <h2 className={classProps}>{props.children}</h2>;
			case 'h3':
				return <h3 className={classProps}>{props.children}</h3>;
			case 'h4':
				return <h4 className={classProps}>{props.children}</h4>;
			case 'h5':
				return <h5 className={classProps}>{props.children}</h5>;
		}
	};

	return (
		<div className={styles.heading}>
			{getHeading()}
			<div className={'title__divider'} />
		</div>
	);
}
