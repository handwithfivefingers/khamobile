import clsx from 'clsx';
import Head from 'component/Head';
import Card from 'component/UI/Content/Card';
import CardBlock from 'component/UI/Content/CardBlock';
import Divider from 'component/UI/Content/Divider';
import Heading from 'component/UI/Content/Heading';
import SideFilter from 'component/UI/Content/SideFilter';
import CommonLayout from 'component/UI/Layout';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { Carousel, Dropdown, Pagination, SelectPicker } from 'rsuite';
import styles from './styles.module.scss';

const pricingFilter = [
	{
		label: 'Từ thấp đến cao',
		value: 'Từ thấp đến cao',
	},
	{
		label: 'Từ cao đến đến',
		value: 'Từ cao đến đến',
	},
	{
		label: 'Mới nhất',
		value: 'Mới nhất',
	},
	{
		label: 'Hot nhất',
		value: 'Hot nhất',
	},
];

export default function ProductDetail() {
	return (
		<div className='container'>
			<div className='row gy-4' style={{ paddingTop: '1.5rem' }}>
				{/* <div className='col-12'>
					<Heading type='h3' left divideClass={styles.divideLeft}>
						Sản phẩm
					</Heading>
				</div> */}

				<div className={clsx([styles.vr, 'col-lg-12 col-md-12'])}>
					<CardBlock>
						<div className='row gy-4'>
							<Heading type='h1' left divideClass={styles.divideLeft}>
								Product
							</Heading>

							<div className='col-4'>
								<Carousel placement={'left'} shape={'bar'} className='custom-slider'>
									<div style={{ position: 'relative' }}>
										<Image src='https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1' layout='fill' objectFit='cover' />
									</div>
									<div style={{ position: 'relative' }}>
										<Image src='https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=2' layout='fill' objectFit='cover' />
									</div>
									<div style={{ position: 'relative' }}>
										<Image src='https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=3' layout='fill' objectFit='cover' />
									</div>
									<div style={{ position: 'relative' }}>
										<Image src='https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=4' layout='fill' objectFit='cover' />
									</div>
									<div style={{ position: 'relative' }}>
										<Image src='https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=5' layout='fill' objectFit='cover' />
									</div>
								</Carousel>
							</div>
						</div>
					</CardBlock>
				</div>

				<div className='col-lg-10 col-md-12'></div>
				<div className='col-lg-2 col-md-12'>
					<SideFilter />
				</div>
			</div>
		</div>
	);
}

ProductDetail.Layout = CommonLayout;
