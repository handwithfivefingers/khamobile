import { NextResponse } from 'next/server'
import axios from 'configs/axiosInstance'

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
export async function middleware(request) {
  if (request.nextUrl.pathname.includes('/admin')) {
    // const resp = await axios.post('/authenticate')

    const requestHeaders = new Headers(request.headers)

    const path = `${process.env.API}/api/authenticate`

    const resp = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      withCredentials: true,
      headers: requestHeaders,
    })

    // const resp = await axios.post('/api/authenticate')
    console.log('middleware ---> ', resp)
    if (resp.status === 200) {
      return NextResponse.next()
    } else return NextResponse.redirect(new URL('/login', request.url))
  }
}
