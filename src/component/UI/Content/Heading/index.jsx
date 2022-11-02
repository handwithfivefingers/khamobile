import React from 'react';
import styles from './styles.module.scss';

export default function Heading(props) {
	return <div className={styles.heading}>{props.children}</div>;
}
