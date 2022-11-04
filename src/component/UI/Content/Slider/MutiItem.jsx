import React from 'react';
import styles from './styles.module.scss';
import Slider from 'react-slick';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import clsx from 'clsx';
const MutiItem = (props) => {
	const { children, ...rest } = props;
	const settings = {
		dots: true,
		arrows: true,
		infinite: true,
		speed: 500,
		slidesToShow: rest.slidesToShow || 5,
		slidesToScroll: 1,
		...rest.configs,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};

	const test = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	return (
		<Slider {...settings}>
			{children
				? children
				: test.map((item, index) => (
						<div className={styles.slideItem} key={[item, index]}>
							<h2>{item}</h2>
						</div>
				  ))}
		</Slider>
	);
};

const NextArrow = (props) => {
	const { className, style, onClick } = props;

	return (
		<div className={clsx([styles.arrow, styles.next])} style={{ ...style }} onClick={onClick}>
			<FaChevronRight />
		</div>
	);
};

const PrevArrow = (props) => {
	const { className, style, onClick } = props;

	return (
		<div className={clsx([styles.arrow, styles.prev])} style={{ ...style }} onClick={onClick}>
			<FaChevronLeft />
		</div>
	);
};

export default MutiItem;
