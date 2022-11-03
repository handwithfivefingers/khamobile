import CommonLayout from 'component/UI/Layout';
import Head from 'next/head';
import { useState } from 'react';

import Homebanner_1 from 'assets/img/dai-hoi-thu-cu-doi-moi5.webp';
import Homebanner_2 from 'assets/img/iphone-13-pro-max.webp';
import Homebanner_3 from 'assets/img/iphone-14-san-hang.webp';
import Homebanner_4 from 'assets/img/macbook-m2-gia-soc.jpg';
import Card from 'component/UI/Content/Card';
import Heading from 'component/UI/Content/Heading';

import CustomSlider from 'component/UI/Content/Slider';
import { Panel } from 'rsuite';
import Catalog from 'component/UI/Content/Catalog';

const Home = () => {
	return (
		<>
			<Head>
				<title>Kha Mobile</title>
			</Head>

			<section className='container-fluid' style={{ background: '#fff' }}>
				<div className='row gx-2 gy-2'>
					<div className='col-8'>
						<SelfCarousel />
					</div>

					<div className='col-4'>
						<div className='row gy-2'>
							<div className='col-12'>
								<img src={Homebanner_2.src} className='d-block w-100' alt='...' />
							</div>
							<div className='col-12'>
								<img src={Homebanner_2.src} className='d-block w-100' alt='...' />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='container-fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='container'>
							<div className='row'>
								<div className='col-12'>
									<Heading type='h3' center>
										IPHONE 14 SERIES - SẴN HÀNG GIAO NGAY!
									</Heading>
								</div>

								<div className='col-12'>
									<div className='row gx-5 gy-5'>
										<CustomSlider type='muti'>
											<Card />
											<Card />
											<Card />
											<Card />
											<Card />
											<Card />
											<Card />
										</CustomSlider>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='container'>
				<div className='row'>
					<div className='col-12'>
						<Heading type='h3' center>
							Khách hàng của Kha Mobile
						</Heading>
					</div>

					<div className='col-12'>
						<CustomSlider type='muti' />
					</div>
				</div>
			</section>

			<section className='container'>
				<div className='row'>
					<div className='col-12'>
						<Heading>THÁNG TRI ÂN (Áp dụng từ ngày 01-20/11)</Heading>
					</div>

					<div className='col-12'>
						<div className='row gx-2 gy-2'>
							<div className='col-3'>
								<Card />
							</div>
							<div className='col-3'>
								<Card />
							</div>
							<div className='col-3'>
								<Card />
							</div>
							<div className='col-3'>
								<Card />
							</div>
							<div className='col-3'>
								<Card />
							</div>
							<div className='col-3'>
								<Card />
							</div>
							<div className='col-3'>
								<Card />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='container-fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='row gx-2 gy-2'>
							<div className='col-4'>
								<Panel bordered>Baner 1</Panel>
							</div>
							<div className='col-4'>
								<Panel bordered>Baner 2</Panel>
							</div>
							<div className='col-4'>
								<Panel bordered>Baner 3</Panel>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='container'>
				<div className='row'>
					<div className='col-12'>
						<Heading type='h3' center>
							Danh mục mới nhatasF
						</Heading>
					</div>

					<div className='col-12'>
						<Catalog />
					</div>
				</div>
			</section>
			{/* Dynamic category block */}
		</>
	);
};

Home.Layout = CommonLayout;

const SelfCarousel = () => {
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
		<div id='carouselExampleDark' className='carousel carousel-dark slide' data-bs-ride='carousel'>
			<div className='carousel-indicators'>
				<button type='button' data-bs-target='#carouselExampleDark' data-bs-slide-to='0' className='active' aria-current='true' aria-label='Slide 1'></button>
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
	);
};

export default Home;
