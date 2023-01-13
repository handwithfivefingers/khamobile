import GearIcon from '@rsuite/icons/Gear'
import JsonViewer from 'component/UI/JsonViewer'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Button, CustomProvider, Drawer, IconButton } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import { useDevStore } from 'src/store/devStore'
import '../assets/css/style.scss'
import CommonLayout from '../component/UI/Layout'
import AuthenticateService from 'service/authenticate/Authenticate.service'
import { useAuthorizationStore } from 'src/store/authenticateStore'

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || CommonLayout

  const data = useDevStore((state) => state.data)
  const { authenticate, changeAuthenticateStatus } = useAuthorizationStore((state) => state)
  const [drawer, setDrawer] = useState({
    open: false,
  })

  useEffect(() => {
    authenticateUser()
  }, [])

  const authenticateUser = async () => {
    try {
      const resp = await AuthenticateService.isAuthenticate()
      if (resp.status === 200) {
        changeAuthenticateStatus({
          authenticate: resp.data.authenticate,
          user: resp.data.data,
          isAdmin: resp.data.data.role === 'admin',
        })
      }
    } catch (error) {
      console.log('authenticate failed', error)
      changeAuthenticateStatus({
        authenticate: false,
        user: {},
        isAdmin: false,
      })
    }
  }

  return (
    <>
      <Head>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" />
      </Head>
      <CustomProvider>
        {Component.Admin ? (
          <Component.Admin>
            <Component {...pageProps} />
          </Component.Admin>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </CustomProvider>
    </>
  )
}
