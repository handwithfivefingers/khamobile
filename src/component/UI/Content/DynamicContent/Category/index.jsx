import Products from 'pages/admin/product'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { BsPhone } from 'react-icons/bs'
import { Button, Cascader, Form, Modal, SelectPicker, Tag, TagPicker } from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import { useCommonStore } from 'src/store'
import Card from '../../Card'
import Catalog from '../../Catalog'
import CustomSlider from '../../Slider'
import styles from './styles.module.scss'
export default function DynamicCategoryComponentInput({ data, sectionName, onSubmit }) {
  const { pageData, setPageData } = data

  const [sectionData, setSectionData] = useState(pageData[sectionName])

  const [catelogData, setCatelogData] = useState([])

  const { productCategory } = useCommonStore((state) => state)

  const [activeCategory, setActiveCategory] = useState('')
  const toolbarRef = useRef()

  const [config, setConfig] = useState({
    position: pageData[sectionName].config?.position || 'ltr',
    moreLink: [],
  })

  useEffect(() => {
    if (productCategory) {
      let item = productCategory.find((cate) => cate.name === sectionData.title)
      if (item) {
        let { name, image, _id } = item
        const formatData = {
          _id,
          name,
          image,
        }
        setActiveCategory(_id)
        setCatelogData((prev) => ({ ...prev, ...formatData }))
      }
    }
  }, [productCategory])

  const handleSubmit = () => {
    const formatData = { ...sectionData }
    formatData.config = config
    console.log(formatData)
  }

  const handleSelectCategory = ({ category, productFilter }) => {
    setSectionData((prev) => ({ ...prev, title: category.name }))
    setCatelogData(category)
  }

  const handleChangeCategory = (value) => {
    setActiveCategory(value)
  }

  const handleSetProduct = ({ rawProduct, formatProduct }) => {
    // raw mean all field Product
    // format mean just list id of array
    setCatelogData((prev) => ({ ...prev, child: rawProduct }))
    setSectionData((prev) => ({ ...prev, data: formatProduct }))
  }

  return (
    <>
      <Toolbar
        position={{
          pos: config.position,
          setPos: (value) => setConfig((prev) => ({ ...prev, position: value })),
        }}
        category={{
          categoryName: sectionData.title,
          activeCategory: activeCategory,
          productCategory: productCategory,
          setSelectCategory: handleSelectCategory,
          handleChangeCategory: handleChangeCategory,
        }}
        productProps={{
          productSelect: sectionData.data,
          setProduct: handleSetProduct,
        }}
        ref={toolbarRef}
      />
      <Form formValue={sectionData}>
        <div className="row gx-2 gy-2">
          <div className="col-12">
            <Catalog data={catelogData} direction={config.position} />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Button appearance="primary" onClick={handleSubmit}>
            Save Section
          </Button>
        </div>
      </Form>
    </>
  )
}

const Toolbar = forwardRef(({ position, category, productProps }, ref) => {
  const { pos, setPos } = position

  const { categoryName, activeCategory, productCategory, setSelectCategory, handleChangeCategory } = category

  const { productSelect, setProduct } = productProps

  const [viewMode, setViewMode] = useState(true)

  const { product } = useCommonStore((state) => state)

  const [checkedKeys, setCheckedKeys] = useState(productSelect)

  const [modal, setModal] = useState({
    visible: false,
    component: null,
    window: 0,
  })

  useEffect(() => {
    handleConfirm()
  }, [product])

  const handleSelectCategory = (value, itemData, event) => {
    let { name, image, _id } = value
    const formatData = {
      _id,
      name,
      image,
      child: [],
    }
    let productFilter = product.filter((item) => item.category.includes(_id))
    setSelectCategory({
      category: formatData,
      productFilter: productFilter,
    })
    // reset List Product
    setCheckedKeys([])
  }

  const handleSelectPosition = (value) => {
    setPos(value)
  }

  const handleOpenModalChangeProduct = () => {
    setModal({
      visible: true,
    })
  }

  const handleClose = () => {
    setModal((prev) => ({ ...prev, visible: false }))
  }

  const handleCancel = () => {
    setCheckedKeys([])
    handleClose()
  }

  const handleConfirm = () => {
    let productOutCome = handleAddProduct(checkedKeys)
    setProduct({ rawProduct: productOutCome, formatProduct: checkedKeys })
    handleClose()
  }

  const handleAddProduct = (productIncome) => {
    const productOutcome = []
    for (let _id of productIncome) {
      let item = product.find((prod) => prod._id === _id)
      productOutcome.push(item)
    }
    return productOutcome
  }

  const renderPosition = useMemo(() => {
    let html = null
    if (viewMode) {
      if (pos === 'ltr') {
        html = <span className={styles.plainText}>Trái</span>
      } else if (pos === 'rtl') {
        html = <span className={styles.plainText}>Phải</span>
      }
    } else {
      html = (
        <SelectPicker
          data={[
            { label: 'Phải', value: 'rtl' },
            { label: 'Trái', value: 'ltr' },
          ]}
          onSelect={handleSelectPosition}
          value={pos}
        />
      )
    }
    return html
  }, [viewMode, pos])

  const renderCategory = useMemo(() => {
    let html = null
    if (viewMode) {
      html = <span className={styles.plainText}>{categoryName}</span>
    } else {
      html = (
        <Cascader
          data={productCategory}
          parentSelectable
          style={{ width: 224 }}
          labelKey="name"
          valueKey="_id"
          childrenKey="child"
          onSelect={handleSelectCategory}
          onChange={handleChangeCategory}
          value={activeCategory}
          preventOverflow
        />
      )
    }
    return html
  }, [viewMode, category])

  return (
    <div className={styles.toolbar}>
      <div className={styles.listItem}>
        <div className={styles.toolbarItem}>
          <span className={styles.label}>Vị trí:</span>
          {renderPosition}
        </div>

        <div className={styles.toolbarItem}>
          <span>Danh mục:</span>
          {renderCategory}
        </div>

        <div className={styles.toolbarItem}>
          {!viewMode && (
            <Button appearance="default" color="primary" onClick={handleOpenModalChangeProduct}>
              Thay đổi sản phẩm
            </Button>
          )}
        </div>
      </div>

      <div className={styles.toggleButton}>
        <Button appearance="default" color="primary" onClick={() => setViewMode(!viewMode)}>
          {viewMode ? 'Chỉnh sửa' : 'Quay lại ban đầu'}
        </Button>
      </div>

      <Modal keyboard={false} open={modal.visible} onClose={handleClose} size={'full'}>
        <Modal.Header>
          <Modal.Title>Danh sách sản phẩm</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Products select noEdit propsChecked={{ checkedKeys, setCheckedKeys }} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirm} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleCancel} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
})
