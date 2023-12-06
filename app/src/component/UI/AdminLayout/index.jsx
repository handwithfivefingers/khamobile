// import { Container, Header, Content, Footer, Navbar, Nav, Sidebar, Sidenav, DOMHelper, Stack } from 'rsuite';

import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Container, Header, Loader, Placeholder } from 'rsuite'
import { useCommonStore, useAuthorizationStore } from 'src/store'
import KMBreadcrumb from '../Content/Breadcrumb'
import KMSidebar from './KMSidebar'
import LoaderAdmin from './LoaderAdmin'
import styles from './styles.module.scss'
import { NextSeo } from 'next-seo'
const AdminLayout = ({ children, ...props }) => {
  const title = useCommonStore((state) => state.title)

  const router = useRouter()
  const authenticate = useAuthorizationStore((state) => state.authenticate)
  const isAuthenticating = useAuthorizationStore((state) => state.isAuthenticating)

  useEffect(() => {
    if (!authenticate && isAuthenticating) {
      router.push('/login')
    }
  }, [authenticate, isAuthenticating])

  return (
    <>
      <NextSeo title="Kha Mobile - Admin" />
      <div className={clsx(styles.admin, `${props?.classAnimation}`)}>
        <Container
          className={!authenticate && isAuthenticating ? 'animate__animated animate__faster animate__fadeOut' : ''}
        >
          {!authenticate && !isAuthenticating ? (
            <Loader backdrop content="loading..." vertical />
          ) : (
            <>
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
            </>
          )}
        </Container>
      </div>
    </>
  )
}

export default AdminLayout
