import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { forwardRef } from 'react'
import Breadcrumb from 'rsuite/Breadcrumb'
import { PATH_ROUTER } from 'src/constant/path.constant'

const NavLink = forwardRef((props, ref) => {
  const { href, as, children, ...rest } = props
  return (
    <Link href={href} passHref {...rest}>
      {children}
    </Link>
  )
})

export default function KMBreadcrumb() {
  const router = useRouter()
  const [path, setPath] = useState([
    {
      href: '/admin',
      name: 'Admin',
      active: true,
    },
  ])

  useEffect(() => {
    getBreadcrumbs(router.asPath)
  }, [router.asPath])

  const getBreadcrumbs = (path) => {
    const nestPath = path.split('/admin')[1]
    const item = PATH_ROUTER['/admin'].child[nestPath]
    const newNav = [
      {
        href: '/admin',
        name: 'Admin',
        active: true,
      },
    ]
    if (item) {
      newNav[0].active = false
      newNav.push({
        href: '/admin' + nestPath,
        name: item,
        active: true,
      })
    }
    setPath(newNav)
  }

  return (
    <Breadcrumb>
      <Breadcrumb.Item as={NavLink} href="/">
        Home
      </Breadcrumb.Item>

      {path?.map((item, index) => {
        return (
          <Breadcrumb.Item as={NavLink} href={item.href} active={item.active} key={`${item.href}_${index}`}>
            {item.name}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
