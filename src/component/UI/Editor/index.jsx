import React, { useEffect, useRef, useState } from 'react'
import MyUploadAdapter from './UploadAdapter'
import styles from './styles.module.scss'
function CKeditor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef()
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    if (!editorRef.current?.CKEditor && !editorRef.current?.ClassicEditor) {
      try {
        editorRef.current = {
          CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
          ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        }
      } catch (error) {
        console.log('editorRef.current error', error)
      }
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
          editor={ClassicEditor}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData()
            onChange(data)
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
  return (
    <>
      <CKeditor ref={ref} name="description" editorLoaded={editorLoaded} {...props} />
    </>
  )
})

export default Textarea
