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
  const [pageData, setPageData] = useState({})
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

      if (content) {
        setPageData(content)
      }
      setData(respData)
      changeTitle(respData?.title)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (sectionName, sectionData) => {
    try {
      const nextState = JSON.parse(JSON.stringify(pageData))
      nextState[sectionName].data = sectionData
      const resp = await PageService.updatePage(data._id, { content: nextState })
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
      <PanelGroup>
        {Object.keys(pageData).map((key, index) => {
          // const currentSection = pageData[key]
          // if (currentSection.type === 'multiple') {
          //   return (
          //     <Panel header={currentSection.title} collapsible defaultExpanded={index === 0 ? true : false}>
          //       <CardBlock className={'border-0'}>
          //         <DynamicInput
          //           data={{ pageData, setPageData }}
          //           sectionName={key}
          //           key={[key, index].join('_')}
          //           onSubmit={handleSubmit}
          //         />
          //       </CardBlock>
          //     </Panel>
          //   )
          // }
          return (
            <DynamicInput
              panelIndex={index}
              data={{ pageData, setPageData }}
              sectionName={key}
              key={[key, index].join('_')}
              onSubmit={handleSubmit}
            />
          )
        })}
      </PanelGroup>
    </Content>
  )
}

const DynamicInput = ({ data, sectionName, onSubmit, panelIndex }) => {
  const { pageData, setPageData } = data
  const currentSection = pageData[sectionName]

  const [sectionData, setSectionData] = useState(currentSection.data)

  const handleAdd = () => {
    const nextState = [...sectionData]
    nextState.push('')
    setSectionData(nextState)
  }
  const handleRemove = (index) => {
    const nextState = [...sectionData]
    nextState.splice(index, 1)
    setSectionData(nextState)
  }

  const handleInputchange = (value, index) =>
    setSectionData((prev) => {
      let current = [...prev]
      current[index] = value
      return current
    })

  // console.log(sectionData)

  const handleSubmit = () => {
    onSubmit(sectionName, sectionData)
  }

  return (
    <Panel
      header={
        <div className="w-100">
          <div className="d-flex justify-content-start align-items-center">
            <span style={{ width: '250px' }}>{currentSection.title}</span>
            <div onClick={(e) => e.stopPropagation()}>
              <SelectPicker
                data={[
                  { label: 'Home Slider', value: 'HomeSlider' },
                  { label: 'Slider Hình ảnh', value: 'ImageSlider' },
                  { label: 'Hình ảnh', value: 'Image' },
                  { label: 'Sản phẩm', value: 'Products' },
                  { label: 'Danh mục', value: 'Category' },
                ]}
                value={currentSection.type}
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
        {/* <Form formValue={sectionData}>
          <div className="row">
            <div className="col-12">
              <Stack>
                <Button onClick={handleAdd}>Thêm</Button>
              </Stack>
            </div>
            {sectionData?.map((item, index) => {
              return (
                <div className="col-6 ">
                  <div className={styles.col}>
                    <KMInput
                      name={[sectionName, index].join('')}
                      label={sectionName + `_${index + 1}`}
                      onChange={(value) => handleInputchange(value, index)}
                      value={item}
                    />
                    <div className={styles.icon}>
                      <IconButton icon={<BsDashLg />} onClick={() => handleRemove(index)} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="d-flex justify-content-end">
            <Button appearance="primary" onClick={handleSubmit}>
              Save Section
            </Button>
          </div>
        </Form> */}
        {currentSection.type === 'HomeSlider' ? (
          <DynamicImageComponentInput onSubmit={onSubmit} sectionName={sectionName} data={data} />
        ) : (
          ''
        )}
        {currentSection.type === 'Image' ? (
          <DynamicImageComponentInput onSubmit={onSubmit} sectionName={sectionName} data={data} max />
        ) : (
          ''
        )}
        {currentSection.type === 'ImageSlider' ? (
          <DynamicImageComponentInput onSubmit={onSubmit} sectionName={sectionName} data={data} />
        ) : (
          ''
        )}
        {currentSection.type === 'Products' ? (
          <DynamicProductComponentInput onSubmit={onSubmit} sectionName={sectionName} data={data} />
        ) : (
          ''
        )}
        {currentSection.type === 'Category' ? (
          <DynamicCategoryComponentInput onSubmit={onSubmit} sectionName={sectionName} data={data} />
        ) : (
          ''
        )}
      </CardBlock>
    </Panel>
  )
}

SinglePage.Admin = AdminLayout
