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
import { FaUserTie } from 'react-icons/fa'
import { FaNewspaper } from 'react-icons/fa6'
import { MdOutlineDevicesOther } from 'react-icons/md'

import styles from './styles.module.scss'
const HomeIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
  )
}
const ArrowDown = () => {
  return (
    <span
      className="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
      data-te-sidenav-rotate-icon-ref
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  )
}
const NavLink = (props) => {
  const { href, as, ...rest } = props
  return <Link href={href} as={as} {...rest} />
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
      <Nav.Item icon={<FaShoppingBasket />} eventKey="/cart" as={NavLink} href="/cart">
        <Badge content={cart?.length}>Giỏ hàng</Badge>
      </Nav.Item>
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
  const renderMobileMenu = (menuData) => {
    let html = null
    html = menuData.map((menuItem, index) => {
      if (menuItem.children && menuItem.children?.length) {
        return (
          <li className="relative">
            <Link
              onClick={() => setDrawer(false)}
              className="flex cursor-pointer items-center truncate rounded-[5px] font-bold px-6 py-[0.45rem] text-[1rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              data-te-sidenav-link-ref
              href={getHref(menuItem)}
            >
              <span className="mr-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
                {(menuItem.slug === '/product' && <MdOutlineDevicesOther fontSize={32} />) || <span />}
              </span>
              <span>{menuItem.name}</span>
            </Link>
            <ul class="relative m-0 list-none p-0 ml-4 " data-te-sidenav-collapse-ref>
              {renderMobileMenu(menuItem.children)}
            </ul>
          </li>
        )
      } else {
        return (
          <li className="relative">
            <Link
              className="flex cursor-pointer items-center truncate rounded-[5px] px-6 py-[0.45rem] text-[1rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
              data-te-sidenav-link-ref
              href={getHref(menuItem)}
              onClick={() => setDrawer(false)}
            >
              <span className="mr-2 [&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
                {menuItem.slug === '/' && <HomeIcon />}
                {menuItem.slug === '/about-us' && <FaUserTie />}
                {menuItem.slug === '/tin-tuc' && <FaNewspaper />}
              </span>

              <span>{menuItem.name}</span>
            </Link>
          </li>
        )
      }
    })

    return html
  }

  // console.log('onOpenChange')
  const onOpenChange = (val) => console.log('val', val)
  return (
    <Navbar {...props} className={clsx(styles.nav, 'shadow')} ref={nodeRef}>
      <Navbar.Brand className={styles.brand} style={{ maxWidth: 200 }} as={NavLink} href="/">
        <Image src={LOGO} alt="Kha mobile" priority />
      </Navbar.Brand>

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
          <Nav.Item icon={<CogIcon />} eventKey="9" as={NavLink} href="/admin">
            Admin
          </Nav.Item>
        )}
      </Nav>

      <Drawer
        open={drawer}
        onClose={(e) => {
          e.preventDefault()
          setDrawer(false)
        }}
        size={'xs'}
        style={{ width: 350 }}
        placement="left"
        className={styles.drawer}
      >
        <Drawer.Header>
          <Drawer.Title
            onClick={() => {
              setDrawer(false)
              router.push('/')
            }}
          >
            <div className={styles.mobile_brand}>
              <Image src={LOGO} alt="Kha mobile" priority />
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body style={{ padding: 0, width: 350 }}>
          <nav
            id="sidenav-8"
            className="absolute left-0 top-0 z-[1035]  overflow-y-auto h-full w-full -translate-x-full  bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
            data-te-sidenav-init
            data-te-sidenav-hidden="false"
            data-te-sidenav-position="absolute"
            data-te-sidenav-accordion="true"
          >
            <ul className="relative m-0 list-none px-[0.2rem] pb-12" data-te-sidenav-menu-ref>
              {renderMobileMenu(menu)}
            </ul>
          </nav>
        </Drawer.Body>
      </Drawer>
    </Navbar>
  )
}

export { NavLink }
export default CustomNavbar
