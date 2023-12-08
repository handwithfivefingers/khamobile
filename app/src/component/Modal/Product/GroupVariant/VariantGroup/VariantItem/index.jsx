import React, { forwardRef, useRef, useState } from 'react'
import { Form, SelectPicker, Toggle, Uploader } from 'rsuite'
import styles from './styles.module.scss'
import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
import { NumericFormat } from 'react-number-format'
import CustomUpload from 'component/UI/Upload/CustomUpload'

const VariantItem = forwardRef(({ data, attributes, attributesItem, position, ...props }, ref) => {
  const imageRef = useRef()
  console.log(ref.current[position].image?.src)
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-8">
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="flex justify-start" style={{ gap: 12 }}>
              <Form.Group controlId={['purchasable', position]}>
                <Form.ControlLabel className="text-gray-400" style={{ fontWeight: 500 }}>
                  Hiển thị
                </Form.ControlLabel>
                <CheckboxVariant
                  ref={ref}
                  position={position}
                  name={'purchasable'}
                  value={data?.purchasable}
                  checkValue={true}
                  unCheckValue={false}
                />
              </Form.Group>
              <Form.Group controlId={['instock', position]}>
                <Form.ControlLabel className="text-gray-400" style={{ fontWeight: 500 }}>
                  Còn hàng
                </Form.ControlLabel>
                <CheckboxVariant
                  ref={ref}
                  position={position}
                  name={'stock_status'}
                  value={data?.stock_status}
                  checkValue={'instock'}
                  unCheckValue={'outofstock'}
                />
              </Form.Group>
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex justify-start" style={{ gap: 12 }}>
              <Form.Group controlId={['price', position]}>
                <Form.ControlLabel className="text-gray-400" style={{ fontWeight: 500 }}>
                  Giá tiền
                </Form.ControlLabel>
                <PInput position={position} value={data?.price} name={'price'} ref={ref} price />
              </Form.Group>

              <Form.Group controlId={['regular_price', position]}>
                <Form.ControlLabel className="text-gray-400" style={{ fontWeight: 500 }}>
                  Giá niêm yết
                </Form.ControlLabel>
                <PInput position={position} value={data?.regular_price} name={'regular_price'} ref={ref} price />
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="flex flex-col items-center">
          <label>Hình ảnh</label>

          <CustomUpload
            value={ref.current[position].image}
            name="upload"
            action={process.env.API + '/api/upload'}
            withCredentials={true}
            onSuccess={(response, file) => {
              let { information } = props
              let { setProductInformation } = information
              let nextState = ref.current
              let currentItem = nextState[position]
              currentItem.image = {
                src: response.url,
                name: file.name,
              }
              setProductInformation(nextState, 'variations')
            }}
            onError={(error) => {
              console.log(error)
            }}
            ref={imageRef}
          />
        </div>
      </div>

      <div className="col-12">
        <div className="d-flex justify-content-start" style={{ gap: 12 }}>
          {Object.keys(attributesItem).map((key) => (
            <Form.Group controlId={[key, position]}>
              <Form.ControlLabel className="text-gray-400" style={{ fontWeight: 500 }}>
                {key}
              </Form.ControlLabel>
              <Select attributes={attributes} position={position} name={key} ref={ref} />
            </Form.Group>
          ))}
        </div>
      </div>
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
      style={{ minWidth: 150 }}
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
  return <input className="rs-input" type="text" id="price,0" value="" {...props} />
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
        checkedChildren={<CheckIcon className='flex items-center h-full'/>}
        unCheckedChildren={<CloseIcon className='flex items-center h-full'/>}
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
