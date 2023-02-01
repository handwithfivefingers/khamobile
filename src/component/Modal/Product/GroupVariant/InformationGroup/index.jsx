import React, { forwardRef, useRef, useState } from 'react'
import { Button, Toggle } from 'rsuite'
import styles from './styles.module.scss'

import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
const InformationGroup = forwardRef(({ stockData }, ref) => {
  const { purchasable, stock_status, setStock } = stockData

  const checkboxRef = useRef({
    purchasable,
    stock_status,
  })

  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <div className="row gx-2 gy-2">
          <div className="col">
            <div className="label">Hiển thị</div>
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
          <div className="col">
            <div className="label">Trạng thái hàng hóa</div>
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
