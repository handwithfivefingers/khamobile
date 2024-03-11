import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import styles from './styles.module.scss'

const ImageBlock = ({
  src,
  alt,
  className,
  width,
  height,
  engine,
  priority,
  objectFit = 'cover',
  modal = false,
  loading,
  fitImage,
  ...props
}) => {
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
      [styles.fitImage]: fitImage,
      [styles.imgHover]: options?.hover,
      [styles.border]: options?.border,
    },
  ])

  const openImageViewer = (status) => {
    setState(status)
  }
  const getLoader = ({ src, width, quality }) => {
    if (src.match(/400.png/)) return src
    let newSrc = engine ? process.env.API + src + `?w=${width}&q=${quality || 50}` : src
    return newSrc
  }
  return (
    <div className={imgClass} style={{ '--w-offset': width || 1024, '--h-offset': height || (1024 / 16) * 9 }}>
      <Image
        alt={alt || '...'}
        blurDataURL={'/blur.jpg'}
        placeholder="blur"
        src={img}
        onClick={() => openImageViewer(true)}
        loader={getLoader}
        loading={priority ? 'eager' : loading || 'lazy'}
        priority={priority}
        style={{ objectFit: objectFit }}
        width={width || 1024}
        height={height || (1024 / 16) * 9}
        onError={() => setImg('/400.png')}
        // style
        {...props}
      />
      {modal && (
        <Modal open={state} onClose={() => setState(false)} size="md" style={{ background: 'transparent' }}>
          <Modal.Body>
            <div className="relative w-full max-w-[90vw] before:content-[''] before:block before:pb-[100%]">
              <Image
                className={`absolute top-0 left-0 w-full h-full object-cover`}
                alt={alt || '...'}
                blurDataURL={'/blur.jpg'}
                placeholder="blur"
                src={src}
                onClick={() => openImageViewer(true)}
                loader={getLoader}
                loading={priority ? 'eager' : loading || 'lazy'}
                priority={priority}
                style={{ objectFit: objectFit }}
                width={width || 1024}
                height={height || (1024 / 16) * 9}
                onError={() => setImg('/400.png')}
                {...props}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

export default ImageBlock
