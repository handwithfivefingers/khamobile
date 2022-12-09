// import { Container, Header, Content, Footer, Navbar, Nav, Sidebar, Sidenav, DOMHelper, Stack } from 'rsuite';

import clsx from 'clsx'
import { Container, Header } from 'rsuite'
import { useCommonStore } from 'src/store/commonStore'
import { useLoaderStore } from 'src/store/loaderStore'
import KMBreadcrumb from '../Content/Breadcrumb'
import KMSidebar from './KMSidebar'
import LoaderAdmin from './LoaderAdmin'
import styles from './styles.module.scss'

const AdminLayout = ({ children }) => {
  const title = useCommonStore((state) => state.title)
  const loading = useLoaderStore((state) => state.loading)

  return (
    <div className={styles.admin}>
      <Container>
        <KMSidebar />

        <Container className={styles.container}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Header>
                  <h2>{title}</h2>
                </Header>
              </div>

              <div className="col-12">
                <KMBreadcrumb />
              </div>

              <div className={clsx('col-12 position-relative', styles.content)}>
                <LoaderAdmin loading={loading} />
                {children}
              </div>
            </div>
          </div>
        </Container>
      </Container>
    </div>
  )
}

export default AdminLayout
