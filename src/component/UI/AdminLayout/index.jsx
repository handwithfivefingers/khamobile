import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import PageFooter from '../Footer';
// import { Container, Header, Content, Footer, Navbar, Nav, Sidebar, Sidenav, DOMHelper, Stack } from 'rsuite';

import clsx from 'clsx';
import Link from 'next/link';
import { Container, Header, Sidebar, Sidenav, Content, Navbar, Nav } from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import DashboardIcon from '@rsuite/icons/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';

import CustomSidenav from './CustomSidenav';
import styles from './styles.module.scss';

const headerStyles = {
	padding: 18,
	fontSize: 16,
	height: 56,
	background: '#34c3ff',
	color: ' #fff',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
};

const NavToggle = ({ expand, onChange }) => {
	return (
		<Navbar appearance='subtle' className='nav-toggle'>
			<Nav pullRight>
				<Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
					{expand ? <AngleLeftIcon /> : <AngleRightIcon />}
				</Nav.Item>
			</Nav>
		</Navbar>
	);
};

const AdminLayout = ({ children }) => {
	const [expand, setExpand] = React.useState(true);
	return (
		<div className={styles.admin}>
			<Container>
				<Sidebar style={{ display: 'flex', flexDirection: 'column' }} width={expand ? 260 : 56} collapsible>
					<Sidenav.Header>
						<div style={headerStyles}>
							<span style={{ marginLeft: 12 }}> BRAND</span>
						</div>
					</Sidenav.Header>
					<Sidenav expanded={expand} defaultOpenKeys={['3']} appearance='subtle'>
						<Sidenav.Body>
							<Nav>
								<Link href={'/admin'} passHref>
									<Nav.Item eventKey='1' active icon={<DashboardIcon />}>
										Dashboard
									</Nav.Item>
								</Link>

								<Link href='/admin/pages' passHref>
									<Nav.Item eventKey='2' icon={<GroupIcon />}>
										Pages
									</Nav.Item>
								</Link>

								<Link href='/admin/posts' passHref>
									<Nav.Item eventKey='3' icon={<MagicIcon />}>
										Posts
									</Nav.Item>
								</Link>

								<Link href='/admin/products' passHref>
									<Nav.Item eventKey='4' icon={<GearCircleIcon />}>
										Products
									</Nav.Item>
								</Link>

								<Link href='/admin/users' passHref>
									<Nav.Item eventKey='4' icon={<GroupIcon />}>
										Users
									</Nav.Item>
								</Link>

								<Link href='/admin/order' passHref>
									<Nav.Item eventKey='4' icon={<GroupIcon />}>
										Order
									</Nav.Item>
								</Link>

								<Link href='/admin/email' passHref>
									<Nav.Item eventKey='4' icon={<GroupIcon />}>
										Email
									</Nav.Item>
								</Link>

								<Link href='/admin/setting' passHref>
									<Nav.Item eventKey='4' icon={<GroupIcon />}>
										Setting
									</Nav.Item>
								</Link>
							</Nav>
						</Sidenav.Body>
					</Sidenav>
					<NavToggle expand={expand} onChange={() => setExpand(!expand)} />
				</Sidebar>

				<Container>{children}</Container>
			</Container>
		</div>
	);
};

export default AdminLayout;
