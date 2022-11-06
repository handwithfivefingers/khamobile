import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import CogIcon from '@rsuite/icons/legacy/Cog';

import clsx from 'clsx';
import styles from './styles.module.scss';
import Link from 'next/link';
import ImageBlock from '../Content/ImageBlock';
import LOGO from 'assets/img/logo.png';
import Image from 'next/image';
const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
	return (
		<Navbar {...props} className={styles.nav}>
			<Navbar.Brand className={styles.brand} href='#' style={{ maxWidth: 200 }}>
				<Image src={LOGO} alt='Kha mobile' priority />
			</Navbar.Brand>
			<Nav onSelect={onSelect} activeKey={activeKey}>
				<Nav.Item eventKey='1' icon={<HomeIcon />}>
					Home
				</Nav.Item>
				<Nav.Item eventKey='2'>News</Nav.Item>
				<Nav.Item eventKey='3'>Products</Nav.Item>
				<Nav.Menu title='About'>
					<Nav.Item eventKey='4'>Company</Nav.Item>
					<Nav.Item eventKey='5'>Team</Nav.Item>
					<Nav.Item eventKey='6'>Contact</Nav.Item>
				</Nav.Menu>
			</Nav>
			<Nav pullRight>
				<Link href='/admin' passHref>
					<Nav.Item icon={<CogIcon />} eventKey='7'>
						Admin
					</Nav.Item>
				</Link>
			</Nav>
		</Navbar>
	);
};
export default CustomNavbar;

CustomNavbar.defaultProps = {};
