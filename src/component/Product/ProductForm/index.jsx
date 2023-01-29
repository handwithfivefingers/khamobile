import clsx from 'clsx'
import BaoKim from 'component/UI/Content/BaoKim'
import CardBlock from 'component/UI/Content/CardBlock'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { BiCart } from 'react-icons/bi'
import { Button, Divider, Form, InputNumber, Panel } from 'rsuite'
import { ProductModel } from 'src/constant/model.constant'
import { formatCurrency } from 'src/helper'
import ProductOptions from '../ProductOption'
import styles from './styles.module.scss'

const ProductForm = ({ data, _relationProd, ...props }) => {
  const pricingRef = useRef()

  const formRef = useRef()

  const queryRef = useRef({})

  const router = useRouter()

  const [attributes, setAttributes] = useState([])

  const [attributeSelect, setAttributeSelect] = useState({})

  const [filterProduct, setFilterProduct] = useState([])

  const [form, setForm] = useState({
    quantity: 1,
    image: data?.image,
    _id: data?._id,
  })

  useEffect(() => {
    if (data) {
      if (data?.attributes?.length) {
        onResetAttributes()
      }

      if (_relationProd.length) {
        let { _id, ...rest } = _relationProd[0]

        setForm((prevState) => ({
          ...prevState,
          ...rest,
          variantId: _id,
        }))

        resetFilterProduct()
      }
    }
  }, [])

  const resetFilterProduct = () => {
    setFilterProduct(_relationProd)
  }

  const handleAddToCart = () => {
    const cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    let index = listItem.findIndex((item) => item._id === form._id && item?.variantId === form?.variantId)

    if (index !== -1) {
      listItem[index].quantity = listItem[index].quantity + +form.quantity
    } else {
      listItem.push(form)
    }

    localStorage.setItem('khaMobileCart', JSON.stringify(listItem))
  }

  const handleBuyNow = async () => {
    const cartItem = await JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    let index = listItem.findIndex((item) => item._id === form._id)

    if (index !== -1) {
      listItem[index].quantity = listItem[index].quantity + +form.quantity
    } else {
      listItem.push(form)
    }

    await localStorage.setItem('khaMobileCart', JSON.stringify(listItem))

    // return

    router.push('/cart')
  }

  const onResetAttributes = () => {
    queryRef.current = {}
    const attributes = data?.attributes
    const attributeData = attributes?.map(({ name, value }) => {
      return {
        name,
        value: value?.map((_val) => {
          return { v: _val }
        }),
      }
    })

    setAttributes(attributeData)
  }

  const calculatePrice = () => {
    let html = null
    html = formatCurrency(form?.price * form?.quantity || 0)
    return html
  }

  const renderAttributes = () => {
    let html = null
    html = attributes.map((attribute) => {
      return (
        <div className={'row gx-2 gy-2 align-items-center w-100'}>
          <ProductOptions
            listAttribute={attribute.value}
            attributeName={attribute.name}
            onChange={handleAttributeChange}
            // disabledValue={['ZA']}
          />
        </div>
      )
    })
    return html
  }

  const handleAttributeChange = ({ value, name: attributeName }) => {
    console.log('handleAttributeChange', value, attributeName)

    const lastAttributeSelect = { ...attributeSelect }

    const currentAttributeSelect = { ...lastAttributeSelect, [attributeName]: value }

    const listMatchProduct = [..._relationProd] // get all list variant Product

    listMatchProduct = listMatchProduct.filter((productVariant) => {
      let result = true
      // currentAttributeSelect
      for (let attributeName in currentAttributeSelect) {
        const attributeValue = currentAttributeSelect[attributeName]
        if (productVariant[attributeName] !== attributeValue) {
          result = false
          break
        }
      }
      return result
    })

    console.log('currentAttributeSelect', currentAttributeSelect)
    
    console.log('matchVariant', listMatchProduct)

    setAttributeSelect(currentAttributeSelect)

    setFilterProduct(listMatchProduct)
  }

  const isProductExistsAfterFilter = ({ value, attributeName }) => {
    const currentProducts = [...filterProduct]
    return currentProducts.every((productVariant) => productVariant[attributeName] === value)
  }

  console.log(filterProduct)

  return (
    <CardBlock className="border-0">
      <Form ref={formRef} model={ProductModel}>
        <Panel style={{ paddingBottom: 0, paddingTop: 24 }}>
          <div className={clsx('d-flex align-items-center w-100 flex-1', styles.groupVariant)} style={{ gap: 4 }}>
            <div className={'row w-100 '} ref={pricingRef}>
              <div className="col-12">
                <p className={clsx(styles.productPricing, 'bk-product-price')}>{calculatePrice()}</p>
              </div>

              <div className="col-12">{renderAttributes()}</div>
            </div>
          </div>

          <Divider />

          <div className={clsx('d-inline-flex align-items-center', styles.groupVariant)} style={{ gap: 4 }}>
            <Form.Control
              name="quantity"
              accepter={CustomInputNumber}
              style={{ width: 60 }}
              defaultValue={form.quantity}
              onChange={(value) => setForm({ ...form, quantity: value })}
              min={1}
            />

            <input type="hidden" value={form.quantity} className="bk-product-qty" />

            <Divider vertical />

            <Button
              appearance="primary"
              className={styles.btnIcon}
              onClick={handleBuyNow}
              style={{ background: 'var(--rs-blue-800)' }}
              disabled={!(form?.price * form?.quantity)}
            >
              <div className="d-flex flex-column">
                <span>Mua ngay</span>
                <span style={{ fontSize: 12 }}>(giao tận nơi hoặc lấy tại cửa hàng)</span>
              </div>
            </Button>

            <Button
              color="red"
              appearance="primary"
              className={styles.btnIcon}
              onClick={handleAddToCart}
              style={{ background: 'var(--rs-red-800)', color: '#fff' }}
              disabled={!(form?.price * form?.quantity)}
            >
              <div className="d-flex flex-column align-items-center">
                <BiCart />
                <span style={{ fontSize: 12 }}> Thêm vào giỏ hàng</span>
              </div>
            </Button>

            <BaoKim />
          </div>
        </Panel>
      </Form>
    </CardBlock>
  )
}

const CustomInputNumber = ({ rowKey, value, ...props }) => {
  return <InputNumber value={value} {...props} />
}

export default ProductForm
