// import { Container, Header, Content, Footer, Navbar, Nav, Sidebar, Sidenav, DOMHelper, Stack } from 'rsuite';

import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Header, Loader, Placeholder } from 'rsuite'
import { useCommonStore, useAuthorizationStore } from 'src/store'
import KMBreadcrumb from '../Content/Breadcrumb'
import KMSidebar from './KMSidebar'
import LoaderAdmin from './LoaderAdmin'
import styles from './styles.module.scss'

const AdminLayout = ({ children }) => {
  const title = useCommonStore((state) => state.title)
  const router = useRouter()
  const authenticate = useAuthorizationStore((state) => state.authenticate)
  const [firstRender, setFirstRender] = useState(false)

  useEffect(() => {
    if (!authenticate) {
      router.push('/login')
    }
    setTimeout(() => setFirstRender(false), 1000)
  }, [authenticate])

  if (firstRender || !authenticate) {
    return (
      <div>
        <Placeholder.Paragraph rows={8} />
        <Loader backdrop content="loading..." vertical />
      </div>
    )
  }

  return (
    <div className={clsx(styles.admin)}>
      <Container>
        <KMSidebar />
        <Container className={styles.container}>
          <div className="container-fluid ">
            <div className="row">
              <div className="col-12">
                <Header>
                  <h2>{title}</h2>
                </Header>
              </div>

              <div className="col-12">
                <KMBreadcrumb />
              </div>

              <div className={clsx('col-12  position-relative', styles.content)}>
                <LoaderAdmin />
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
