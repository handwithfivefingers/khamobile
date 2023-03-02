import googleAnalytics from '@analytics/google-analytics'
import googleTagManager from '@analytics/google-tag-manager'
import Analytics from 'analytics'
import 'animate.css'
import Head from 'next/head'
import Router from 'next/router'
import Script from 'next/script'
import { useEffect, useMemo, useState } from 'react'
import { CustomProvider, Loader } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import { AuthenticateService } from 'service/authenticate'
import { GlobalCategoryService, GlobalProductService } from 'service/global'
import { useAuthorizationStore, useCartStore, useCommonStore } from 'src/store'
import '../assets/css/style.scss'
import CommonLayout from '../component/UI/Layout'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 15,
    },
  },
})
export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || CommonLayout

  const [loading, setLoading] = useState(false)

  const { addToCart } = useCartStore()

  const { changeAuthenticateStatus } = useAuthorizationStore((state) => state)

  // const { changeProductCategory, changeProduct } = useCommonStore((state) => state)

  useEffect(() => {
    authenticateUser()
    getCartItem()
    // loadCategory()
    // loadProduct()
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

  // const loadCategory = async () => {
  //   try {
  //     const resp = await GlobalCategoryService.getProdCate({ all: true })
  //     if (resp.status === 200) {
  //       changeProductCategory(resp.data.data)
  //     }
  //   } catch (error) {
  //     console.log('fetch category failed', error.message)
  //   }
  // }

  // const loadProduct = async () => {
  //   try {
  //     const resp = await GlobalProductService.getProduct({ all: true })
  //     if (resp.status === 200) {
  //       changeProduct(resp.data.data)
  //     }
  //   } catch (error) {
  //     console.log('fetch category failed', error.message)
  //   }
  // }

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
  const {
    data: productData,
    refetch: productRefetch,
    isLoading: productLoading,
    isError: productError,
    status: productStatus,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => await getProducts(),
  })

  const {
    data: cateData,
    refetch: refetchCate,
    isLoading: cateLoading,
    isError: cateError,
    status: cateStatus,
  } = useQuery({
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

  // console.log(productStatus)

  if (productData && productStatus === 'success') {
    changeProduct(productData)
  }
  if (cateData && cateStatus === 'success') {
    changeProductCategory(cateData)
  }

  return props.children
}
