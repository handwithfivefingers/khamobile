import { NextResponse } from 'next/server'
import axios from 'configs/axiosInstance'

export const config = {
  matcher: '/admin/:path*',
}
export async function middleware(request) {
  // if (request.nextUrl.pathname.includes('/admin')) {
  // const resp = await axios.post('/authenticate')

  const requestHeaders = new Headers(request.headers)

  const path = `${process.env.API}/api/authenticate`

  const resp = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    withCredentials: true,
    headers: requestHeaders,
  })

  const data = await resp.json()

  console.log('middleware ---> ', data)

  if (data.authenticate) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
  // }
}
