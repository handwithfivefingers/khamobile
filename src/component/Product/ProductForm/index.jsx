import { CloseOutline } from '@rsuite/icons'
import clsx from 'clsx'
import BaoKim from 'component/UI/Content/BaoKim'
import CardBlock from 'component/UI/Content/CardBlock'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { BiCart } from 'react-icons/bi'
import { Button, Cascader, Divider, Form, IconButton, InputNumber, Panel, SelectPicker } from 'rsuite'
import { ProductModel } from 'src/constant/model.constant'
import { formatCurrency } from 'src/helper'
import { useCartStore } from 'store/cartStore'
import ProductOptions from '../ProductOption'
import _ from 'lodash'
import styles from './styles.module.scss'

const ProductForm = ({ data, _relationProd, ...props }) => {
  const pricingRef = useRef()

  const formRef = useRef()

  const router = useRouter()

  const [attributeMap, setAttributeMap] = useState(new Map())

  const [attributeSelect, setAttributeSelect] = useState({})

  const [productFilter, setProductFilter] = useState([])

  const { addToCart } = useCartStore()
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
      getDefaultOptions()
    }
  }, [])

  // useEffect(() => {
  //   console.log(productFilter)
  //   if (Object.keys(attributeSelect).length === data.attributes?.length && productFilter.length === 1) {
  //     const [{ _id, ...rest }] = productFilter
  //     setForm((prev) => ({ ...prev, ...rest, variantId: _id }))
  //   }
  // }, [attributeSelect])

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
    console.log(form)

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
        // currentAttributeSelect = { [attributeName]: value }

        // let resultByKey = filterByKey({ key: attributeName, value, productList: _relationProd })

        // console.log(resultByKey)

        // for(let key in resultByKey.attribute) {

        //   if(resultByKey.attribute[key]) {

        //   }
        //  }

        // let availableAttributes = resultByKey.reduce((prev, current) => {
        //   for (let attrKey in current.attribute) {
        //     if (prev.get(attrKey)) {
        //       value = [...prev.get(attrKey), { active: true, v: current.attribute[attrKey] }]
        //       prev.set(attrKey, value)
        //     } else {
        //       prev.set(attrKey, [{ active: true, v: current.attribute[attrKey] }])
        //     }
        //   }
        //   return prev
        // }, new Map())

        // for (let [key, value] of [...map]) {
        //   value = value.map((item) => ({
        //     ...item,
        //     active: resultByKey.some((_item) => _item.attribute[key] === item.v),
        //   }))
        //   map.set(key, value)
        // }

        // console.log(map)
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

    setProductFilter(productFiltered)

    setAttributeMap(map)

    setAttributeSelect(currentAttributeSelect)
  }

  const filterByKey = ({ key, value, productList }) => {
    const result = []
    for (let item of productList) {
      if (item.attribute[key] === value) {
        result.push(item)
      }
    }
    return result
  }

  /**
   *
   * @param { * Object {[attributeName] : attributeValue } } attributeSelected
   * @returns { * Array [ ...product ]}
   */

  const filterProductByAttributeName = (attributeSelected) => {
    const nextState = [..._relationProd] // get all list variant Product

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
          className={'row gx-2 gy-2 align-items-center w-100'}
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

  const renderBaoKimElement = useMemo(() => {
    let html = null
    html = <BaoKim form={form} />
    return html
  }, [form])

  return (
    <CardBlock className="border-0">
      <Form ref={formRef} model={ProductModel}>
        <Panel style={{ paddingBottom: 0 }}>
          <div className={clsx('d-flex align-items-center w-100 flex-1', styles.groupVariant)} style={{ gap: 4 }}>
            <div className={'row w-100 '} ref={pricingRef}>
              <div className="col-12">
                <p className={clsx(styles.productPricing, 'bk-product-price')}>
                  {calculatePrice()}

                  <span className={styles.productRegularPrice}>{calculateRegularPrice()}</span>
                </p>
              </div>
              <div className="col-12 position-relative">
                {_relationProd.length ? (
                  <>
                    <div className="position-absolute" style={{ top: 0, right: 0 }}>
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

          <div className={clsx(styles.groupVariant)}>
            <input type="hidden" value={form.quantity} className="bk-product-qty" />

            <Button
              appearance="primary"
              className={styles.btnIcon}
              onClick={handleBuyNow}
              style={{ background: 'var(--rs-blue-800)' }}
              disabled={!(form?.price * form?.quantity)}
            >
              <div className="d-flex flex-column">
                <span>Mua ngay</span>
                <span style={{ fontSize: 12 }}>( giao tận nơi hoặc lấy tại cửa hàng )</span>
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
                <BiCart style={{ fontSize: 20 }} />
                <span style={{ fontSize: 12 }}> Thêm vào giỏ hàng</span>
              </div>
            </Button>

            {renderBaoKimElement}
          </div>

          <div id="bk-modal"></div>
        </Panel>
      </Form>
    </CardBlock>
  )
}

const CustomInputNumber = ({ rowKey, value, ...props }) => {
  return <InputNumber value={value} {...props} />
}

export default ProductForm
