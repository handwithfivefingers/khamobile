import React from 'react';
import styles from './styles.module.scss';
import Slider from 'react-slick';

const MutiItem = ({ children }) => {
	const settings = {
		dots: true,
		arrows: true,
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
	};

	const test = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	return (
		<Slider {...settings} style={{ padding: 12 }}>
			{children
				? children
				: test.map((item) => (
						<div className={styles.slideItem}>
							<h2>{item}</h2>
						</div>
				  ))}
		</Slider>
	);
};

export default MutiItem;
