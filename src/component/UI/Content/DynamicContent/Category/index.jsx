import Products from 'pages/admin/product'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { BsDashLg, BsPlusLg, BsPlusSquareDotted } from 'react-icons/bs'
import { Button, Cascader, Form, Input, Modal, SelectPicker, IconButton, InputGroup } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { useCommonStore } from 'src/store'
import Catalog from '../../Catalog'
import ImageBlock from '../../ImageBlock'
import styles from './styles.module.scss'
export default function DynamicCategoryComponentInput({ data, pageIndex, onSubmit }) {
  const [sectionData, setSectionData] = useState(data)

  const [catelogData, setCatelogData] = useState([])

  const { productCategory } = useCommonStore((state) => state)

  const [activeCategory, setActiveCategory] = useState('')

  const toolbarRef = useRef()

  const [config, setConfig] = useState(data.options)

  useEffect(() => {
    if (productCategory) {
      let item = productCategory.find((cate) => cate.name === sectionData.title)
      if (item) {
        let { name, image, _id } = item
        const formatData = {
          _id,
          name,
          image: image?.src,
        }
        setActiveCategory(_id)
        setCatelogData((prev) => ({
          ...prev,
          ...formatData,
          categories: config.moreLink.length > 0 ? config.moreLink : [''],
        }))
      }
    }
  }, [productCategory])

  const handleSubmit = (e) => {
    e.preventDefault()

    const formatData = { ...sectionData }
    const moreLink = toolbarRef.current.getExtraLink()
    const position = toolbarRef.current.getPosition()

    formatData.options = {
      ...config,
      position,
      moreLink,
    }
    onSubmit(formatData, pageIndex)
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
        config={config}
        ref={toolbarRef}
      />
      <Form formValue={sectionData}>
        <div className="row gx-2 gy-2">
          <div className="col-12">
            <Catalog data={catelogData} direction={config.position} />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Button appearance="primary" onClick={handleSubmit} type="button">
            Save Section
          </Button>
        </div>
      </Form>
    </>
  )
}

const Toolbar = forwardRef(({ category, productProps, config }, ref) => {
  const { categoryName, activeCategory, productCategory, setSelectCategory, handleChangeCategory } = category

  const { productSelect, setProduct } = productProps

  const [categoryPosition, setCategoryPosition] = useState(config?.position || 'ltr')

  const [viewMode, setViewMode] = useState(true)

  const { product } = useCommonStore((state) => state)

  const [checkedKeys, setCheckedKeys] = useState(productSelect)

  const [links, setLinks] = useState()

  const linkRef = useRef()

  const [modal, setModal] = useState({
    visible: false,
    component: null,
    window: 0,
  })

  useEffect(() => {
    handleConfirm()
    if (config?.moreLink) {
      const nextState = config?.moreLink?.map((item) => item._id)

      setLinks(nextState.length > 0 ? nextState : [''])
    }
  }, [product, config])

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
    setCategoryPosition(value)
  }

  const handleOpenModalChangeProduct = () => {
    setModal({
      visible: true,
      component: <Products select noEdit propsChecked={{ checkedKeys, setCheckedKeys }} />,
      title: 'Danh sách sản phẩm',
      handleConfirm: handleConfirm,
      handleCancel: handleCancel,
    })
  }

  const handleOpenModalAddLink = () => {
    setModal({
      visible: true,
      component: <AddLinkModal activeCategory={activeCategory} handleLink={{ setLinks, links }} ref={linkRef} />,
      title: 'Thêm đường dẫn',
      handleConfirm: handleConfirmLinkChange,
      handleCancel: handleCancel,
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

  const handleConfirmLinkChange = () => {
    const linkData = linkRef.current.getData()
    setLinks(linkData)
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
      if (categoryPosition === 'ltr') {
        html = <span className={styles.plainText}>Trái</span>
      } else if (categoryPosition === 'rtl') {
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
          value={categoryPosition}
        />
      )
    }
    return html
  }, [viewMode, categoryPosition])

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

  useImperativeHandle(
    ref,
    () => {
      return {
        getExtraLink: () => links,
        getPosition: () => categoryPosition,
      }
    },
    [links],
  )

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
        {!viewMode && (
          <>
            <div className={styles.toolbarItem}>
              <Button appearance="default" color="primary" onClick={handleOpenModalChangeProduct}>
                Sản phẩm
              </Button>
            </div>
            <div className={styles.toolbarItem}>
              <Button appearance="default" color="primary" onClick={handleOpenModalAddLink}>
                Liên kết
              </Button>
            </div>
          </>
        )}
      </div>

      <div className={styles.toggleButton}>
        <Button appearance="default" color="primary" onClick={() => setViewMode(!viewMode)}>
          {viewMode ? 'Chỉnh sửa' : 'Quay lại ban đầu'}
        </Button>
      </div>

      <Modal keyboard={false} open={modal.visible} onClose={handleClose} size={'full'}>
        <Modal.Header>
          <Modal.Title>{modal.title} </Modal.Title>
        </Modal.Header>

        <Modal.Body>{modal.component}</Modal.Body>
        <Modal.Footer>
          <Button onClick={modal.handleConfirm} appearance="primary">
            Ok
          </Button>
          <Button onClick={modal.handleCancel} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
})

