// import { Container, Header, Content, Footer, Navbar, Nav, Sidebar, Sidenav, DOMHelper, Stack } from 'rsuite';

import { Container, Header } from 'rsuite';

import { useCommonStore } from 'src/store/commonStore';
import KMBreadcrumb from '../Content/Breadcrumb';
import KMSidebar from './KMSidebar';
import styles from './styles.module.scss';

const AdminLayout = ({ children }) => {
	const title = useCommonStore((state) => state.title);

	return (
		<div className={styles.admin}>
			<Container>
				<KMSidebar />

				<Container className={styles.container}>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-12'>
								<Header>
									<h2>{title}</h2>
								</Header>
							</div>

							<div className='col-12'>
								<KMBreadcrumb />
							</div>

							<div className='col-12'>{children}</div>
						</div>
					</div>
				</Container>
			</Container>
		</div>
	);
};

export default AdminLayout;
