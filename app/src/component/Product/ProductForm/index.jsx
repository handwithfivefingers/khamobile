import { CloseOutline } from '@rsuite/icons'
import clsx from 'clsx'
import BaoKim from 'component/UI/Content/BaoKim'
import CardBlock from 'component/UI/Content/CardBlock'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState, memo } from 'react'
import { BiCart } from 'react-icons/bi'
import { Button, Divider, Form, IconButton, Panel, useToaster } from 'rsuite'
import { ProductModel } from 'src/constant/model.constant'
import { formatCurrency, message } from 'src/helper'
import { useCartStore } from 'store/cartStore'
import ProductOptions from '../ProductOption'
import isEqual from 'lodash/isEqual'

import styles from './styles.module.scss'

const ButtonOutOfStock = () => {
  return (
    <a
      appearance="primary"
      className={clsx(
        styles.btnIcon,
        '!bg-red-600 shadow-lg shadow-red-600/50 py-2 rounded text-white text-center justify-center hover:no-underline hover:text-white hover:!bg-red-800 transition-all',
      )}
      href="tel:+0777999966"
    >
      <div className="flex flex-row items-center gap-4">
        <BiCart style={{ fontSize: 20 }} />
        <span style={{ fontSize: 16 }}> Liên hệ</span>
      </div>
    </a>
  )
}
const ProductForm = ({ data, _relationProd, outputSelect, ...props }) => {
  const pricingRef = useRef()

  const formRef = useRef()

  const router = useRouter()

  const [attributeMap, setAttributeMap] = useState(new Map())

  const [attributeSelect, setAttributeSelect] = useState({})

  const { addToCart } = useCartStore()

  const [form, setForm] = useState({
    quantity: 1,
    image: data?.image,
    _id: data?._id,
  })

  const toaster = useToaster()

  useEffect(() => {
    if (data) {
      if (data?.attributes?.length) {
        onResetAttributes()
      }
      getDefaultOptions()
    }
  }, [])

  useEffect(() => {
    if (form.variantId) {
      let item = _relationProd.find((item) => item._id === form.variantId)
      outputSelect?.(item)
    }
  }, [form])

  const getDefaultOptions = () => {
    if (_relationProd.length) {
      const minPriceItem = _relationProd.reduce(function (prev, curr) {
        return prev.price < curr.price ? prev : curr
      })

      const { _id, ...rest } = minPriceItem

      setForm((prevState) => ({ ...prevState, ...rest, variantId: minPriceItem._id }))
      setAttributeSelect(rest.attribute)
    } else {
      setForm((prevState) => ({ ...prevState, ...data }))
    }
  }

  const handleAddToCart = () => {
    try {
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

      addToCart(listItem)

      localStorage.setItem('khaMobileCart', JSON.stringify(listItem))
      toaster.push(message('success', 'Thêm sản phẩm thành công !'), { placement: 'topEnd' })
    } catch (error) {
      toaster.push(message('error', 'Thêm sản phẩm thất bại ! \n Vui lòng thử lại sau'), { placement: 'topEnd' })
    }
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

    router.push('/cart')
  }

  const onResetAttributes = () => {
    setForm({
      quantity: 1,
      image: data?.image,
      _id: data?._id,
    })

    const attributes = data?.attributes
    const map = new Map()

    attributes?.map(({ name, value }) => {
      map.set(
        name,
        value.map((v) => ({ v, active: _relationProd.some((item) => item.attribute[name] === v) })),
      )
    })

    setAttributeMap(map)

    setAttributeSelect({})
  }

  const calculatePrice = () => {
    let html = null
    html = formatCurrency(form?.price * form?.quantity || 0, { symbol: 'đ' })
    return html
  }

  const calculateRegularPrice = () => {
    let html = null
    if (form.regular_price !== form.price) {
      html = formatCurrency(form?.regular_price * form?.quantity || 0, { symbol: 'đ' })
    }
    return html
  }

  const handleAttributeChange = ({ value, name: attributeName }) => {
    const lastAttributeSelect = { ...attributeSelect }

    const currentSelected = { [attributeName]: value }

    const currentAttributeSelect = { ...lastAttributeSelect, [attributeName]: value }

    const map = attributeMap

    let selectedItem

    let productFiltered = []

    if (Object.keys(currentAttributeSelect).length < data?.attributes.length) {
      productFiltered = filterProductByAttributeName(currentAttributeSelect)
    } else {
      for (let item of _relationProd) {
        const attributeItem = item.attribute
        const matchItem = Object.keys(attributeItem).every(
          (attributeName) => attributeItem[attributeName] === currentAttributeSelect[attributeName],
        )
        if (matchItem) {
          selectedItem = item
        }
      }
      if (selectedItem) {
        productFiltered = [..._relationProd]
        const { _id, ...rest } = selectedItem
        setForm((prev) => ({ ...prev, ...rest, image: data?.image, variantId: _id }))
      } else {
        setForm({ quantity: 1, image: data?.image, _id: data?._id })
        console.log('productFiltered', productFiltered)
        productFiltered = filterProductByAttributeName({ [attributeName]: value })
      }
    }

    for (let [key, value] of [...map]) {
      if (!currentSelected[key]) {
        const isActive = (attrValue) => productFiltered.some((_item) => _item.attribute[key] === attrValue)

        value = value.map((item) => ({
          ...item,
          active: isActive(item.v),
        }))

        map.set(key, value)
      }
    }
    // console.log(productFiltered)

    setAttributeMap(map)

    setAttributeSelect(currentAttributeSelect)
  }

  /**
   *
   * @param { * Object {[attributeName] : attributeValue } } attributeSelected
   * @returns { * Array [ ...product ]}
   */

  const filterProductByAttributeName = (attributeSelected) => {
    let nextState = [..._relationProd] // get all list variant Product

    nextState = nextState.filter((productVariant) => {
      let result = true
      for (let attributeName in attributeSelected) {
        const attributeValue = attributeSelected[attributeName]
        if (productVariant[attributeName] !== attributeValue) {
          result = false
          break
        }
      }
      return result
    })
    return nextState
  }

  const renderAttributes = () => {
    let html = null

    html = [...attributeMap].map(([attributeName, attributeValue], index) => {
      return (
        <div
          className={'flex px-2 py-2 items-center w-full flex-1'}
          key={[attributeName, attributeValue, index].join('-')}
        >
          <ProductOptions
            listAttribute={attributeValue}
            attributeName={attributeName}
            onChange={handleAttributeChange}
            selectValue={attributeSelect?.[attributeName]}
          />
        </div>
      )
    })
    return html
  }
  console.log('form', form)

  const renderButtonByStock = () => {
    // if (data.stock_status !== 'outofstock') {

    // }
    if (data.stock_status === 'outofstock' || form.stock_status === 'outofstock') {
      return <ButtonOutOfStock />
    }
    return (
      <>
        <input type="hidden" value={form.quantity} className="bk-product-qty" />

        <Button
          appearance="primary"
          className={clsx(styles.btnIcon, '!bg-blue-500 shadow-lg shadow-blue-500/50')}
          onClick={handleBuyNow}
          disabled={!(form?.price * form?.quantity)}
        >
          <div className="flex flex-col">
            <span>Mua ngay</span>
            <span style={{ fontSize: 12 }}>( giao tận nơi hoặc lấy tại cửa hàng )</span>
          </div>
        </Button>

        <Button
          color="red"
          appearance="primary"
          className={clsx(styles.btnIcon, 'bg-red-600 shadow-lg shadow-red-600/50 ')}
          onClick={handleAddToCart}
          disabled={!(form?.price * form?.quantity)}
        >
          <div className="flex flex-col items-center">
            <BiCart style={{ fontSize: 20 }} />
            <span style={{ fontSize: 12 }}> Thêm vào giỏ hàng</span>
          </div>
        </Button>

        {renderBaoKimElement}
      </>
    )
  }

  const renderBaoKimElement = useMemo(() => {
    let html = null
    html = <BaoKim form={form} />
    return html
  }, [form])

  return (
    <CardBlock className="border-0">
      <Form ref={formRef} model={ProductModel}>
        <Panel style={{ paddingBottom: 0 }}>
          <div className={clsx('w-full ')} style={{ gap: 4 }}>
            <div className={'grid-cols-12 grid w-full '} ref={pricingRef}>
              <div className="col-span-12">
                <p className={clsx(styles.productPricing)}>
                  <span className="bk-product-price">{calculatePrice()}</span>

                  <span className={styles.productRegularPrice}>{calculateRegularPrice()}</span>
                </p>
              </div>
              <div className="col-span-12 relative">
                {_relationProd.length ? (
                  <>
                    <div className="absolute top-0 right-0">
                      <IconButton
                        icon={<CloseOutline />}
                        circle
                        size="md"
                        style={{ color: 'var(--rs-blue-800)', background: 'transparent' }}
                        onClick={onResetAttributes}
                      />
                    </div>
                    {renderAttributes()}
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <Divider className="my-2" />

          <div className={clsx(styles.groupVariant)}>{renderButtonByStock()}</div>

          <div id="bk-modal"></div>
        </Panel>
      </Form>
    </CardBlock>
  )
}

function isEqualProps(prevProps, nextProps) {
  return !isEqual(prevProps, nextProps)
}

export default memo(ProductForm, isEqualProps)
