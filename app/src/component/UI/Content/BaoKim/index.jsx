import React, { useEffect, memo } from 'react'
import isEqual from 'lodash/isEqual'

const BaoKim = (props) => {
  // const baokimScript =
  //   process.env.NODE_ENV !== 'development' ? 'https://pc.baokim.vn/js/bk_plus_v2.popup.js' : '/assets/script/baokim.js'
  const baokimScript = '/assets/script/baokim.js'
  useEffect(() => {
    initScript()
  }, [props])

  const initScript = () => {
    const allScript = document.querySelectorAll('script')

    const scriptLength = allScript.length

    for (let i = 0; i < scriptLength; i++) {
      if (allScript[i].src.includes(baokimScript)) {
        document.body.removeChild(allScript[i])
      }
    }
    const script = document.createElement('script')

    script.src = baokimScript

    script.onload = () => {
      document.querySelector(
        '.bk-btn-paynow',
      ).innerHTML = `<strong>Mua ngay (Bảo Kim)</strong><span>Giao tận nơi hoặc nhận tại cửa hàng</span>`
    }
    document.body.appendChild(script)
  }

  return (
    <>
      <div className={'bk-btn'} />
    </>
  )
}

function isEqualProps(prevProps, nextProps) {
  return !isEqual(prevProps, nextProps)
}
export default memo(BaoKim, isEqualProps)
