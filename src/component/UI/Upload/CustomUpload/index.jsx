import React, { useState, forwardRef, useEffect, memo } from 'react'
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
            <div class="rs-uploader-file-item-preview">
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
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (props.value?.src) {
      setSrc(props.value?.src)
    }
  }, [props.value])
  console.log('SingleUpload', props)
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
      <button style={{ width: 120, height: 120 }}>
        {(src && <img src={process.env.API + src} width="100%" height="100%" />) || (
          <AvatarIcon style={{ fontSize: 80, borderRadius: 8 }} />
        )}
      </button>
    </Uploader>
  )
})

const CustomUpload = forwardRef((props, ref) => {
  if (props.group) {
    return <UploadMutiple ref={ref} {...props} />
  }

  return <SingleUpload ref={ref} {...props} />
})

const isPropsEqual = (prev, current) => {
  if (isEqual(prev.image, current.image) || isEqual(current.upload, prev.upload)) {
    return true
  }
  return false
}

export default memo(CustomUpload, isPropsEqual)
