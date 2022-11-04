import React from 'react';
import LOGO from 'assets/img/logo.png';
import ImageBlock from '../Content/ImageBlock';
import { Panel } from 'rsuite';
export default function Footer() {
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12'>
					<div className='container'>
						<div className='row'>
							<div className='col-6'>
								<Panel>
									<ImageBlock src={LOGO.src} />
								</Panel>
							</div>
							<div className='col-6'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
