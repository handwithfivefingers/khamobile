import DashboardIcon from '@rsuite/icons/Dashboard'
import DetailIcon from '@rsuite/icons/Detail'
import DeviceOtherIcon from '@rsuite/icons/DeviceOther'
import GearIcon from '@rsuite/icons/Gear'
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft'
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight'
import ListIcon from '@rsuite/icons/List'
import MessageIcon from '@rsuite/icons/Message'
import MobileIcon from '@rsuite/icons/Mobile'
import OffIcon from '@rsuite/icons/Off'
import PageIcon from '@rsuite/icons/Page'
import PeoplesIcon from '@rsuite/icons/Peoples'
import StorageIcon from '@rsuite/icons/Storage'
import TextImageIcon from '@rsuite/icons/TextImage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Nav, Navbar, Sidebar, Sidenav } from 'rsuite'
import { AuthenticateService } from 'service/authenticate'
import { useAuthorizationStore } from 'src/store'
const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: '#34c3ff',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}

export default function KMSidebar() {
  const [expand, setExpand] = useState(true)

  const { changeAuthenticateStatus } = useAuthorizationStore((state) => state)
  const router = useRouter()
  const [active, setActive] = useState('')

  const logout = async () => {
    await AuthenticateService.logout()
    await changeAuthenticateStatus({
      authenticate: false,
    })
    return router.push('/')
  }

  return (
    <Sidebar
      style={{ display: 'flex', flexDirection: 'column' }}
      width={expand ? 260 : 56}
      collapsible
      appearance="inverse"
    >
      <Sidenav.Header>
        <Link href="/" passHref>
          <div style={headerStyles}>
            <span style={{ marginLeft: 12 }}> BRAND</span>
          </div>
        </Link>
      </Sidenav.Header>

      <Sidenav expanded={expand} appearance="subtle" className={'position-sticky top-0'}>
        <Sidenav.Body>
          <Nav
            onSelect={(eventKey) => {
              eventKey && setActive(eventKey)
            }}
            activeKey={active}
          >
            <Link href={'/admin'} passHref>
              <Nav.Item eventKey="/admin" icon={<DashboardIcon />}>
                Dashboard
              </Nav.Item>
            </Link>

            <Link href="/admin/pages" passHref>
              <Nav.Item eventKey="/admin/page" icon={<DetailIcon />}>
                Pages
              </Nav.Item>
            </Link>

            <Nav.Menu icon={<TextImageIcon />} title="Post">
              <Link href="/admin/posts" passHref>
                <Nav.Item eventKey="/admin/posts" icon={<TextImageIcon />}>
                  Posts
                </Nav.Item>
              </Link>
              <Link href="/admin/posts/category" passHref>
                <Nav.Item eventKey="/admin/posts/category" icon={<ListIcon />}>
                  Danh mục
                </Nav.Item>
              </Link>
            </Nav.Menu>

            <Nav.Menu icon={<MobileIcon />} title="Products">
              <Link href="/admin/product" passHref>
                <Nav.Item eventKey="/admin/product" icon={<DeviceOtherIcon />}>
                  Products
                </Nav.Item>
              </Link>
              <Link href="/admin/product/category" passHref>
                <Nav.Item eventKey="/admin/product/category" icon={<ListIcon />}>
                  Danh mục
                </Nav.Item>
              </Link>
              <Link href="/admin/product/attribute" passHref>
                <Nav.Item eventKey="/admin/product/attribute" icon={<StorageIcon />}>
                  Biến thể
                </Nav.Item>
              </Link>
            </Nav.Menu>

            <Link href="/admin/users" passHref>
              <Nav.Item eventKey="/admin/users" icon={<PeoplesIcon />}>
                Users
              </Nav.Item>
            </Link>

            <Link href="/admin/order" passHref>
              <Nav.Item eventKey="/admin/order" icon={<PageIcon />}>
                Order
              </Nav.Item>
            </Link>

            <Link href="/admin/file-manager" passHref>
              <Nav.Item eventKey="/admin/file-manager" icon={<DetailIcon />}>
                Quản lý file
              </Nav.Item>
            </Link>

            <Nav.Menu icon={<GearIcon />} title="Tùy chỉnh">
              <Link href="/admin/setting/menu" passHref>
                <Nav.Item eventKey="/admin/setting/menu" icon={<GearIcon />}>
                  Menu
                </Nav.Item>
              </Link>

              <Link href="/admin/setting/email" passHref>
                <Nav.Item eventKey="/admin/setting/email" icon={<MessageIcon />}>
                  Email
                </Nav.Item>
              </Link>
            </Nav.Menu>

            <Nav.Item eventKey="4" icon={<OffIcon />} onClick={logout}>
              Logout
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
      <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
    </Sidebar>
  )
}

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  )
}
