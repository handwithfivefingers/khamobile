import clsx from 'clsx'
import Image from 'next/image'
import React, { useState } from 'react'
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
}) {
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
        src={src}
        blurDataURL={
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcXw8AAgMBQLfkYc4AAAAASUVORK5CYII='
        }
        placeholder="blur"
        loading={'lazy'}
        loader={({ src, width, quality }) => {
          return engine ? process.env.API + src + `?w=${width}&q=${quality || 75}` : src
        }}
        objectFit={objectFit}
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
