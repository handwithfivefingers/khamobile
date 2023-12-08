import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useMemo, useState } from 'react'
import { Content, Panel, PanelGroup, Placeholder, SelectPicker, useToaster } from 'rsuite'
import CardBlock from 'component/UI/Content/CardBlock'
import { useRouter } from 'next/router'
import PageService from 'service/admin/Page.service'
import { message } from 'src/helper'
import { useCommonStore } from 'src/store/commonStore'
import dynamic from 'next/dynamic'

const DynamicCategoryComponentInput = dynamic(() => import('component/UI/Content/DynamicContent/Category'))
const DynamicImageComponentInput = dynamic(() => import('component/UI/Content/DynamicContent/Image'))
const DynamicProductComponentInput = dynamic(() => import('component/UI/Content/DynamicContent/Products'))
export default function SinglePage(props) {
  const router = useRouter()
  const [data, setData] = useState()
  const [pageData, setPageData] = useState([])
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const toaster = useToaster()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const { _id } = router.query
    if (_id) {
      getScreenData(_id)
    }
  }, [])

  const getScreenData = async (id) => {
    try {
      setLoading(true)
      const resp = await PageService.getPageById(id)
      const { data: respData } = resp.data
      const content = respData.content
      setPageData(content)
      setData(respData)
      changeTitle(respData?.title)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const renderSkeleton = useMemo(() => {
    let html = null

    if (loading) {
      html = (
        <PanelGroup>
          {[...Array(5).keys()].map((item) => {
            return (
              <Panel style={{ background: '#fff' }}>
                <Placeholder.Paragraph style={{ marginTop: 30 }} rows={5} graph="image" active />
              </Panel>
            )
          })}
        </PanelGroup>
      )
    }
    return html
  }, [loading])

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

  return (
    <Content className="rounded">
      {renderSkeleton}
      {!loading && (
        <PanelGroup>
          {pageData.map((page, index) => {
            return <DynamicInput panelIndex={index} data={page} key={Math.random()} onSubmit={handleSubmit} />
          })}
        </PanelGroup>
      )}
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
