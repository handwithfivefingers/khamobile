import DashboardIcon from '@rsuite/icons/Dashboard';
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import Link from 'next/link';
import { useState } from 'react';
import { Nav, Navbar, Sidebar, Sidenav } from 'rsuite';
const headerStyles = {
	padding: 18,
	fontSize: 16,
	height: 56,
	background: '#34c3ff',
	color: ' #fff',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
};

export default function KMSidebar() {
	const [expand, setExpand] = useState(true);

	return (
		<Sidebar style={{ display: 'flex', flexDirection: 'column' }} width={expand ? 260 : 56} collapsible appearance='inverse'>
			<Sidenav.Header>
				<Link href='/' passHref>
					<div style={headerStyles}>
						<span style={{ marginLeft: 12 }}> BRAND</span>
					</div>
				</Link>
			</Sidenav.Header>
			<Sidenav expanded={expand} defaultOpenKeys={['3']} appearance='subtle' className={'position-sticky top-0'}>
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

						<Nav.Menu eventKey='3' icon={<GearCircleIcon />} title='Post'>
							<Link href='/admin/posts' passHref>
								<Nav.Item eventKey='3-1' icon={<GearCircleIcon />}>
									Posts
								</Nav.Item>
							</Link>
							<Link href='/admin/posts/category' passHref>
								<Nav.Item eventKey='3-2' icon={<GearCircleIcon />}>
									Danh mục
								</Nav.Item>
							</Link>
						</Nav.Menu>

						<Nav.Menu eventKey='4' icon={<GearCircleIcon />} title='Products'>
							{/* Products */}
							<Link href='/admin/product' passHref>
								<Nav.Item eventKey='4-1' icon={<GearCircleIcon />}>
									Products
								</Nav.Item>
							</Link>
							<Link href='/admin/product/category' passHref>
								<Nav.Item eventKey='4-2' icon={<GearCircleIcon />}>
									Danh mục
								</Nav.Item>
							</Link>
							<Link href='/admin/product/variable' passHref>
								<Nav.Item eventKey='4-2' icon={<GearCircleIcon />}>
									Biến thể
								</Nav.Item>
							</Link>
							{/* <Nav.Item eventKey='4-1'>Geo</Nav.Item>
							<Nav.Item eventKey='4-2'>Devices</Nav.Item>
							<Nav.Item eventKey='4-3'>Loyalty</Nav.Item>
							<Nav.Item eventKey='4-4'>Visit Depth</Nav.Item> */}
						</Nav.Menu>

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
	);
}

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
