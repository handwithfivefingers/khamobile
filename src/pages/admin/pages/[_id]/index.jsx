import clsx from 'clsx'
import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useState } from 'react'
import {
  Content,
  FlexboxGrid,
  Form,
  ButtonGroup,
  IconButton,
  Input,
  InputNumber,
  Panel,
  Button,
  PanelGroup,
} from 'rsuite'
import MinusIcon from '@rsuite/icons/Minus'
import PlusIcon from '@rsuite/icons/Plus'

import styles from './styles.module.scss'
import JsonViewer from 'component/UI/JsonViewer'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import { BsDashLg } from 'react-icons/bs'
import { useRouter } from 'next/router'
import PageService from 'service/admin/Page.service'
import { useCommonStore } from 'src/store/commonStore'

export default function SinglePage(props) {
  const [customerShow, setCustomerShow] = useState([])

  const router = useRouter()
  const [data, setData] = useState()
  const [pageData, setPageData] = useState({})
  const changeTitle = useCommonStore((state) => state.changeTitle)

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

  return (
    <Content className="rounded">
      <PanelGroup>
        {Object.keys(pageData).map((key, index) => {
          const currentSection = pageData[key]
          if (currentSection.type === 'multiple') {
            return (
              <Panel header={currentSection.title} collapsible defaultExpanded={index === 0 ? true : false}>
                <CardBlock className={'border-0'}>
                  <DynamicInput data={{ pageData, setPageData }} sectionName={key} key={[key, index].join('_')} />
                </CardBlock>
              </Panel>
            )
          }
        })}
      </PanelGroup>
    </Content>
  )
}

const DynamicInput = ({ data, sectionName }) => {
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

  console.log(sectionData)

  return (
    <Form formValue={sectionData}>
      <div className="row">
        <div className="col-12">
          <Button onClick={handleAdd}>Thêm</Button>
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
        <Button appearance="primary">Save Section</Button>
      </div>
    </Form>
  )
}

SinglePage.Admin = AdminLayout
