import React, { useState, forwardRef, useEffect, memo, useRef } from 'react'
import { Button, Uploader } from 'rsuite'
import AvatarIcon from '@rsuite/icons/legacy/Avatar'
import { isEqual } from 'lodash'
function previewFile(file, callback) {
  const reader = new FileReader()
  reader.onloadend = () => {
    callback(reader.result)
  }
  reader.readAsDataURL(file)
}

const UploadMutiple = forwardRef((props, ref) => {
  return (
    <Uploader
      {...props}
      ref={ref}
      listType="picture-text"
      defaultFileList={props?.value}
      renderThumbnail={(file, fileElement) => {
        if (file.src) {
          return (
            <div className="rs-uploader-file-item-preview">
              <img role="presentation" src={process.env.API + file.src} />
            </div>
          )
        }
        return fileElement
      }}
    />
  )
})

const SingleUpload = forwardRef((props, ref) => {
  console.log('CustomUpload.SingleUpload = SingleUpload', props)
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (props.value?.src) {
      setSrc(props.value?.src)
    }
  }, [props.value])
  const imgRef = useRef()

  const renderIconPreview = () => {
    let html = null
    if (props.icon) {
      html = <AvatarIcon style={{ fontSize: 80, borderRadius: 8 }} />
    } else {
      html = (
        <div>
          <p>Upload</p>
          <code>
            <i>Kích thước tối đa </i> <br />
            <i>2Mb</i>
          </code>
        </div>
      )
    }
    return html
  }
  const renderImagePreview = () => {
    let html = null
    if (src) {
      html = (
        <img
          src={process.env.API + src}
          width="100%"
          height="100%"
          onError={() => (imgRef.current.src = '/400.png')}
          ref={imgRef}
        />
      )
    }
    return html
  }

  return (
    <Uploader
      ref={ref}
      listType="picture"
      {...props}
      onSuccess={(response, file) => {
        if (response.url) {
          setSrc(response.url)
        }
        if (props.onSuccess) props.onSuccess(response, file)
      }}
      fileListVisible={false}
    >
      <button style={{ width: 160, height: 160 }}>{renderImagePreview() || renderIconPreview()}</button>
    </Uploader>
  )
})

const CustomUpload = forwardRef((props, ref) => {
  if (props.group) {
    return <UploadMutiple ref={ref} {...props} />
  }
  return <SingleUpload ref={ref} {...props} />
})

CustomUpload.SingleUpload = SingleUpload
CustomUpload.UploadMutiple = UploadMutiple

const isPropsEqual = (prev, current) => {
  if (isEqual(prev.image, current.image) || isEqual(current.upload, prev.upload)) {
    return true
  }
  return false
}

export default memo(CustomUpload, isPropsEqual)
