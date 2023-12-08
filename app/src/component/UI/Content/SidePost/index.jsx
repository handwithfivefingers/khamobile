import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { Checkbox, RangeSlider } from 'rsuite';
import ImageBlock from '../ImageBlock';
import styles from './styles.module.scss';

const SidePost = () => {
	return (
		<div className={styles.row}>
			<div className={styles.featureImg}>
				<ImageBlock  alt="..." src='https://www.journal-theme.com/1/image/cache/catalog/journal3/categories/demo09-260x260.jpg.webp' />
			</div>

			<div className={styles.filterItem}>
				<h5>Trạng thái</h5>
				<>
					<Link href='/tin-tuc/category/1'>Category 1</Link>
					<Checkbox defaultChecked>Hết hàng</Checkbox>
				</>
			</div>

			<div className={styles.filterItem}>
				<h5>Hãng</h5>

				<>
					<Checkbox> Apple</Checkbox>
					<Checkbox defaultChecked> Samsung</Checkbox>
				</>
			</div>
			<div className={styles.filterItem}>
				<h5>Năm</h5>

				<>
					<Checkbox> 2022</Checkbox>
					<Checkbox defaultChecked> 2021</Checkbox>
				</>
			</div>
			<div className={styles.filterItem}>
				<h5>Giá tiền</h5>

				<>
					<Checkbox> Dưới 25 Triệu</Checkbox>
					<Checkbox> Dưới 20 Triệu</Checkbox>
					<Checkbox> Dưới 15 Triệu</Checkbox>
					<Checkbox> Dưới 10 Triệu</Checkbox>
					<Checkbox> Dưới 5 Triệu</Checkbox>
				</>
			</div>
		</div>
	);
};

export default SidePost;
