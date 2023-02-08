import CogIcon from '@rsuite/icons/legacy/Cog'
import { Badge, Drawer, Dropdown, IconButton, Nav, Navbar, Sidenav } from 'rsuite'

import LOGO from 'assets/img/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import GlobalCategoryService from 'service/global/Category.service'
import styles from './styles.module.scss'

import DeviceOtherIcon from '@rsuite/icons/DeviceOther'
import GridIcon from '@rsuite/icons/Grid'
import AlignRightIcon from '@rsuite/icons/legacy/AlignRight'
import HomeIcon from '@rsuite/icons/legacy/Home'
import ListIcon from '@rsuite/icons/List'
import MobileIcon from '@rsuite/icons/Mobile'
import PcIcon from '@rsuite/icons/Pc'
import PeoplesIcon from '@rsuite/icons/Peoples'
import TextImageIcon from '@rsuite/icons/TextImage'
import { useRef } from 'react'
import { FaShoppingBasket } from 'react-icons/fa'

import UserInfoIcon from '@rsuite/icons/UserInfo'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { HEADER_MENU } from 'src/constant/header.constant.jsx'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import UserChangeIcon from '@rsuite/icons/UserChange'
import GlobalHomeService from 'service/global/Home.service'
const NavLink = forwardRef((props, ref) => {
  const { href, as, ...rest } = props
  return (
    <Link href={href} as={as} passHref>
      <a ref={ref} {...rest} />
    </Link>
  )
})

const renderIconButton = ({ placement, ...props }, ref) => {
  return <IconButton {...props} ref={ref} icon={<AlignRightIcon />} />
}

