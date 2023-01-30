import React, { useEffect, useState } from 'react'

export default function BaoKim(props) {
  const unique_id = new Date().getTime()

  useEffect(() => {
    initScript()
  }, [props])

  const initScript = () => {
    const allScript = document.querySelectorAll('script')

    for (let i = 0; i < allScript.length; i++) {
      if (allScript[i].src.includes('/assets/script/baokim.js')) {
        document.body.removeChild(allScript[i])
      }
    }
    const script = document.createElement('script')

    script.src = '/assets/script/baokim.js'

    document.body.appendChild(script)
  }

  return (
    <>
      <div className={'bk-btn'} />
    </>
  )
}
