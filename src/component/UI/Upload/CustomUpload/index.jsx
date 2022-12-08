import React, { useState, forwardRef, useEffect } from 'react'
import { Button, Uploader } from 'rsuite'
import AvatarIcon from '@rsuite/icons/legacy/Avatar'
function previewFile(file, callback) {
  const reader = new FileReader()
  reader.onloadend = () => {
    callback(reader.result)
  }
  reader.readAsDataURL(file)
}

// const CustomUpload = forwardRef((props, ref) => {
//   const [uploading, setUploading] = useState(false)

//   const [fileInfo, setFileInfo] = useState(null)

//   const [fileList, setFileList] = useState([])

//   useEffect(() => {
//     if (props.group) {
//       setFileList(props?.value?.map((item) => ({ ...item, url: item.src, name: item._id })))
//     } else if (props.file) {
//       if (props.file[0]) {
//         if (props.file?.[0]?.blobFile) {
//           previewFile(props.file?.[0]?.blobFile, (value) => {
//             setFileInfo(value)
//           })
//         } else {
//           setFileInfo(props.file[0]?.filename)
//         }
//       }
//     }
//   }, [props])

//   return (
//     <>
//       {props?.group ? (
//         <Uploader
//           ref={ref}
//           name="upload"
//           {...props}
//           listType="picture-text"
//           fileList={fileList}
//           renderFileInfo={(file, fileElement) => {
//             return (
//               <>
//                 <span>File Name: {file.name || ''}</span>
//                 <p>File URL: {file.url}</p>
//               </>
//             )
//           }}
//         />
//       ) : (
//         <Uploader
//           ref={ref}
//           fileListVisible={false}
//           name="upload"
//           {...props}
//           onChange={(file) => {
//             setFileList(file)
//             console.log(file)
//           }}
//         >
//           <button style={{ width: 150, height: 150 }}>
//             {uploading && <Loader backdrop center />}
//             {fileInfo ? <img src={fileInfo} width="100%" height="100%" /> : <AvatarIcon style={{ fontSize: 80 }} />}
//           </button>
//         </Uploader>
//       )}
//     </>
//   )
// })

const UploadMutiple = forwardRef((props, ref) => {
  console.log(props.value)
  return (
    <Uploader
      ref={ref}
      listType="picture-text"
      {...props}
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
  const [file, setFile] = useState()

  const [fileInfo, setFileInfo] = useState()

  useEffect(() => {
    if (props?.value && typeof props.value?.src === 'string') {
      setFileInfo(props?.value?.src)
    } else if (props?.value && props.value.blobFile instanceof Blob) {
      previewFile(props.value.blobFile, (value) => {
        setFileInfo(value)
      })
    }
  }, [props?.value])

  return (
    <Uploader
      ref={ref}
      listType="picture"
      {...props}
      onChange={(file) => {
        const [newFiles] = file.slice(-1)
        setFile(newFiles)
        props.onChange(newFiles)
      }}
      fileListVisible={false}
    >
      <button style={{ width: 120, height: 120 }}>
        {fileInfo ? (
          <img
            src={`${(typeof props.value?.src === 'string' && process.env.API) || ''}${fileInfo}`}
            width="100%"
            height="100%"
          />
        ) : (
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

export default CustomUpload
