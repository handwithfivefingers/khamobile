import React, { useEffect, useState } from 'react'
import Script from 'next/script'

export default function BaoKim() {
  const unique_id = new Date().getTime()

  return (
    <>
      <div className={'bk-btn'} /> <div id="bk-modal"></div>
      <>
        <Script
          id={unique_id}
          src={`//pc.baokim.vn/js/bk_plus_v2.popup.js?v=${unique_id}`}
          onLoad={() => {
            // execute code after script load
            console.log('script load complete')
          }}
        />
      </>
    </>
  )
}
