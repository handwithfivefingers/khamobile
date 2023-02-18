import clsx from 'clsx'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Modal } from 'rsuite'
import { imageLoader } from 'src/helper'
import styles from './styles.module.scss'

export default function ImageBlock({
  src,
  alt,
  className,
  bordered,
  height,
  engine,
  objectFit = 'cover',
  modal = false,
  ...props
}) {
  const imageRef = useRef(src)

  const [state, setState] = useState(false)

  const imgClass = clsx([
    styles.img,
    className,
    {
      [styles.border]: bordered,
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
        src={imageRef.current}
        blurDataURL={
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcXw8AAgMBQLfkYc4AAAAASUVORK5CYII='
        }
        placeholder="blur"
        loading={'lazy'}
        loader={({ src, width, quality }) => {
          return engine ? process.env.API + src + `?w=${width}&q=${quality || 50}` : src
        }}
        objectFit={objectFit}
        ref={imageRef}
        onError={() => (imageRef.current = '/400.png')}
        // {...props}
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
