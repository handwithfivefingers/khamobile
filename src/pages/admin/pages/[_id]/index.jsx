import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useState } from 'react'
import { Button, Content, Form, IconButton, Panel, PanelGroup, SelectPicker, Stack, useToaster } from 'rsuite'

import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import { useRouter } from 'next/router'
import { BsDashLg } from 'react-icons/bs'
import PageService from 'service/admin/Page.service'
import { message } from 'src/helper'
import { useCommonStore } from 'src/store/commonStore'
import styles from './styles.module.scss'
import DynamicImageComponentInput from 'component/UI/Content/DynamicContent/Image'
import DynamicProductComponentInput from 'component/UI/Content/DynamicContent/Products'
import DynamicCategoryComponentInput from 'component/UI/Content/DynamicContent/Category'

export default function SinglePage(props) {
  const [customerShow, setCustomerShow] = useState([])

  const router = useRouter()
  const [data, setData] = useState()
  const [pageData, setPageData] = useState([])
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const toaster = useToaster()
  useEffect(() => {
    const { _id } = router.query
    if (_id) {
      getScreenData(_id)
    }
  }, [])

  const getScreenData = async (id) => {
    try {
      const resp = await PageService.getPageById(id)
      const { data: respData } = resp.data
      const content = respData.content
      setPageData(content)
      setData(respData)
      changeTitle(respData?.title)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (sectionData, sectionIndex) => {
    try {
      const nextState = [...pageData]
      nextState[sectionIndex] = sectionData
      const resp = await PageService.updatePage(data._id, {
        content: nextState,
      })

      toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
    } catch (error) {
      console.log(error)
      toaster.push(message('error', error.response?.data?.message || error.response?.message), {
        placement: 'topEnd',
      })
    } finally {
      getScreenData(router.query._id)
    }
  }
  console.log(pageData)

  return (
    <Content className="rounded">
      <PanelGroup>
        {pageData.map((page, index) => {
          return (
            <DynamicInput
              panelIndex={index}
              data={page}
              key={Math.random()}
              onSubmit={handleSubmit}
            />
          )
        })}
      </PanelGroup>
    </Content>
  )
}

const DynamicInput = ({ data, onSubmit, panelIndex }) => {


  return (
    <Panel
      header={
        <div className="w-100">
          <div className="d-flex justify-content-start align-items-center">
            <span style={{ width: '250px' }}>{data.title}</span>
            <div onClick={(e) => e.stopPropagation()}>
              <SelectPicker
                data={[
                  { label: 'Home Slider', value: 'HomeSlider' },
                  { label: 'Slider Hình ảnh', value: 'ImageSlider' },
                  { label: 'Hình ảnh', value: 'Image' },
                  { label: 'Sản phẩm', value: 'Product' },
                  { label: 'Danh mục', value: 'ProductCategory' },
                ]}
                value={data.type}
                className="px-5"
              />
            </div>
          </div>
        </div>
      }
      collapsible
      defaultExpanded={panelIndex === 0 ? true : false}
    >
      <CardBlock className={'border-0'}>
        {data.type === 'HomeSlider' ? (
          <DynamicImageComponentInput onSubmit={onSubmit} data={data} pageIndex={panelIndex} />
        ) : (
          ''
        )}
        {data.type === 'Image' ? (
          <DynamicImageComponentInput onSubmit={onSubmit} data={data} max pageIndex={panelIndex} />
        ) : (
          ''
        )}
        {data.type === 'ImageSlider' ? (
          <DynamicImageComponentInput onSubmit={onSubmit} data={data} pageIndex={panelIndex} />
        ) : (
          ''
        )}
        {data.type === 'Product' ? (
          <DynamicProductComponentInput onSubmit={onSubmit} data={data} pageIndex={panelIndex} />
        ) : (
          ''
        )}
        {data.type === 'ProductCategory' ? (
          <DynamicCategoryComponentInput onSubmit={onSubmit} data={data} pageIndex={panelIndex} />
        ) : (
          ''
        )}
      </CardBlock>
    </Panel>
  )
}

SinglePage.Admin = AdminLayout
