import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useMemo, useState } from 'react'
import { CustomProvider, Loader } from 'rsuite'
import { AuthenticateService } from 'service/authenticate'
import { GlobalCategoryService, GlobalProductService } from 'service/global'
import { queryClient, QueryClientProvider, ReactQueryDevtools, useQuery } from 'src/queryClient'
import { useAuthorizationStore, useCartStore, useCommonStore } from 'src/store'
import CommonLayout from '../component/UI/Layout'
import googleAnalytics from '@analytics/google-analytics'
import googleTagManager from '@analytics/google-tag-manager'
import Analytics from 'analytics'

import 'rsuite/dist/rsuite.min.css'
import 'animate.css'
import '../assets/css/style.scss'

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
export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || CommonLayout

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToCart } = useCartStore()

  const { changeAuthenticateStatus } = useAuthorizationStore((state) => state)

  useEffect(() => {
    authenticateUser()
    getCartItem()
    initServiceWorker()
    const start = (routerPathName) => {
      setLoading(true)
    }

    const end = (routerPathName) => {
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

  useEffect(() => {
    const url = process.env.host + router.asPath
    if (!router.asPath.includes('admin')) {
      analytics.page({
        url,
      })
      const isCategory = router.asPath.includes('category')
      if (isCategory) {
        const [_, categoryName] = router.asPath.split('/').filter((item) => item)
        if (categoryName) {
          analytics.track('category', {
            categoryName,
          })
        }
      }
    }
  }, [router.asPath])

  const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope)
          },
          function (err) {
            console.log('Service Worker registration failed: ', err)
          },
        )
      })
    }
  }

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

  const renderComponent = () => {
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
  }

  const generateComp = useMemo(() => {
    let html = null
    html = (
      <QueryStore>
        <CustomProvider>{renderComponent()}</CustomProvider>
      </QueryStore>
    )
    return html
  }, [loading])

  return (
    <>
      <Head>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" />
      </Head>

      <Loader
        backdrop
        content="loading..."
        vertical
        className={`position-fixed  animate__animated animate__faster ${
          loading ? 'animate__fadeIn' : 'animate__fadeOut'
        }`}
      />
      <QueryClientProvider client={queryClient}>
        {generateComp}

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

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

const QueryStore = (props) => {
  const { data: productData, status: productStatus } = useQuery({
    queryKey: ['products'],
    queryFn: async () => await getProducts(),
  })

  const { data: cateData, status: cateStatus } = useQuery({
    queryKey: ['category'],
    queryFn: async () => await loadCategory(),
  })
  const changeProductCategory = useCommonStore((state) => state.changeProductCategory)
  const changeProduct = useCommonStore((state) => state.changeProduct)

  const getProducts = async () => {
    try {
      const resp = await GlobalProductService.getProduct({ all: true })
      return resp.data.data
    } catch (error) {
      console.log(error)
    }
  }

  const loadCategory = async () => {
    try {
      const resp = await GlobalCategoryService.getProdCate({ all: true })
      return resp.data.data
    } catch (error) {
      console.log('fetch category failed', error.message)
    }
  }

  useEffect(() => {
    if (productData && productStatus === 'success') {
      changeProduct(productData)
    }
  }, [productData, productStatus])
  useEffect(() => {
    if (cateData && cateStatus === 'success') {
      changeProductCategory(cateData)
    }
  }, [cateData, cateStatus])
  return props.children
}
