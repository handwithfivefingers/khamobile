import Head from 'next/head';
import CommonLayout from 'component/UI/Layout';
import { useEffect, useState } from 'react';

import Homebanner_1 from 'assets/img/dai-hoi-thu-cu-doi-moi5.webp';
import Homebanner_2 from 'assets/img/iphone-13-pro-max.webp';
import Homebanner_3 from 'assets/img/iphone-14-san-hang.webp';
import Homebanner_4 from 'assets/img/macbook-m2-gia-soc.jpg';

const Home = () => {
	const [images, setImages] = useState([
		{
			itemImageSrc: Homebanner_1.src,
			thumbnailImageSrc: 'IPHONE 14 SẴN HÀNG',
		},
		{
			itemImageSrc: Homebanner_2.src,
			thumbnailImageSrc: 'IPHONE 13 ProMax',
		},
		{
			itemImageSrc: Homebanner_3.src,
			thumbnailImageSrc: 'ĐẠI HỘI THU CŨ ĐỔI MỚI',
		},
		{
			itemImageSrc: Homebanner_4.src,
			thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
		},
		{
			itemImageSrc: Homebanner_4.src,
			thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
		},
		{
			itemImageSrc: Homebanner_4.src,
			thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
		},
	]);

	return (
		<>
			<Head>
				<title>Kha Mobile</title>
			</Head>
			<div className='row'>
				<div className='col-12 col-lg-8'>
					<div id='carouselExampleDark' className='carousel carousel-dark slide' data-bs-ride='carousel'>
						<div className='carousel-indicators'>
							<button
								type='button'
								data-bs-target='#carouselExampleDark'
								data-bs-slide-to='0'
								className='active'
								aria-current='true'
								aria-label='Slide 1'
							></button>
							<button type='button' data-bs-target='#carouselExampleDark' data-bs-slide-to='1' aria-label='Slide 2'></button>
							<button type='button' data-bs-target='#carouselExampleDark' data-bs-slide-to='2' aria-label='Slide 3'></button>
						</div>
						<div className='carousel-inner'>
							<div className='carousel-item active' data-bs-interval='10000'>
								<img src={images[0].itemImageSrc} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>First slide label</h5>
									<p>Some representative placeholder content for the first slide.</p>
								</div>
							</div>
							<div className='carousel-item' data-bs-interval='2000'>
								<img src={images[1].itemImageSrc} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Second slide label</h5>
									<p>Some representative placeholder content for the second slide.</p>
								</div>
							</div>
							<div className='carousel-item'>
								<img src={images[2].itemImageSrc} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Third slide label</h5>
									<p>Some representative placeholder content for the third slide.</p>
								</div>
							</div>
						</div>
						<button className='carousel-control-prev' type='button' data-bs-target='#carouselExampleDark' data-bs-slide='prev'>
							<span className='carousel-control-prev-icon' aria-hidden='true'></span>
							<span className='visually-hidden'>Previous</span>
						</button>
						<button className='carousel-control-next' type='button' data-bs-target='#carouselExampleDark' data-bs-slide='next'>
							<span className='carousel-control-next-icon' aria-hidden='true'></span>
							<span className='visually-hidden'>Next</span>
						</button>
					</div>
				</div>

				<div className='col-12 col-lg-4'>
					<div className='row'>
						<div className='col-12'> col - 4</div>
						<div className='col-12'> col - 4</div>
					</div>
				</div>
			</div>
		</>
	);
};



Home.Layout = CommonLayout;

export default Home;