const AddLinkModal = forwardRef(({ activeCategory, handleLink }, ref) => {
  console.log(handleLink)
  const { links } = handleLink
  const [state, setState] = useState(links)
  const { productCategory } = useCommonStore((state) => state)

  const handleAddField = (index) => {
    const nextState = [...state]
    nextState = [...nextState.slice(0, index + 1), undefined, ...nextState.slice(index + 1)]
    setState(nextState)
  }

  const handleRemoveField = (index) => {
    const nextState = [...state]
    nextState.splice(index, 1)
    setState(nextState)
  }

  const handleChange = (e, pos) => {
    setState((prev) => {
      prev[pos] = e
      return prev
    })
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        getData: () => state,
      }
    },
    [state],
  )

  return (
    <div className="container">
      <div className="row gx-2 gy-2 p-2">
        <div className="col-8">
          {state.map((item, index) => {
            return (
              <DynamicInput
                value={item}
                position={index}
                key={Math.random()}
                handleAddField={handleAddField}
                handleChange={handleChange}
                handleRemoveField={handleRemoveField}
                data={productCategory}
                showRemove={state.length > 1}
              />
            )
          })}
        </div>
        <div className="col-4">
          <ImageBlock src="/public/example/dynamicCategory/category_link.png" engine objectFit="contain" options={{}} />
        </div>
      </div>
    </div>
  )
})

const DynamicInput = ({
  value,
  position,
  handleAddField,
  handleChange,
  handleRemoveField,
  data,
  showRemove = true,
}) => {
  const [inpValue, setInpValue] = useState(value || '')

  const handleSelectCategory = (value, item) => {
    const { _id } = value
    setInpValue(_id)
    handleChange(_id, position)
  }

  return (
    <div className="d-flex mb-1" style={{ gap: 4 }}>
      <IconButton
        icon={<BsDashLg style={{ fontSize: 16 }} />}
        onClick={(e) => {
          if (showRemove) {
            handleRemoveField(position)
          }
        }}
        style={{ opacity: showRemove ? 1 : 0 }}
      />
      <Cascader
        data={data}
        parentSelectable
        style={{ width: '100%' }}
        labelKey="name"
        valueKey="_id"
        childrenKey="child"
        onSelect={handleSelectCategory}
        value={inpValue}
        preventOverflow
        block
        menuWidth={200}
      />
      <IconButton icon={<BsPlusLg style={{ fontSize: 16 }} />} onClick={() => handleAddField(position)} />
    </div>
  )
}
