import DashboardIcon from '@rsuite/icons/Dashboard'
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft'
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight'
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle'
import GroupIcon from '@rsuite/icons/legacy/Group'
import MagicIcon from '@rsuite/icons/legacy/Magic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Nav, Navbar, Sidebar, Sidenav } from 'rsuite'
import { FaPowerOff } from 'react-icons/fa'
import OffRoundIcon from '@rsuite/icons/OffRound'
import PageIcon from '@rsuite/icons/Page'
import DetailIcon from '@rsuite/icons/Detail'
import MobileIcon from '@rsuite/icons/Mobile'
import OffIcon from '@rsuite/icons/Off'
import GearIcon from '@rsuite/icons/Gear'
import MessageIcon from '@rsuite/icons/Message'
import ListIcon from '@rsuite/icons/List'
import DeviceOtherIcon from '@rsuite/icons/DeviceOther'
import StorageIcon from '@rsuite/icons/Storage'
import TextImageIcon from '@rsuite/icons/TextImage'
import PeoplesIcon from '@rsuite/icons/Peoples'
import AuthenticateService from 'service/authenticate/Authenticate.service'
import { useAuthorizationStore } from 'src/store/authenticateStore'
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
      <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle" className={'position-sticky top-0'}>
        <Sidenav.Body>
          <Nav>
            <Link href={'/admin'} passHref>
              <Nav.Item eventKey="1" active icon={<DashboardIcon />}>
                Dashboard
              </Nav.Item>
            </Link>

            <Link href="/admin/pages" passHref>
              <Nav.Item eventKey="2" icon={<DetailIcon />}>
                Pages
              </Nav.Item>
            </Link>

            <Nav.Menu eventKey="3" icon={<TextImageIcon />} title="Post">
              <Link href="/admin/posts" passHref>
                <Nav.Item eventKey="3-1" icon={<TextImageIcon />}>
                  Posts
                </Nav.Item>
              </Link>
              <Link href="/admin/posts/category" passHref>
                <Nav.Item eventKey="3-2" icon={<ListIcon />}>
                  Danh mục
                </Nav.Item>
              </Link>
            </Nav.Menu>

            <Nav.Menu eventKey="4" icon={<MobileIcon />} title="Products">
              {/* Products */}
              <Link href="/admin/product" passHref>
                <Nav.Item eventKey="4-1" icon={<DeviceOtherIcon />}>
                  Products
                </Nav.Item>
              </Link>
              <Link href="/admin/product/category" passHref>
                <Nav.Item eventKey="4-2" icon={<ListIcon />}>
                  Danh mục
                </Nav.Item>
              </Link>
              <Link href="/admin/product/attribute" passHref>
                <Nav.Item eventKey="4-2" icon={<StorageIcon />}>
                  Biến thể
                </Nav.Item>
              </Link>
            </Nav.Menu>

            <Link href="/admin/users" passHref>
              <Nav.Item eventKey="4" icon={<PeoplesIcon />}>
                Users
              </Nav.Item>
            </Link>

            <Link href="/admin/order" passHref>
              <Nav.Item eventKey="4" icon={<PageIcon />}>
                Order
              </Nav.Item>
            </Link>

            <Link href="/admin/email" passHref>
              <Nav.Item eventKey="4" icon={<MessageIcon />}>
                Email
              </Nav.Item>
            </Link>

            <Link href="/admin/setting" passHref>
              <Nav.Item eventKey="4" icon={<GearIcon />}>
                Setting
              </Nav.Item>
            </Link>

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
