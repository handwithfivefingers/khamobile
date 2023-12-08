import React, { useImperativeHandle, useMemo, useRef } from 'react'
import { TINY_MCE_CONFIGS } from 'src/constant/tinymce.constant.js'
import { handleUploadImage } from './handleUploadImage'
import dynamic from 'next/dynamic'
import { Placeholder } from 'rsuite'
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((m) => m.Editor), {
  ssr: false,
  loading: () => <Placeholder.Graph active height={412} />,
})
export const TinyMceEditor = ({ data = '', name, forwardRef, ...rest }) => {
  const editorRef = useRef(null)
  useImperativeHandle(
    forwardRef,
    () => {
      return {
        getContent: (params) => editorRef.current?.getContent(params),
        setContent: (value) => editorRef.current?.setContent(value),
      }
    },
    [forwardRef],
  )
  const convertURL = (url, node, on_save, name) => {
    let nextURL = url
    // if (node === 'img' && name === 'src') {
    //   const regx = new RegExp('https://api.truyenmai.com', 'g')
    //   const wpRegx = new RegExp('https://truyenmai.com/wp-content/uploads', 'g')
    //   if (nextURL.match(regx)) {
    //     const newNext = nextURL.replace('https://api.truyenmai.com/public', '')
    //     nextURL = imageLoader({ src: newNext, width: '100%', quality: 80, env: true, basePath: setting?.slug })
    //   } else if (nextURL.match(wpRegx)) {
    //     const newNext = nextURL.replace('https://truyenmai.com/wp-content/uploads', '')
    //     nextURL = imageLoader({ src: newNext, width: '100%', quality: 80, env: true, basePath: setting?.slug })
    //   }
    // }
    return nextURL
  }

  const configs = {
    ...TINY_MCE_CONFIGS.inline,
    images_upload_handler: handleUploadImage,
    urlconverter_callback: convertURL,
  }

  // return useMemo(() => {
  //   return (
  //     <Editor
  //       id={`tm-tinymce-editor`}
  //       tinymceScriptSrc={'/tinymce/tinymce.min.js'}
  //       onInit={(evt, editor) => (editorRef.current = editor)}
  //       initialValue={data}
  //       init={configs}
  //     />
  //   )
  // }, [data])
  return (
    <Editor
      id={`tm-tinymce-editor-${name}`}
      tinymceScriptSrc={'/tinymce/tinymce.min.js'}
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={data}
      init={configs}
    />
  )
}
