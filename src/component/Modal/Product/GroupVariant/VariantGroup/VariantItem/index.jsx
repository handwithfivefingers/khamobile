import React, { forwardRef, useState } from 'react'
import { Form, SelectPicker, Toggle } from 'rsuite'
import styles from './styles.module.scss'
import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
import { NumericFormat } from 'react-number-format'

const VariantItem = forwardRef(({ data, attributes, attributesItem, position, ...props }, ref) => {
  console.log('VariantItem', data)
  return (
    <div className={styles.groupItem}>
      <Form.Group controlId={['instock', position]} style={{ width: 'calc(50% - 4px)' }}>
        <Form.ControlLabel>Còn hàng</Form.ControlLabel>

        <CheckboxVariant
          ref={ref}
          position={position}
          name={'stock_status'}
          value={data?.stock_status}
          checkValue={'instock'}
          unCheckValue={'outofstock'}
        />
      </Form.Group>

      <Form.Group controlId={['purchasable', position]} style={{ width: 'calc(50% - 4px)' }}>
        <Form.ControlLabel>Bật</Form.ControlLabel>
        <CheckboxVariant
          ref={ref}
          position={position}
          name={'purchasable'}
          value={data?.purchasable}
          checkValue={true}
          unCheckValue={false}
        />
      </Form.Group>

      <Form.Group controlId={['price', position]}>
        <Form.ControlLabel>Giá tiền</Form.ControlLabel>
        <PInput position={position} value={data?.price} name={'price'} ref={ref} price />
      </Form.Group>

      <Form.Group controlId={['regular_price', position]}>
        <Form.ControlLabel>Giá gạch</Form.ControlLabel>
        <PInput position={position} value={data?.regular_price} name={'regular_price'} ref={ref} price />
      </Form.Group>

      {Object.keys(attributesItem).map((key) => (
        <Form.Group controlId={[key, position]}>
          <Form.ControlLabel>{key}</Form.ControlLabel>
          <Select attributes={attributes} position={position} name={key} ref={ref} />
        </Form.Group>
      ))}
    </div>
  )
})

const Select = forwardRef(({ attributes, name, position, ...props }, ref) => {
  const [_render, setRender] = useState(false)

  const item = ref.current[position]

  const optionMemoiz = (selectOptions) => selectOptions?.value?.map((_val) => ({ label: _val, value: _val }))

  const handleSelect = (value) => {
    item.attributes[name] = value
    setRender(!_render)
  }

  let optionTarget = attributes.find((item) => item.name === name)

  return (
    <SelectPicker
      data={optionMemoiz(optionTarget)}
      placeholder={name}
      className={styles.selectItem}
      value={item.attributes[name] || ''}
      onSelect={handleSelect}
    />
  )
})

const PInput = forwardRef(({ name, position, value, price, ...props }, ref) => {
  const [_render, setRender] = useState(false)

  const item = ref.current[position]

  const handleChange = ({ formattedValue, value, floatValue }) => {
    item[name] = value
    setRender(!_render)
  }

  if (price) {
    return (
      <NumericFormat
        defaultValue={value || ''}
        allowLeadingZeros
        thousandSeparator=","
        onValueChange={handleChange}
        ref={ref}
        customInput={InputProxy}
        suffix=" đ"
      />
    )
  }

  return (
    <InputNumber placeholder={name} className={styles.selectItem} defaultValue={value || ''} onChange={handleChange} />
  )
})

const InputProxy = (props) => {
  return <input class="rs-input" type="text" id="price,0" value="" {...props} />
}

const CheckboxVariant = forwardRef(
  ({ value, checkValue, unCheckValue, position, name, checkedChildren, unCheckedChildren, ...props }, ref) => {
    const item = ref.current[position]

    const [_render, setRender] = useState(false)

    const handleChange = (boolean) => {
      if (boolean) {
        item[name] = checkValue
      } else {
        item[name] = unCheckValue
      }
      setRender(!_render)
    }


    return (
      <Toggle
        defaultChecked={item?.[name] === checkValue}
        checkedChildren={<CheckIcon />}
        unCheckedChildren={<CloseIcon />}
        onChange={handleChange}
      />
    )

    return (
      <Checkbox
        value={checkValue}
        className={styles.selectItem}
        defaultChecked={item?.[name] === checkValue}
        ref={ref}
        onChange={(v, checked) => console.log('checked', v, checked)}
      />
    )
  },
)

export default VariantItem
