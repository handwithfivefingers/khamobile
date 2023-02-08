import AdminLayout from 'component/UI/AdminLayout'
import CardBlock from 'component/UI/Content/CardBlock'
import ImageBlock from 'component/UI/Content/ImageBlock'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { BsClipboard } from 'react-icons/bs'
import { FcFolder } from 'react-icons/fc'
import { IconButton, Placeholder, Uploader } from 'rsuite'
import FileManagerService from 'service/admin/FileManager.service'
import styles from './styles.module.scss'
import ReactDOM from 'react-dom'
import CustomUpload from 'component/UI/Upload/CustomUpload'
export default function FileManger() {
  const [listFile, setListFile] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getScreenData()
  }, [])

  const getScreenData = async (folder = null) => {
    try {
      setLoading(true)
      let params = {}
      if (folder) {
        params.folder = folder
      }
      const resp = await FileManagerService.getListFileAndFolder(params)

      console.log(resp.data.data)
      setListFile(resp.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text) => {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    alert('Text copied to clipboard successfully!')
  }
  return (
    <>
      <div className="d-flex justify-content-center">
        <CustomUpload action={process.env.API + '/api/upload'} withCredentials={true} />
      </div>

      <CardBlock className="border-0">
        <div className={styles.grid}>
          {loading &&
            [...Array(18).keys()].map((item) => {
              return <Placeholder.Graph active className={styles.gridItem} />
            })}

          {listFile.map(({ folder, name, src }) => {
            return folder ? (
              <div className={styles.gridItem} onDoubleClick={() => getScreenData(src)}>
                <FcFolder style={{ fontSize: 32, cursor: 'pointer' }} />
                <p>{name}</p>
              </div>
            ) : (
              <div className={styles.gridItem}>
                <ImageBlock src={src} engine height="75%" objectFit="contain" />
                <ul className={styles.fileInformation}>
                  <li>
                    <span>Đường dẫn: </span>
                    <IconButton icon={<BsClipboard />} size="xs" appearance="primary" onClick={() => handleCopy(src)} />
                  </li>
                  <li className={styles.inlineText}>{src}</li>
                </ul>
              </div>
            )
          })}
        </div>
      </CardBlock>
    </>
  )
}

FileManger.Admin = AdminLayout
