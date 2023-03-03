import React, { forwardRef, useMemo, useRef, useState } from 'react'
import { Button, Form, Toggle, SelectPicker } from 'rsuite'
import styles from './styles.module.scss'

import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
import { KMPrice } from 'component/UI/Content/KMInput'
const InformationGroup = forwardRef(({ stockData, productType }, ref) => {
  const { purchasable, stock_status, setStock } = stockData

  const checkboxRef = useRef({
    purchasable,
    stock_status,
  })

  const renderPricingForSimpleProduct = useMemo(() => {
    let html = null
    if (productType.type === 'simple') {
      html = (
        <>
          <div className="col-12">
            <div className="d-flex justify-content-start align-items-center" style={{ gap: 12 }}>
              <label style={{ minWidth: 150 }}>Giá niêm yết :</label>
              <KMPrice
                name="regular_price"
                onChange={(v) => {
                  console.log('price changed', v)
                  formDataRef.current.regular_price = v
                }}
                style={{ minWidth: 200 }}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-start align-items-center" style={{ gap: 12 }}>
              <label style={{ minWidth: 150 }}>Giá tiền :</label>
              <KMPrice
                name="price"
                onChange={(v) => {
                  console.log('price changed', v)
                  formDataRef.current.price = v
                }}
                style={{ minWidth: 200 }}
              />
            </div>
          </div>
        </>
      )
    }
    return html
  }, [productType])

  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <div className="row gx-2 gy-3">
          <div className="col-12">
            <div className="d-flex justify-content-start align-items-center" style={{ gap: 12 }}>
              <label style={{ minWidth: 150 }}>Loại sản phẩm :</label>
              <Form.Group controlId="type">
                <SelectPicker
                  name="type"
                  value={productType.type}
                  onChange={(value, e) => productType.setProductType(value, e)}
                  onClick={(e) => e.preventDefault()}
                  data={[
                    { label: 'Đơn giản', value: 'simple' },
                    { label: 'Nhiều biến thể', value: 'variable' },
                  ]}
                  style={{ minWidth: 200 }}
                />
              </Form.Group>
            </div>
          </div>

          {renderPricingForSimpleProduct}

          <div className="col-6">
            <div className="d-flex justify-content-start align-items-center" style={{ gap: 12 }}>
              <div className="label">Hiển thị sản phẩm</div>
              <div className="label">
                <CheckboxVariant
                  ref={checkboxRef}
                  data={checkboxRef.current.purchasable}
                  onChange={setStock}
                  name="purchasable"
                  checkValue={true}
                  unCheckValue={false}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex justify-content-start align-items-center" style={{ gap: 12 }}>
              <div className="label">Còn hàng</div>
              <div className="label">
                <CheckboxVariant
                  ref={checkboxRef}
                  data={checkboxRef.current.stock_status}
                  name="stock_status"
                  checkValue="instock"
                  unCheckValue="outofstock"
                  onChange={setStock}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

const CheckboxVariant = forwardRef(
  ({ value, checkValue, unCheckValue, name, checkedChildren, unCheckedChildren, data, onChange, ...props }, ref) => {
    const [_render, setRender] = useState(false)
    const item = ref.current
    const handleChange = (boolean) => {
      let value = null
      if (boolean) {
        value = checkValue
      } else {
        value = unCheckValue
      }

      item[name] = value

      if (onChange) {
        onChange(name, value)
      }
      setRender(!_render)
    }

    return (
      <>
        <Toggle
          defaultChecked={item?.[name] === checkValue}
          checkedChildren={<CheckIcon />}
          unCheckedChildren={<CloseIcon />}
          onChange={handleChange}
        />
      </>
    )
  },
)

export default InformationGroup
