import GjsEditor, { AssetsProvider, useEditor } from '@grapesjs/react'
import AdminLayout from 'component/UI/AdminLayout'
import grapesjs from 'grapesjs'
import { useEffect } from 'react'

function DemoDragAndDrop() {
  const onEditor = (editor) => {
    console.log('Editor loaded', { editor })
    // pluginsOpts={{
    //   'grapesjs-preset-webpage': {
    //     blocksBasicOpts: {
    //       blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
    //       flexGrid: 1,
    //     },
    //     blocks: ['link-block', 'quote', 'text-basic'],
    //   },
    // }}
    // editor.c
  }

  useEffect(() => {
    // grapesjs.init({
    //   pluginsOpts: {
    //     'grapesjs-preset-webpage': {
    //       blocksBasicOpts: {
    //         blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
    //         flexGrid: 1,
    //       },
    //       blocks: ['link-block', 'quote', 'text-basic'],
    //     },
    //   },
    // })
  }, [])

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: '100vh',
        storageManager: false,
      }}
      onEditor={onEditor}
    >
      {/* <AssetsProvider>
        {({ assets, select, close, Container }) => (
          <Container>
            asset
            <CustomAssetManager assets={assets} select={select} close={close} />
          </Container>
        )}
      </AssetsProvider> */}
    </GjsEditor>
  )
}

function CustomAssetManager({ assets, select }) {
  const editor = useEditor()

  const remove = (asset) => {
    editor.Assets.remove(asset)
  }

  return (
    <div className="grid grid-cols-3 gap-2 pr-2">
      {assets.map((asset) => (
        <div key={asset.getSrc()} className="relative group rounded overflow-hidden">
          <img className="display-block" src={asset.getSrc()} />
          <div className="flex flex-col items-center justify-end absolute top-0 left-0 w-full h-full p-5 bg-zinc-700/75 group-hover:opacity-100 opacity-0 transition-opacity">
            <button type="button" className={'border rounded px-2 py-1 w-full'} onClick={() => select(asset, true)}>
              Select
            </button>
            <button type="button" className="absolute top-2 right-2" onClick={() => remove(asset)}>
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

DemoDragAndDrop.Admin = AdminLayout

export default DemoDragAndDrop
