import React from 'react';
import LOGO from 'assets/img/logo.png';
import ImageBlock from '../../Content/ImageBlock';
import { Panel } from 'rsuite';
import Image from 'next/image';
export default function Footer() {
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12'>
					<div className='container'>
						<div className='row'>
							<div className='col-12 col-lg-3 col-md-6 col-sm-12'>
								<Panel>
									{/* <ImageBlock src={LOGO.src} /> */}
									<Image src={LOGO} alt='Kha mobile' priority />
								</Panel>
							</div>
							<div className='col-lg-9  col-md-6 col-sm-12'>hh</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
