import clsx from 'clsx'
import { useState } from 'react'
import { Radio, RadioGroup } from 'rsuite'

const ProductOptions = ({ attributeName, listAttribute, selectValue, onChange }) => {
  const handleAttributeChange = ({ value, name }) => {
    if (onChange) {
      onChange({ value, name })
    }
  }

  return (
    <RadioGroup
      className={clsx('d-flex flex-row border-0 flex-wrap p-1')}
      appearance="picker"
      onChange={(value) => handleAttributeChange({ value, name: attributeName })}
      value={selectValue || ''} // get current attribute select
    >
      {/* Attribute Name */}
      <p className=" flex-shrink-0" style={{ color: 'var(--rs-blue-800)' }}>
        {attributeName} :
      </p>

      {/* Attribute Value */}

      {listAttribute?.map(({ v, active }) => (
        <Radio value={(active && v) || null} disabled={!active}>
          <span
            className={clsx('p-2 ', {
              'bk-product-property': selectValue === v,
            })}
          >
            {v}
          </span>
        </Radio>
      ))}
    </RadioGroup>
  )
}

export default ProductOptions
