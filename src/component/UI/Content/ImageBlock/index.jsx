import clsx from 'clsx'
import React, { useState } from 'react'
import { Modal } from 'rsuite'
import styles from './styles.module.scss'

export default function ImageBlock({ src, alt, className, bordered, height }) {
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
      <img src={src} alt={alt} onClick={() => openImageViewer(true)} />

      <Modal open={state} onClose={() => setState(false)} size="lg" style={{ background: 'transparent' }}>
        <Modal.Body>
          <img src={src} alt={alt} style={{ width: '100%', maxWidth: '1024px' }} />
        </Modal.Body>
      </Modal>
    </div>
  )
}
