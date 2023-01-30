import React from 'react';
import { Panel, Row, Col, ButtonGroup, Button, } from 'rsuite';
import Copyright from 'component/UI/Copyright';
import AdminLayout from 'component/UI/AdminLayout';

const Admin = () => {
	return (
		<Panel header={<h3 className='title'>Dashboard</h3>}>
			<Row gutter={30} className='dashboard-header'></Row>

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
