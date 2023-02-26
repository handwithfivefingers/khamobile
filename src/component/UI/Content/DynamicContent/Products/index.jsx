import Products from 'pages/admin/product'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, Modal } from 'rsuite'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import { useCommonStore } from 'src/store'
import Card from '../../Card'
import CustomSlider from '../../Slider'
import styles from './styles.module.scss'
export default function DynamicProductComponentInput({ data, pageIndex, onSubmit }) {
  // const currentSection = data

  const [sectionData, setSectionData] = useState(data)
  const [product, setProduct] = useState()
  const toolbarRef = useRef()

  const handleSubmit = () => {
    onSubmit(sectionData, pageIndex)
  }

  const handleSetProduct = ({ rawProduct, formatProduct }) => {
    setProduct({ rawProduct, formatProduct })
    setSectionData((prev) => {
      prev.data = formatProduct
      return prev
    })
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Toolbar
            productProps={{
              productSelect: sectionData?.data || [],
              setProduct: handleSetProduct,
            }}
            ref={toolbarRef}
          />
        </div>
        <div className="col-12">
          <CustomSlider type={TYPE_CAROUSEL.MUTI} slidesToShow={5}>
            {product?.rawProduct?.map((item, index) => {
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
            {sectionData?.data?.length < 5
              ? Array.from(Array(5 - sectionData?.data?.length).keys()).map((item) => <h2>{item}</h2>)
              : ''}
          </CustomSlider>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Button appearance="primary" onClick={handleSubmit}>
          Save Section
        </Button>
      </div>
    </>
  )
}

const Toolbar = forwardRef(({ productProps }, ref) => {
  const { productSelect, setProduct } = productProps

  const [viewMode, setViewMode] = useState(true)

  const { product } = useCommonStore((state) => state)

  const [checkedKeys, setCheckedKeys] = useState(productSelect)

  const [modal, setModal] = useState(false)

  useEffect(() => {
    handleConfirm()
  }, [product, checkedKeys])

  const handleOpenModalChangeProduct = (e) => {
    e.preventDefault()
    setModal(true)
  }

  const handleClose = () => {
    setModal(false)
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

  return (
    <div className={styles.toolbar}>
      <div className={styles.listItem}>
        <div className={styles.toolbarItem}>
          {!viewMode && (
            <Button appearance="default" color="primary" onClick={handleOpenModalChangeProduct} type="button">
              Thay đổi sản phẩm
            </Button>
          )}
        </div>
      </div>

      <div className={styles.toggleButton}>
        <Button appearance="default" color="primary" onClick={() => setViewMode(!viewMode)} type="button">
          {viewMode ? 'Chỉnh sửa' : 'Quay lại ban đầu'}
        </Button>
      </div>

      <ProductModal
        open={modal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        propsChecked={{ checkedKeys, setCheckedKeys }}
      />
    </div>
  )
})

const ProductModal = ({ open, handleClose, handleConfirm, handleCancel, ...props }) => {
  return (
    <Modal open={open} onClose={handleClose} size={'full'} backdrop={true} autoFocus>
      <Modal.Header>
        <Modal.Title>Danh sách sản phẩm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Products select noEdit {...props} />
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
  )
}
