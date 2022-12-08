import { NextResponse } from 'next/server'
import axios from 'configs/axiosInstance'

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
export async function middleware(request) {
  console.log('incoming middleware', request.nextUrl.pathname.includes('/admin'))

  if (request.nextUrl.pathname.includes('/admin')) {
    const requestHeaders = new Headers(request.headers)

    const path = `${process.env.API}/api/authenticate`

    const resp = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      withCredentials: true,
      headers: requestHeaders,
    })
    
    if (resp.status !== 401) {
      return NextResponse.next()
    } else return NextResponse.redirect(new URL('/login', request.url))
  }
}