const CustomNavbar = ({ ...props }) => {
  const [cartLength, setCartLength] = useState(null)
  const [cateMenu, setCateMenu] = useState([])
  const [drawer, setDrawer] = useState(false)
  const [activeKey, setActiveKey] = useState(null)
  const [menu, setMenu] = useState([])
  const { authenticate, isAdmin } = useAuthorizationStore((state) => state)
  const nodeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('khaMobileCart'))
    if (item) {
      setCartLength(item.length)
    }
    getCateData()
    getMenu()
  }, [])

  const getMenu = async () => {
    try {
      const resp = await GlobalHomeService.getMenu()

      console.log(resp)
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

  const getCateData = async () => {
    try {
      let resp = await GlobalCategoryService.getProdCate()

      setCateMenu(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    }
  }

  const renderDropdownMenu = (cateList, trigger) => {
    let html = null
    // console.log(trigger)
    html = cateList?.map((item) => {
      return item.child?.length ? (
        <Dropdown.Menu title={item.name} trigger={trigger || 'hover'} icon={<ListIcon />}>
          {renderDropdownMenu(item.child, trigger)}
        </Dropdown.Menu>
      ) : (
        <Dropdown.Item as={NavLink} href={`/category/${item.slug}`} icon={<GridIcon />}>
          {item.name}
        </Dropdown.Item>
      )
    })

    return html
  }

  const renderMenuRight = useMemo(() => {
    let html = null
    html = (
      <>
        <Nav pullRight className={styles.ham}>
          <Dropdown.Item as={NavLink} href="/cart" icon={<FaShoppingBasket />}>
            <Badge content={cartLength}>Giỏ hàng</Badge>
          </Dropdown.Item>
        </Nav>

        <Nav pullRight className={styles.navLinkHL}>
          <Link href="/cart" passHref>
            <Nav.Item icon={<FaShoppingBasket />} eventKey="7">
              <Badge content={cartLength}>Giỏ hàng</Badge>
            </Nav.Item>
          </Link>

          {!authenticate && (
            <Link href="/login" passHref>
              <Nav.Item icon={<UserChangeIcon />} eventKey="8">
                Đăng nhập
              </Nav.Item>
            </Link>
          )}

          {authenticate && (
            <Link href="/user" passHref>
              <Nav.Item icon={<UserInfoIcon />} eventKey="8">
                User
              </Nav.Item>
            </Link>
          )}

          {authenticate && isAdmin && (
            <Link href="/admin" passHref>
              <Nav.Item icon={<CogIcon />} eventKey="9">
                Admin
              </Nav.Item>
            </Link>
          )}
        </Nav>
      </>
    )

    return html
  }, [authenticate, isAdmin])

  const renderMenuLeft = () => {
    let html = null

    html = (
      <>
        <IconButton icon={<GridIcon />} onClick={() => setDrawer(!drawer)} className={styles.hamLeft} />

        <Nav activeKey={activeKey} className={styles.navLeft}>
          {HEADER_MENU.map((navItem) => {
            if (navItem.subMenu) {
              return (
                <Dropdown
                  title={navItem.label}
                  trigger="hover"
                  icon={navItem.icon}
                  key={navItem.path}
                  className={clsx(styles.navItem, styles.navSubMenu, { [styles.active]: activeKey === navItem.path })}
                >
                  <Dropdown.Item as={NavLink} href="/product" icon={<DeviceOtherIcon />}>
                    Tất cả sản phẩm
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} href="/category" icon={<MobileIcon />}>
                    Danh mục
                  </Dropdown.Item>

                  {renderDropdownMenu(cateMenu, 'click')}
                </Dropdown>
              )
            } else {
              return (
                <Nav.Item
                  as={NavLink}
                  href={navItem.path}
                  icon={navItem.icon}
                  key={navItem.path}
                  className={clsx(styles.navItem, { [styles.active]: activeKey === navItem.path })}
                >
                  {navItem.label}
                </Nav.Item>
              )
            }
          })}
        </Nav>
      </>
    )
    return html
  }

  const getHref = (item) => {
    // menuItem.dynamicRef === 'Page' ? menuItem.slug : '/' + menuItem.slug

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
              active={activeKey === getHref(menuItem)}
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
            active={activeKey === getHref(menuItem)}
          >
            {menuItem.name}
          </Nav.Item>
        )
      }
    })

    return html
    // menu.map((menuItem, index) => {
    //   if (menuItem.children.length) {
    //     return (
    //       <Dropdown title="Sản phẩm" trigger="click" icon={<PcIcon />}>
    //         <Dropdown.Item as={NavLink} href="/product" icon={<DeviceOtherIcon />}>
    //           Tất cả sản phẩm
    //         </Dropdown.Item>
    //         <Dropdown.Item as={NavLink} href="/category" icon={<MobileIcon />}>
    //           Danh mục
    //         </Dropdown.Item>

    //         {renderDropdownMenu(cateMenu)}
    //       </Dropdown>
    //     )
    //   }
    //   return (
    //     <Nav.Item
    //       as={NavLink}
    //       href={menuItem.dynamicRef === 'Page' ? menuItem.slug : '/' + menuItem.slug}
    //       icon={<HomeIcon />}
    //     >
    //       {menuItem.name}
    //     </Nav.Item>
    //   )
    // })
  }

  return (
    <Navbar {...props} className={clsx(styles.nav, 'shadow')} ref={nodeRef}>
      <Navbar.Brand className={styles.brand} href="#" style={{ maxWidth: 200 }}>
        <Link href="/" passHref>
          <Image src={LOGO} alt="Kha mobile" priority />
        </Link>
      </Navbar.Brand>

      <IconButton
        icon={<GridIcon />}
        onClick={() => setDrawer(!drawer)}
        className={clsx(styles.hamLeft, 'ml-2 shadow')}
      />

      <Nav onSelect={(v) => setActiveKey(v)} activeKey={activeKey} className={styles.navLeft}>
        {renderListMenu(menu)}
      </Nav>

      {renderMenuRight}

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
              {/* 
                <Nav.Item as={NavLink} href="/" icon={<HomeIcon />}>
                  Trang chủ
                </Nav.Item>

                <Nav.Item as={NavLink} href="/about-us" icon={<PeoplesIcon />}>
                  Về chúng tôi
                </Nav.Item>

                <Dropdown title="Sản phẩm" trigger="click" icon={<PcIcon />}>
                  <Dropdown.Item as={NavLink} href="/product" icon={<DeviceOtherIcon />}>
                    Tất cả sản phẩm
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} href="/category" icon={<MobileIcon />}>
                    Danh mục
                  </Dropdown.Item>

                  {renderDropdownMenu(cateMenu)}
                </Dropdown>

                <Nav.Item as={NavLink} href="/tin-tuc" icon={<TextImageIcon />}>
                  Tin tức
                </Nav.Item>

                <Dropdown.Item as={NavLink} href="/user" icon={<UserInfoIcon />}>
                  User
                </Dropdown.Item>

                <Dropdown.Item as={NavLink} href="/admin" icon={<CogIcon />}>
                  Admin
                </Dropdown.Item> */}
            </Sidenav.Body>
          </Sidenav>
        </Drawer.Body>
      </Drawer>
    </Navbar>
  )
}
export default CustomNavbar
