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
import { useEffect, useState } from 'react'
import { Nav, Navbar, Sidebar, Sidenav } from 'rsuite'
import { AuthenticateService } from 'service/authenticate'
import { useAuthorizationStore } from 'src/store'
import LOGO from 'assets/img/logo.png'
import Image from 'next/image'
import { NavLink } from 'component/UI/Layout/Header'

const headerStyles = {
  padding: 12,
  fontSize: 16,
  height: 72,
  background: 'rgba(52, 195, 255,0.7)',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  cursor: 'pointer',
}

export default function KMSidebar({ onExpand }) {
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
  useEffect(() => {
    onExpand(expand)
  }, [expand])

  return (
    <Sidebar
      style={{ display: 'flex', flexDirection: 'column' }}
      width={expand ? 260 : 56}
      collapsible
      appearance="inverse"
    >
      <Sidenav.Header>
        <Link href="/">
          <div style={headerStyles}>
            {expand ? (
              <Image src={LOGO} alt="Kha mobile" priority />
            ) : (
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'var(--rs-red-800)',
                }}
              >
                K
              </div>
            )}
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
            <Nav.Item eventKey="/admin" href={'/admin'} as={NavLink} icon={<DashboardIcon />}>
              Dashboard
            </Nav.Item>

            <Nav.Item eventKey="/admin/page" href="/admin/pages" as={NavLink} icon={<DetailIcon />}>
              Pages
            </Nav.Item>

            <Nav.Menu icon={<TextImageIcon />} title="Post">
              <Nav.Item eventKey="/admin/posts" as={NavLink} href="/admin/posts">
                <div className="flex gap-4 text-base items-center">
                  <TextImageIcon />
                  <span>Posts</span>
                </div>
              </Nav.Item>
              <Nav.Item eventKey="/admin/posts/category" as={NavLink} href="/admin/posts/category">
                <div className="flex gap-4 text-base items-center">
                  <ListIcon />
                  <span> Danh mục</span>
                </div>
              </Nav.Item>
            </Nav.Menu>

            <Nav.Menu icon={<MobileIcon />} title="Products">
              <Nav.Item eventKey="/admin/product" as={NavLink} href="/admin/product">
                <div className="flex gap-4 text-base items-center">
                  <DeviceOtherIcon />
                  <span>Products</span>
                </div>
              </Nav.Item>
              <Nav.Item eventKey="/admin/product/category" as={NavLink} href="/admin/product/category">
                <div className="flex gap-4 text-base items-center">
                  <ListIcon />
                  <span>Danh mục</span>
                </div>
              </Nav.Item>
              <Nav.Item eventKey="/admin/product/attribute" as={NavLink} href="/admin/product/attribute">
                <div className="flex gap-4 text-base items-center">
                  <StorageIcon />
                  <span>Thuộc tính</span>
                </div>
              </Nav.Item>
            </Nav.Menu>

            <Nav.Item eventKey="/admin/users" icon={<PeoplesIcon />} as={NavLink} href="/admin/users">
              Users
            </Nav.Item>

            <Nav.Item eventKey="/admin/order" icon={<PageIcon />} as={NavLink} href="/admin/order">
              Order
            </Nav.Item>

            <Nav.Item eventKey="/admin/file-manager" icon={<DetailIcon />} as={NavLink} href="/admin/file-manager">
              Quản lý file
            </Nav.Item>

            <Nav.Menu icon={<GearIcon />} title="Tùy chỉnh">
              <Nav.Item eventKey="/admin/setting/menu" as={NavLink} href="/admin/setting/menu">
                <div className="flex gap-4 text-base items-center">
                  <GearIcon />
                  <span>Menu</span>
                </div>
              </Nav.Item>
              <Nav.Item eventKey="/admin/setting/email" as={NavLink} href="/admin/setting/email">
                <div className="flex gap-4 text-base items-center">
                  <MessageIcon />
                  <span>Email</span>
                </div>
              </Nav.Item>
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
