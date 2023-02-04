import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import MyUploadAdapter from './UploadAdapter'
import styles from './styles.module.scss'
function CKeditorComponent({ onChange, editorLoaded, name, value, className }) {
  const [editorValue, setEditorValue] = useState(value)

  const editorRef = useRef()

  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    if (!editorRef.current?.CKEditor && !editorRef.current?.ClassicEditor) {
      try {
        editorRef.current = {
          CKEditor: require('@ckeditor/ckeditor5-react')?.CKEditor,
          ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        }
      } catch (error) {
        console.log('editorRef.current error', error)
      }
    }

    if (value) {
      setEditorValue(value)
    }

    return () => {
      editorRef.current = null
    }
  }, [])

  return (
    <>
      {editorLoaded ? (
        <CKEditor
          type=""
          name={name}
          editor={editorRef.current?.ClassicEditor}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
          data={editorValue}
          onChange={(event, editor) => {
            const data = editor.getData()
            onChange(data)
          }}
          onReady={() => {
            setEditorValue(value)
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </>
  )
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader)
  }
}

const Textarea = React.forwardRef((props, ref) => {
  const [editorLoaded, setEditorLoaded] = useState(false)

  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  return <CKeditorComponent ref={ref} name="description" editorLoaded={editorLoaded} {...props} />
})

export default Textarea
