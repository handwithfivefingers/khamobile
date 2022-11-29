import CogIcon from '@rsuite/icons/legacy/Cog'
import { Badge, DOMHelper, Dropdown, Nav, Navbar, IconButton, Button, Drawer, Sidenav } from 'rsuite'

import LOGO from 'assets/img/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import { useEffect, forwardRef, useState } from 'react'
import GlobalCategoryService from 'service/global/Category.service'

import MobileIcon from '@rsuite/icons/Mobile'
import DeviceOtherIcon from '@rsuite/icons/DeviceOther'
import PcIcon from '@rsuite/icons/Pc'
import GridIcon from '@rsuite/icons/Grid'
import ListIcon from '@rsuite/icons/List'
import TextImageIcon from '@rsuite/icons/TextImage'
import PeoplesIcon from '@rsuite/icons/Peoples'
import HomeIcon from '@rsuite/icons/legacy/Home'
import { FaShoppingBasket } from 'react-icons/Fa'
import { useRef } from 'react'
import AlignRightIcon from '@rsuite/icons/legacy/AlignRight'
const NavLink = forwardRef((props, ref) => {
  const { href, as, ...rest } = props
  return (
    <Link href={href} as={as} passHref>
      <a ref={ref} {...rest} />
    </Link>
  )
})

const renderIconButton = (props, ref) => {
  return <IconButton {...props} ref={ref} icon={<AlignRightIcon />} />
}

const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
  const [cartLength, setCartLength] = useState(null)
  const [cateMenu, setCateMenu] = useState([])

  const [drawer, setDrawer] = useState(false)

  const [width, setWidth] = useState({
    lg: false,
    md: false,
    sm: false,
  })
  const nodeRef = useRef()
  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('khaMobileCart'))

    if (item) {
      setCartLength(item.length)
    }
    getCateData()
  }, [])

  const getCateData = async () => {
    try {
      let resp = await GlobalCategoryService.getProdCate()

      setCateMenu(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    }
  }

  const renderDropdownMenu = (cateList, trigger = 'hover') => {
    let html = null

    html = cateList?.map((item) => {
      return item.child?.length ? (
        <Dropdown.Menu title={item.name} trigger={trigger} icon={<ListIcon />}>
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
  const renderAsNavMenu = (cateList) => {
    let html = null

    html = cateList?.map((item) => {
      return item.child?.length ? (
        <Nav.Menu title={item.name} icon={<ListIcon />}>
          {renderDropdownMenu(item.child)}
        </Nav.Menu>
      ) : (
        <Nav.Item as={NavLink} href={`/category/${item.slug}`} icon={<GridIcon />}>
          {item.name}
        </Nav.Item>
      )
    })

    return html
  }

  const renderMenuRight = () => {
    let html = null
    html = (
      <>
        <Nav pullRight className={styles.ham}>
          <Dropdown renderToggle={renderIconButton} placement="bottomRight">
            <Dropdown.Item as={NavLink} href="/cart" icon={<FaShoppingBasket />}>
              <Badge content={cartLength}>Giỏ hàng</Badge>
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} href={`/admin`} icon={<CogIcon />}>
              Admin
            </Dropdown.Item>
          </Dropdown>
        </Nav>

        <Nav pullRight className={styles.navLinkHL}>
          <Link href="/cart" passHref>
            <Nav.Item icon={<FaShoppingBasket />} eventKey="7">
              <Badge content={cartLength}>Giỏ hàng</Badge>
            </Nav.Item>
          </Link>
          <Link href="/admin" passHref>
            <Nav.Item icon={<CogIcon />} eventKey="7">
              Admin
            </Nav.Item>
          </Link>
        </Nav>
      </>
    )
    return html
  }
  const renderMenuLeft = () => {
    let html = null

    html = (
      <>
        <IconButton icon={<GridIcon />} onClick={() => setDrawer(!drawer)} className={styles.hamLeft} />

        <Nav onSelect={onSelect} activeKey={activeKey} className={styles.navLeft}>
          <Nav.Item as={NavLink} href="/" icon={<HomeIcon />}>
            Trang chủ
          </Nav.Item>
          <Nav.Item as={NavLink} href="/about-us" icon={<PeoplesIcon />}>
            Về chúng tôi
          </Nav.Item>

          <Dropdown title="Sản phẩm" trigger="hover" icon={<PcIcon />}>
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
        </Nav>
      </>
    )
    return html
  }

  return (
    <Navbar {...props} className={styles.nav} ref={nodeRef}>
      <Navbar.Brand className={styles.brand} href="#" style={{ maxWidth: 200 }}>
        <Image src={LOGO} alt="Kha mobile" priority />
      </Navbar.Brand>

      {renderMenuLeft()}
      {renderMenuRight()}

      <Drawer open={drawer} onClose={() => setDrawer(false)} size={'xs'} style={{ width: 250 }} placement="left">
        <Drawer.Header>
          <Drawer.Title>
            <Image src={LOGO} alt="Kha mobile" priority />
          </Drawer.Title>

          {/* <Drawer.Actions>
            <Button onClick={() => setDrawer(false)}>Cancel</Button>
            <Button onClick={() => setDrawer(false)} appearance="primary">
              Confirm
            </Button>
          </Drawer.Actions> */}
        </Drawer.Header>
        <Drawer.Body style={{ padding: 0 }}>
          {/* <Placeholder.Paragraph /> */}
          {/* <Dropdown.Menu
            style={{
              width: 200,
              border: '1px solid #ddd',
            }}
          >
            <Dropdown.Item as={NavLink} href="/" icon={<HomeIcon />}>
              Trang chủ
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} href="/about-us" icon={<PeoplesIcon />}>
              Về chúng tôi
            </Dropdown.Item>

            {renderDropdownMenu(cateMenu)}
          </Dropdown.Menu> */}

          <Nav activeKey={activeKey} vertical appearance="tabs">
            <Nav.Item as={NavLink} href="/" icon={<HomeIcon />}>
              Trang chủ
            </Nav.Item>
            <Nav.Item as={NavLink} href="/about-us" icon={<PeoplesIcon />}>
              Về chúng tôi
            </Nav.Item>

            <Nav.Menu title="Sản phẩm">
              <Nav.Item as={NavLink} href="/product" icon={<DeviceOtherIcon />}>
                Tất cả sản phẩm
              </Nav.Item>
              <Nav.Item as={NavLink} href="/category" icon={<MobileIcon />}>
                Danh mục
              </Nav.Item>
              {renderAsNavMenu(cateMenu)}
            </Nav.Menu>

            <Nav.Item as={NavLink} href="/tin-tuc" icon={<TextImageIcon />}>
              Tin tức
            </Nav.Item>
          </Nav>
        </Drawer.Body>
      </Drawer>
    </Navbar>
  )
}
export default CustomNavbar

CustomNavbar.defaultProps = {}
