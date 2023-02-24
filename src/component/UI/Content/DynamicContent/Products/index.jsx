import { useEffect, useState } from 'react'
import { BsPhone } from 'react-icons/bs'
import { Button, Form, Tag, TagPicker } from 'rsuite'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import { useCommonStore } from 'src/store'
import Card from '../../Card'
import CustomSlider from '../../Slider'
export default function DynamicProductComponentInput({ data, sectionName, onSubmit }) {
  const { pageData, setPageData } = data
  const currentSection = pageData[sectionName]

  const [sectionData, setSectionData] = useState(currentSection)
  const [activeProduct, setActiveProduct] = useState([])
  const { product } = useCommonStore((state) => state)
  useEffect(() => {
    if (product) {
      const nextProduct = []
      for (let _id of sectionData?.data) {
        let item = product.find((prod) => prod._id === _id)
        if (item) {
          nextProduct.push(item)
        }
      }
      setActiveProduct(nextProduct)
    }
  }, [product])

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

  return (
    <Form formValue={sectionData}>
      <div className="row">
        <div className="col-12">
          <TagPicker
            data={product}
            valueKey={'_id'}
            labelKey={'title'}
            onSelect={addProducts}
            cleanable={false}
            block
            renderValue={(values, items, tags) => {
              return values.map((tag, index) => (
                <Tag key={tag}>
                  <BsPhone /> {items[index]?.title}
                </Tag>
              ))
            }}
            value={sectionData.data?.map((item) => item?._id || item)}
          />
        </div>
        <div className="col-12">
          <CustomSlider type={TYPE_CAROUSEL.MUTI} slidesToShow={5}>
            {activeProduct.map((item, index) => {
              return (
                <Card
                  imgSrc={(item?.image?.[0]?.src && item.image?.[0]?.src) || ''}
                  cover
                  title={item?.title}
                  price={item?.price}
                  type={item?.type}
                  slug={`/product/${item?.slug}`}
                  _id={item?._id}
                  key={[Math.random(), item?._id, index]}
                  border
                  hover
                />
              )
            })}
            {sectionData.data?.length < 5
              ? Array.from(Array(5 - sectionData.data?.length).keys()).map((item) => <h2>{item}</h2>)
              : ''}
          </CustomSlider>
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
