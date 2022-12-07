import { NextResponse } from 'next/server'
import axios from 'configs/axiosInstance'

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
export async function middleware(request) {
  console.log('incoming middleware')
  const response = NextResponse.next()

  if (request.nextUrl.pathname.includes('/admin')) {
    // const resp = await axios.post('/authenticate')
    const requestHeaders = new Headers(request.headers)

    const resp = await fetch('http://localhost:3002/api/authenticate', {
      method: 'POST',
      credentials: 'include',
      withCredentials: true,
      headers: requestHeaders,
    })
    if (resp.status !== 401) {
      return response
    } else return NextResponse.redirect(new URL('/login', request.url))
  }
}
