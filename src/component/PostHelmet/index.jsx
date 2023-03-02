import parse from 'html-react-parser'
import Head from 'next/head'
import React from 'react'
const PostHelmet = ({ seo, ...props }) => {
  return (
    <Head>
      {parse(seo ? seo.join('') : '')}
      {props?.children}
    </Head>
  )
}

export default React.memo(PostHelmet)
