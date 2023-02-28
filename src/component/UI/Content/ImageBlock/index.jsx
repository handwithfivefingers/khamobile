import clsx from 'clsx'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'rsuite'
import { imageLoader } from 'src/helper'
import styles from './styles.module.scss'

const ImageBlock = ({ src, alt, className, height, engine, objectFit = 'cover', modal = false, ...props }) => {
  const [img, setImg] = useState(src)
  const [state, setState] = useState(false)
  const { options } = props

  useEffect(() => {
    if (src) {
      setImg(src)
    } else {
      setImg('/400.png')
    }
  }, [src])

  const imgClass = clsx([
    styles.img,
    className,
    {
      [styles.imgHover]: options?.hover,
      [styles.border]: options?.border,
    },
  ])

  const openImageViewer = (status) => {
    setState(status)
  }

  return (
    <div className={imgClass} style={{ '--height-offset': height ? height : '100%' }}>
      <Image
        alt={alt}
        onClick={() => openImageViewer(true)}
        layout="fill"
        src={img}
        blurDataURL={
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcXw8AAgMBQLfkYc4AAAAASUVORK5CYII='
        }
        placeholder="blur"
        loading={'lazy'}
        loader={({ src, width, quality }) => {
          let newSrc = engine ? process.env.API + src + `?w=${width}&q=${quality || 50}` : src
          return newSrc
        }}
        objectFit={objectFit}
        onError={() => {
          setImg('/400.png')
        }}
      />
      {modal && (
        <Modal open={state} onClose={() => setState(false)} size="md" style={{ background: 'transparent' }}>
          <Modal.Body>
            <img src={engine ? process.env.API + src : src} alt={alt} style={{ width: '100%', maxWidth: '1024px' }} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

export default ImageBlock
