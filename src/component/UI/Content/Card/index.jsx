import React from 'react';
import demoImg from 'assets/img/demo-phone.png';
import styles from './styles.module.scss';
import clsx from 'clsx';

export default function Card({ imgSrc, shadow = true, border = true, hover, cover }) {
	const classCard = clsx([
		'card',
		styles.card,
		{
			[styles.shadow]: shadow,
			[styles.border]: border,
			[styles.hover]: hover,
			[styles.cover]: cover,
		},
	]);
	return (
		<div className={classCard}>
			<div className={clsx('card-img-top', styles.cardImg)}>
				<img src={imgSrc || demoImg.src} className={styles.img} alt='...' />
			</div>
			<div className='card-body'>
				<h5 className='card-title'>iPhone 14 256GB - Chính hãng VN/A</h5>
				<p className='card-text'>
					<b className='price'>6,490,000 VNĐ</b>
				</p>
				<p className='card-text'>
					<s>8,990,000 VNĐ</s>
				</p>
				<p className={styles.priceTragop}>
					<span>Hoặc trả trước</span>700,000 đ
				</p>
			</div>
		</div>
	);
}
