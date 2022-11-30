import Head from 'next/head'
import { useState } from 'react'
import PageFooter from './Footer'
import CustomNavbar from './Header'
import { Container, Header, Content, Footer, Navbar, Nav } from 'rsuite'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'
import Script from 'next/script'
const CommonLayout = ({ children }) => {
  const [activeKey, setActiveKey] = useState(null)

  const router = useRouter()
  const handleSelect = (e) => {
    console.log(e)
    if (e == 1) router.push('/')

    if (e == 7) router.push('/admin')
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.ico" sizes="196x196" />
        <link rel="icon" type="image/png" href="/favicon.ico" sizes="96x96" />
        <link rel="icon" type="image/png" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon.ico" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon.ico" sizes="128x128" />

        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="msapplication-square70x70logo" content="/favicon.ico" />
        <meta name="msapplication-square150x150logo" content="/favicon.ico" />
        <meta name="msapplication-wide310x150logo" content="/favicon.ico" />
        <meta name="msapplication-square310x310logo" content="/favicon.ico" />
        <link rel="stylesheet" href="https://pc.baokim.vn/css/bk.css" />
      </Head>

      <div className={styles.wrapper} style={{ minHeight: '100vh' }}>
        <Container>
          <CustomNavbar activeKey={activeKey} onSelect={handleSelect} />
          <Content>
            <div className="container-fluid">{children}</div>
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
