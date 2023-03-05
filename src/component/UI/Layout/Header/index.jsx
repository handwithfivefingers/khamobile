import CogIcon from '@rsuite/icons/legacy/Cog'
import MenuIcon from '@rsuite/icons/Menu'
import LOGO from 'assets/img/logo.png'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaShoppingBasket } from 'react-icons/fa'
import { Badge, Drawer, IconButton, Nav, Navbar, Sidenav } from 'rsuite'
import { GlobalHomeService } from 'service/global'
import { useAuthorizationStore, useCartStore } from 'src/store'
import styles from './styles.module.scss'
const NavLink = (props) => {
  const { href, as, ...rest } = props
  return (
    <Link href={href} as={as} passHref>
      <a {...rest} />
    </Link>
  )
}

const CustomNavbar = ({ ...props }) => {
  const [drawer, setDrawer] = useState(false)
  const [activeKey, setActiveKey] = useState(null)
  const [menu, setMenu] = useState([])
  const { authenticate, isAdmin } = useAuthorizationStore((state) => state)
  const { cart } = useCartStore()

  const nodeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    getMenu()
  }, [])

  const getMenu = async () => {
    try {
      const resp = await GlobalHomeService.getMenu()
      const { data } = resp.data
      const { menu } = data
      setMenu(menu)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (router.pathname.includes('/product')) {
      setActiveKey('/product')
    } else if (router.pathname.includes('/category')) {
      setActiveKey('/category')
    } else {
      setActiveKey(router.pathname)
    }
  }, [router])

  const renderCart = useMemo(() => {
    return (
      <Link href="/cart" passHref>
        <Nav.Item icon={<FaShoppingBasket />} eventKey="/cart">
          <Badge content={cart?.length}>Giỏ hàng</Badge>
        </Nav.Item>
      </Link>
    )
  }, [cart])

  const getHref = (item) => {
    switch (item.dynamicRef) {
      case 'Page':
        return item.slug
      case 'ProductCategory':
        return '/category/' + item.slug
    }
  }

  const renderListMenu = (menuData) => {
    let html = null
    html = menuData.map((menuItem, index) => {
      if (menuItem.children && menuItem.children?.length) {
        return (
          <Nav.Menu
            title={menuItem.name}
            key={[menuItem._id, index].join('_')}
            active={activeKey === getHref(menuItem)}
          >
            <Nav.Item
              as={NavLink}
              href={getHref(menuItem)}
              eventKey={getHref(menuItem)}
              active={activeKey === getHref(menuItem) ? 1 : undefined}
            >
              {menuItem.name}
            </Nav.Item>
            {renderListMenu(menuItem.children)}
          </Nav.Menu>
        )
      } else {
        return (
          <Nav.Item
            as={NavLink}
            href={getHref(menuItem)}
            key={[menuItem._id, index].join('_')}
            eventKey={getHref(menuItem)}
            active={activeKey === getHref(menuItem) ? 1 : undefined}
          >
            {menuItem.name}
          </Nav.Item>
        )
      }
    })

    return html
  }

  return (
    <Navbar {...props} className={clsx(styles.nav, 'shadow')} ref={nodeRef}>
      <Link href="/" passHref>
        <Navbar.Brand className={styles.brand} style={{ maxWidth: 200 }}>
          <Image src={LOGO} alt="Kha mobile" priority />
        </Navbar.Brand>
      </Link>

      <IconButton
        icon={<MenuIcon style={{ background: 'var(--rs-blue-800)', color: '#fff' }} />}
        onClick={() => setDrawer(!drawer)}
        className={clsx(styles.hamLeft, 'ml-2')}
      >
        <span>Danh mục</span>
      </IconButton>

      <Nav onSelect={(v) => setActiveKey(v)} activeKey={activeKey} className={styles.navLeft}>
        {renderListMenu(menu)}
      </Nav>

      <Nav pullRight className={styles.navLinkHL}>
        {renderCart}

        {authenticate && isAdmin && (
          <Link href="/admin" passHref>
            <Nav.Item icon={<CogIcon />} eventKey="9">
              Admin
            </Nav.Item>
          </Link>
        )}
      </Nav>

      <Drawer open={drawer} onClose={() => setDrawer(false)} size={'xs'} style={{ width: 250 }} placement="left">
        <Drawer.Header>
          <Drawer.Title>
            <Image src={LOGO} alt="Kha mobile" priority />
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body style={{ padding: 0 }}>
          <Sidenav>
            <Sidenav.Body>
              <Nav
                onSelect={(v) => {
                  setActiveKey(v)
                  v && setDrawer(false)
                }}
                activeKey={activeKey}
                className={clsx(styles.sideMenu)}
              >
                {renderListMenu(menu)}
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </Drawer.Body>
      </Drawer>
    </Navbar>
  )
}
export default CustomNavbar
