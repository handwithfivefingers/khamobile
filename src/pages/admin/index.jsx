import React from 'react';
import { Panel, Row, Col, ButtonGroup, Button } from 'rsuite';
import Copyright from 'component/UI/Copyright';
import AdminLayout from 'component/UI/AdminLayout';

const Admin = () => {
	return (
		<Panel header={<h3 className='title'>Dashboard</h3>}>
			<Row gutter={30} className='dashboard-header'>
				{/* <Col xs={8}>
					<Panel className='trend-box bg-gradient-red'>
						<img className='chart-img' src={images.PVIcon} />
						<div className='title'>Page Views </div>
						<div className='value'>281,358</div>
					</Panel>
				</Col>
				<Col xs={8}>
					<Panel className='trend-box bg-gradient-green'>
						<img className='chart-img' src={images.VVICon} />
						<div className='title'>Visits </div>
						<div className='value'>251,901</div>
					</Panel>
				</Col>
				<Col xs={8}>
					<Panel className='trend-box bg-gradient-blue'>
						<img className='chart-img' src={images.UVIcon} />
						<div className='title'>Unique Visitors</div>
						<div className='value'>25,135</div>
					</Panel>
				</Col> */}
			</Row>

			<Row gutter={30}>
				<Col xs={16}></Col>
				<Col xs={8}></Col>
			</Row>

			<Row gutter={30}>
				<Col xs={16}></Col>
				<Col xs={8}></Col>
			</Row>
			<Copyright />
		</Panel>
	);
};

// Admin.Layout = CommonLayout;
Admin.Admin = AdminLayout;
export default Admin;
