import CogIcon from '@rsuite/icons/legacy/Cog'
import HomeIcon from '@rsuite/icons/legacy/Home'
import { Badge, Dropdown, Nav, Navbar } from 'rsuite'

import LOGO from 'assets/img/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import { useEffect, forwardRef, useState } from 'react'
import GlobalCategoryService from 'service/global/Category.service'

const NavLink = forwardRef((props, ref) => {
  const { href, as, ...rest } = props
  return (
    <Link href={href} as={as} passHref>
      <a ref={ref} {...rest} />
    </Link>
  )
})

const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
  const [cartLength, setCartLength] = useState(null)
  const [cateMenu, setCateMenu] = useState([])
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

  const renderDropdownMenu = (cateList) => {
    let html = null

    html = (
      <>
        {cateList?.map((item) => {
          return (
            <>
              {item.child?.length ? (
                <Dropdown.Menu title={item.name}>{renderDropdownMenu(item.child)}</Dropdown.Menu>
              ) : (
                <Dropdown.Item as={NavLink} href={`/category/${item.slug}`}>
                  {item.name}
                </Dropdown.Item>
              )}
            </>
          )
        })}
      </>
    )

    return html
  }

  return (
    <Navbar {...props} className={styles.nav}>
      <Navbar.Brand className={styles.brand} href="#" style={{ maxWidth: 200 }}>
        <Image src={LOGO} alt="Kha mobile" priority />
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item as={NavLink} href="/" icon={<HomeIcon />}>
          Home
        </Nav.Item>
        <Nav.Item as={NavLink} href="/about-us" icon={<HomeIcon />}>
          About us
        </Nav.Item>

        <Dropdown title="Sản phẩm">{renderDropdownMenu(cateMenu)}</Dropdown>

        <Nav.Item as={NavLink} href="/category">
          Danh mục
        </Nav.Item>
        <Nav.Item as={NavLink} href="/tin-tuc">
          Tin tức
        </Nav.Item>
      </Nav>
      <Nav pullRight>
        <Link href="/cart" passHref>
          <Nav.Item icon={<CogIcon />} eventKey="7">
            <Badge content={cartLength}>Giỏ hàng</Badge>
          </Nav.Item>
        </Link>
        <Link href="/admin" passHref>
          <Nav.Item icon={<CogIcon />} eventKey="7">
            Admin
          </Nav.Item>
        </Link>
      </Nav>
    </Navbar>
  )
}
export default CustomNavbar

CustomNavbar.defaultProps = {}
