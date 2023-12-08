import Head from 'next/head'
import { Container, Content, Footer } from 'rsuite'
import PageFooter from './Footer'
import CustomNavbar from './Header'
import styles from './styles.module.scss'

const CommonLayout = ({ children, ...props }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="apple-touch-icon-precomposed" sizes="32x32" href="/kha-mobile-32x32.jpg" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/kha-mobile-180x180.jpg" />
        <link rel="apple-touch-icon-precomposed" sizes="192x192" href="/kha-mobile-192x192.jpg" />
        <link rel="apple-touch-icon-precomposed" sizes="270x270" href="/kha-mobile-270x270.jpg" />

        <link rel="icon" type="image/png" href="/kha-mobile-270x270.jpg" sizes="270x270" />
        <link rel="icon" type="image/png" href="/kha-mobile-192x192.jpg" sizes="192x192" />
        <link rel="icon" type="image/png" href="/kha-mobile-180x180.jpg" sizes="180x180" />
        <link rel="icon" type="image/png" href="/kha-mobile-32x32.jpg" sizes="32x32" />

        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/kha-mobile-270x270.jpg" />
        <meta name="msapplication-square70x70logo" content="/kha-mobile-32x32jpg" />
        <meta name="msapplication-square150x150logo" content="/kha-mobile-180x180.jpg" />
        <meta name="msapplication-wide310x150logo" content="/favicon.ico" />
        <meta name="msapplication-square270x270logo" content="/kha-mobile-270x270.jpg" />

      </Head>

      <div className={styles.wrapper} style={{ minHeight: '100vh', overflow: 'hidden overlay' }}>
        <Container>
          <CustomNavbar style={{ position: 'fixed', top: 0, left: 0, width: '100%' }} />
          <Content style={{ marginTop: '56px' }}>
            <div className={`container-fluid ${props?.classAnimation}`}>{children}</div>
          </Content>
          <Footer>
            <PageFooter />
          </Footer>
        </Container>
      </div>
    </>
  )
}

export default CommonLayout
