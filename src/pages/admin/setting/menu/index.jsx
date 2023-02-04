import AdminLayout from 'component/UI/AdminLayout'
import CardBlock from 'component/UI/Content/CardBlock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, IconButton, List, Tree, Message, useToaster } from 'rsuite'
import PageService from 'service/admin/Page.service'
import { useCommonStore } from 'src/store/commonStore'
import FolderFillIcon from '@rsuite/icons/FolderFill'
import PageIcon from '@rsuite/icons/Page'
import CategoryService from 'service/admin/Category.service'
import { BiCategory } from 'react-icons/bi'
import { TbSquareRotated } from 'react-icons/tb'
import SettingService from 'service/admin/Setting.service'
import { CloseOutline } from '@rsuite/icons'
import { CgArrowsExpandDownRight, CgArrowsExpandUpLeft, CgArrowsExpandUpRight } from 'react-icons/cg'
const defaultData = [
  { text: 'Roses are red' },
  { text: 'Violets are blue' },
  { text: 'Sugar is sweet' },
  { text: 'And so are you' },
]

export default function SettingMenu() {
  const changeTitle = useCommonStore((state) => state.changeTitle)

  const [data, setData] = useState(defaultData)

  const [pageData, setPageData] = useState([])
  const [postData, setPostData] = useState([])
  const [prodCateData, setProCateData] = useState([])

  const [tabsKey, setTabsKey] = useState()

  const pageRef = useRef({})
  const toaster = useToaster()
  const message = (type, header) => <Message showIcon type={type} header={header} closable />

  useEffect(() => {
    changeTitle('Tùy chỉnh Menu')
    getPageData()
    getScreenData()
    setTabsKey(1)
  }, [])

  useEffect(() => {
    switch (tabsKey) {
      case 1:
        return getPageData()
      case 2:
        return getPostData()
      case 3:
        return getProdCateData()
    }
  }, [tabsKey])

  const getScreenData = async () => {
    try {
      const resp = await SettingService.getSetting()
      const screenData = resp.data?.data
      // let menuData = [...screenData.menu]

      // menuData = menuData.map((item) => ({
      //   dynamicRef: item.dynamicRef,
      //   name: item._id?.title || item._id?.name,
      //   slug: item._id?.slug,
      //   _id: item._id._id,
      // }))

      // screenData.menu = menuData
      setData(screenData)
    } catch (error) {
      console.log(error)
    }
  }

  const getPageData = async () => {
    try {
      const resp = await PageService.getPages()
      const mapData = resp.data.data.map(({ title, ...item }) => ({ ...item, name: title }))

      setPageData(mapData)
    } catch (error) {
      console.log(error)
    }
  }

  const getPostData = async () => {}

  const getProdCateData = async () => {
    try {
      const resp = await CategoryService.getProdCate({ type: 'parent' })
      setProCateData(resp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderTabs = () => {
    let html = null
    if (tabsKey === 1) {
      html = (
        <Tree
          data={pageData}
          labelKey="name"
          valueKey="_id"
          showIndentLine
          renderTreeNode={(node) => {
            return (
              <>
                {node.children ? <FolderFillIcon /> : <PageIcon />} {node.name}
              </>
            )
          }}
          onChange={(v) => (pageRef.current[tabsKey] = v)}
        />
      )
    } else if (tabsKey === 2) {
      html = (
        <Tree
          data={pageData?.map((page) => ({ label: page.title, value: page._id }))}
          showIndentLine
          renderTreeNode={(node) => {
            return (
              <>
                {node.children ? <FolderFillIcon /> : <PageIcon />} {node.label}
              </>
            )
          }}
          onChange={(v) => (pageRef.current = v)}
        />
      )
    } else if (tabsKey === 3) {
      html = (
        <Tree
          data={prodCateData}
          labelKey="name"
          valueKey="_id"
          showIndentLine
          renderTreeNode={(node) => {
            return (
              <>
                {node.children ? <BiCategory /> : <TbSquareRotated />} {node.name}
              </>
            )
          }}
          onChange={(v) => (pageRef.current[tabsKey] = v)}
        />
      )
    }

    return html
  }

  const handleAddItem = (tabs) => {
    let selectItem = pageRef.current?.[tabs]
    const dataMutation = tabs === 1 ? pageData : tabs === 2 ? postData : prodCateData

    let item = dataMutation.find((dataFilter) => dataFilter._id === selectItem)

    if (item) {
      setData((prev) => ({
        ...prev,
        menu: [...prev.menu, { name: item.name, _id: item._id, slug: item.slug, dynamicRef: item.dynamicRef }],
      }))
    }
  }

  const handleSave = async () => {
    try {
      const resp = await SettingService.updateSetting(data._id, data)
      toaster.push(message('success', resp?.data?.message), { placement: 'topEnd' })
    } catch (error) {
      console.log(error.message)
      toaster.push(message('error', error?.response?.data?.message || error?.message), {
        placement: 'topEnd',
      })
    }
  }

  const filterData = (listData, _id) => {
    const result = JSON.parse(JSON.stringify(listData))
    for (let [index, item] of listData.entries()) {
      if (item._id === _id) {
        result.splice(index, 1)
        break
      }
      if (item.children) {
        result[index].children = filterData(item.children, _id)
      }
    }
    return result
  }

  console.log(data.menu)
  return (
    <div className="row gy-2">
      <div className="col-12 d-flex" style={{ gap: 12 }}>
        <Button appearance="primary" onClick={() => setTabsKey(1)}>
          Page
        </Button>
        <Button appearance="primary" onClick={() => setTabsKey(2)}>
          Post
        </Button>
        <Button appearance="primary" onClick={() => setTabsKey(3)}>
          Product
        </Button>
      </div>
      <div className="col-4">
        <CardBlock>
          <Tree
            data={data?.menu}
            draggable
            defaultExpandAll
            showIndentLine
            labelKey="name"
            valueKey="_id"
            childrenKey="children"
            onDrop={({ createUpdateDataFunction }) => {
              let dropData = createUpdateDataFunction(data?.menu)
              setData((prev) => {
                prev.menu = dropData
                return { ...prev }
              })
            }}
            renderTreeNode={(node) => {
              return (
                <div className="d-flex justify-content-between align-items-center">
                  <span> {node.name}</span>
                  <div className="d-flex" style={{ gap: 4 }}>
                    <IconButton
                      appearance="subtle"
                      color="red"
                      icon={<CloseOutline style={{ fontSize: 16 }} />}
                      size="md"
                      onClick={() => {
                        let nextData = [...data?.menu]
                        nextData = filterData(nextData, node._id)
                        setData((prev) => ({ ...prev, menu: nextData }))
                      }}
                    />
                  </div>
                </div>
              )
            }}
          />
        </CardBlock>
      </div>
      <div className="col-8">
        <div className="row">
          <div className="col-12">
            <Button appearance="primary" onClick={() => handleAddItem(tabsKey)}>
              Thêm
            </Button>
          </div>
          <div className="col-12">{renderTabs()}</div>
        </div>
      </div>
      <div className="col-12">
        <Button appearance="primary" onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </div>
  )
}
SettingMenu.Admin = AdminLayout
