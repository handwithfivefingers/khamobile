import React from 'react'
import Head from 'next/head'

const Helmet = ({ ...props }) => {
  return (
    <Head>
      <meta name="description" content={props.meta ? props.meta[2].metadata.description : ''} />
      <meta name="keyword" content={props.meta ? props.meta[2].metadata.keyword : ''} />
      <meta property="image" content={props.meta ? props.meta[2].metadata.image : ''} />
      <meta property="title" content={props.meta ? props.meta[2].metadata.title : ''} />

      <meta property="og:title" content={props.meta ? props.meta[2].metadata.title : ''} />
      <meta property="og:description" content={props.meta ? props.meta[2].metadata.keyword : ''} />
      <meta property="og:image" content={props.meta ? props.meta[2].metadata.image : ''} />
      <meta property="og:keyword" content={props.meta ? props.meta[2].metadata.keyword : ''} />

      <meta name="twitter:title" content={props.meta ? props.meta[2].metadata.title : ''} />
      <meta name="twitter:description" content={props.meta ? props.meta[2].metadata.keyword : ''} />
      <meta name="twitter:image" content={props.meta ? props.meta[2].metadata.image : ''} />
      <meta name="twitter:keyword" content={props.meta ? props.meta[2].metadata.keyword : ''} />
      <title>{props.meta ? props.meta[2].metadata.title : 'HEYOTRIP'}</title>
    </Head>
  )
}

export default React.memo(Helmet)
