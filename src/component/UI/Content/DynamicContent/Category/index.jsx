import { useEffect, useState } from 'react'
import { BsPhone } from 'react-icons/bs'
import { Button, Cascader, Form, SelectPicker, Tag, TagPicker } from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import { useCommonStore } from 'src/store'
import Card from '../../Card'
import Catalog from '../../Catalog'
import CustomSlider from '../../Slider'
export default function DynamicCategoryComponentInput({ data, sectionName, onSubmit }) {
  const { pageData, setPageData } = data
  const currentSection = pageData[sectionName]

  const [sectionData, setSectionData] = useState(currentSection.data)

  const [position, setPosition] = useState('ltr')

  const [catelogData, setCatelogData] = useState([])

  const { productCategory, product } = useCommonStore((state) => state)

  const handleSubmit = () => {
    onSubmit(sectionName, sectionData)
  }

  const addProducts = (value, itemData, event) => {
    const nextObject = []
    for (let _id of value) {
      let item = product.find((prod) => prod._id === _id)
      nextObject.push(item)
    }
    setSectionData(nextObject)
  }

  const onClean = (e) => {
    setSectionData([])
  }

  const handleSelectCategory = (value, itemData, event) => {
    console.log(value)
    let { name, image } = value
    const formatData = {
      name,
      image,
      child: [],
    }
    setCatelogData(formatData)
  }
  console.log(catelogData)
  return (
    <Form formValue={sectionData} onChange={(value) => console.log(value)}>
      <div className="row gx-2 gy-2">
        <div className="col-12">
          <div className="d-flex align-items-center" style={{ gap: 12 }}>
            <div className="d-flex align-items-center" style={{ gap: 12 }}>
              <span>Vị trí</span>
              <SelectPicker
                data={[
                  { label: 'Phải', value: 'rtl' },
                  { label: 'Trái', value: 'ltr' },
                ]}
                onSelect={(value) => setPosition(value)}
              />
            </div>
            <div className="d-flex align-items-center" style={{ gap: 12 }}>
              <span>Danh mục</span>
              <Cascader
                data={productCategory}
                parentSelectable
                style={{ width: 224 }}
                labelKey="name"
                valueKey="_id"
                childrenKey="child"
                onSelect={handleSelectCategory}
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="d-flex align-items-center w-100">
            <span style={{ width: '100px' }}>Sản phẩm</span>
            <TagPicker
              data={product}
              valueKey={'_id'}
              labelKey={'title'}
              onSelect={addProducts}
              onClean={onClean}
              cleanable={false}
              onClose={() => console.log('closed')}
              block
              renderValue={(values, items, tags) => {
                return values.map((tag, index) => (
                  <Tag key={tag}>
                    <BsPhone /> {items[index]?.title}
                  </Tag>
                ))
              }}
              value={sectionData.map((item) => item._id || item)}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="col-12">
          <Catalog data={catelogData} direction={position} />
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Button appearance="primary" onClick={handleSubmit}>
          Save Section
        </Button>
      </div>
    </Form>
  )
}
