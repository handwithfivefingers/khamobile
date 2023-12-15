// import { Container, Header, Content, Footer, Navbar, Nav, Sidebar, Sidenav, DOMHelper, Stack } from 'rsuite';

import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
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
  const [grid, setGrid] = useState(false)
  
  useEffect(() => {
    if (!authenticate && isAuthenticating) {
      router.push('/login')
    }
  }, [authenticate, isAuthenticating])



  const handleExpand = (isExpand) => {
    setGrid(isExpand)
  }
  // if (!authenticate && !isAuthenticating) return <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
  return (
    <>
      <NextSeo title="Kha Mobile - Admin" />
      <GetLayout
        grid={grid}
        authenticate={authenticate}
        isAuthenticating={isAuthenticating}
        classAnimation={props.classAnimation}
        children
      >
        <div className={`w-[${grid ? '260px' : '60px'}] border-r`}>
          <KMSidebar onExpand={handleExpand} />
        </div>
        <div className={`w-[calc(100%-${grid ? '260px' : '60px'})] overflow-y-auto h-[100vh] overflow-hidden px-4 flex-1`}>
          <h2>{title}</h2>
          <KMBreadcrumb />
          <div className={clsx('relative', styles.content)}>
            <LoaderAdmin />
            {children}
          </div>
        </div>
      </GetLayout>
    </>
  )
}
// ${grid ? 60 : 260}px_1fr
const GetLayout = ({ grid, authenticate, isAuthenticating, classAnimation, children }) => {
  return useMemo(() => {
    return (
      <div
        className={clsx(`${classAnimation}`, 'h-[100vh] overflow-hidden w-[100vw] flex flex-1', {
          'animate__animated animate__faster animate__fadeOut': !authenticate && isAuthenticating,
        })}
      >
        {children}
      </div>
    )
  }, [grid, authenticate, isAuthenticating, classAnimation, children])
}

export default AdminLayout
