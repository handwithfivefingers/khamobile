import clsx from 'clsx'
import { useState } from 'react'
import { Radio, RadioGroup } from 'rsuite'

const ProductOptions = ({ attributeName, listAttribute, disabledValue = [], ...props }) => {
  const [selected, setSelected] = useState()

  const handleAttributeChange = ({ value, name }) => {
    setSelected(value)
    if (props.onChange) {
      props.onChange({ value, name })
    }
  }

  return (
    <RadioGroup
      className={clsx('d-flex flex-row border-0 flex-wrap p-1')}
      appearance="picker"
      onChange={(value) => handleAttributeChange({ value, name: attributeName })}
      value={selected || ''} // get current attribute select
    >
      {/* Attribute Name */}
      <p className=" flex-shrink-0" style={{ color: 'var(--rs-blue-800)' }}>
        {attributeName} :
      </p>

      {/* Attribute Value */}

      {listAttribute?.map(({ v, active }) => (
        <Radio value={v} disabled={disabledValue.includes(v)}>
          <span
            className={clsx('p-2 bg-light', 
            // {
            //   'bk-product-property': active,
            // }
            )}
          >
            {v}
          </span>
        </Radio>
      ))}
    </RadioGroup>
  )
}

export default ProductOptions
