import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useMemo, useState } from 'react'
import { CustomProvider, Loader } from 'rsuite'
import { AuthenticateService } from 'service/authenticate'
import { GlobalCategoryService, GlobalProductService } from 'service/global'
import { useAuthorizationStore, useCommonStore, useCartStore } from 'src/store'
import CommonLayout from '../component/UI/Layout'
import Analytics from 'analytics'
import googleTagManager from '@analytics/google-tag-manager'
import googleAnalytics from '@analytics/google-analytics'

import Router from 'next/router'
import 'rsuite/dist/rsuite.min.css'
import '../assets/css/style.scss'
import 'animate.css'

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || CommonLayout
  const [loading, setLoading] = useState(false)
  const { addToCart } = useCartStore()
  const { changeAuthenticateStatus } = useAuthorizationStore((state) => state)
  const { changeProductCategory, changeProduct } = useCommonStore((state) => state)
  useEffect(() => {
    authenticateUser()
    getCartItem()
    loadCategory()
    loadProduct()
    const analytics = Analytics({
      app: 'Kha Mobile',
      plugins: [
        googleTagManager({
          containerId: 'GTM-PH54855',
        }),
        googleAnalytics({
          measurementIds: ['G-LTP9H80YRD'],
        }),
      ],
    })

    const start = () => {
      setLoading(true)
    }
    const end = () => {
      analytics.page()
      setLoading(false)
    }
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)
    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', end)
      Router.events.off('routeChangeError', end)
    }
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
          isAuthenticating: true,
          user: resp.data.data,
          isAdmin: resp.data.data.role === 'admin',
        })
      }
    } catch (error) {
      changeAuthenticateStatus({
        authenticate: false,
        isAuthenticating: true,
        user: {},
        isAdmin: false,
      })
    }
  }

  const loadCategory = async () => {
    try {
      const resp = await GlobalCategoryService.getProdCate({ all: true })
      // console.log(resp.data.data)

      if (resp.status === 200) {
        changeProductCategory(resp.data.data)
      }
    } catch (error) {
      console.log('fetch category failed', error.message)
    }
  }

  const loadProduct = async () => {
    try {
      const resp = await GlobalProductService.getProduct({ all: true })
      // console.log(resp.data.data)
      if (resp.status === 200) {
        changeProduct(resp.data.data)
      }
    } catch (error) {
      console.log('fetch category failed', error.message)
    }
  }

  const renderComponent = useMemo(() => {
    let html = null

    if (Component.Admin) {
      html = (
        <Component.Admin classAnimation={'animate__animated  animate__fadeIn'}>
          <Component {...pageProps} />
        </Component.Admin>
      )
    } else {
      html = (
        <Layout classAnimation={'animate__animated  animate__fadeIn'}>
          <Component {...pageProps} />
        </Layout>
      )
    }
    return html
  }, [loading])
  return (
    <>
      <Head>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" />

        {/* {process.browser && (
          <script
            dangerouslySetInnerHTML={{
              __html: (function (w, d, s, l, i) {
                w[l] = w[l] || []
                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != 'dataLayer' ? '&l=' + l : ''
                j.async = true
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
                f.parentNode.insertBefore(j, f)
              })(window, document, 'script', 'dataLayer', 'GTM-PH54855'),
            }}
          />
        )} */}
      </Head>
      {/* <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PH54855"
          height="0"
          width="0"
          style={{
            display: 'none',
            visibility: 'hidden',
          }}
        ></iframe>
      </noscript> */}
      <Loader
        backdrop
        content="loading..."
        vertical
        className={`position-fixed  animate__animated animate__faster ${
          loading ? 'animate__fadeIn' : 'animate__fadeOut'
        }`}
      />
      <CustomProvider>{renderComponent}</CustomProvider>

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
