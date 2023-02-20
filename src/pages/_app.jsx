import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import { CustomProvider } from 'rsuite'
import { AuthenticateService } from 'service/authenticate'
import { GlobalCategoryService } from 'service/global'
import { useAuthorizationStore, useCommonStore, useCartStore } from 'src/store'
import CommonLayout from '../component/UI/Layout'
import 'rsuite/dist/rsuite.min.css'
import '../assets/css/style.scss'
import { LocalBusinessJsonLd } from 'next-seo'

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || CommonLayout

  const { addToCart } = useCartStore()

  const { changeAuthenticateStatus } = useAuthorizationStore((state) => state)
  const changeProductCategory = useCommonStore((state) => state.changeProductCategory)

  useEffect(() => {
    authenticateUser()
    getCartItem()
    loadCategory()
  }, [])

  const getCartItem = () => {
    let cartItemFromLocal = JSON.parse(localStorage.getItem('khaMobileCart'))
    if (cartItemFromLocal && cartItemFromLocal.length) {
      addToCart(cartItemFromLocal)
    }
  }

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
      changeAuthenticateStatus({
        authenticate: false,
        user: {},
        isAdmin: false,
      })
    }
  }

  const loadCategory = async () => {
    try {
      const resp = await GlobalCategoryService.getProdCate({ all: true })
      if (resp.status === 200) {
        changeProductCategory(resp.data.data)
      }
    } catch (error) {
      console.log('fetch category failed', error.message)
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

      <div id="fb-root"></div>
      <Script
        async
        defer
        crossorigin="anonymous"
        src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v16.0&appId=1263039330945343&autoLogAppEvents=1"
        nonce="E02nYVYz"
      />
    </>
  )
}
