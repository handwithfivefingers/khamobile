import React, { forwardRef, useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'
import {
  Button,
  ButtonGroup,
  FlexboxGrid,
  Form,
  Panel,
  Placeholder,
  Radio,
  RadioGroup,
  SelectPicker,
  Stack,
  TagInput,
  TagPicker,
  Input,
  InputNumber,
  Checkbox,
} from 'rsuite'
import styles from './styles.module.scss'

const VariantGroup = forwardRef(({ variableData, variations, attribute, ...props }, ref) => {
  const { attributes, setAttributes } = attribute

  const [_trigger, setTrigger] = useState(false)
  const groupVariantRef = useRef([])
  const typeRef = useRef()
  const options = useMemo(() => {
    return [
      {
        label: 'Thêm biến thể',
        value: 1,
      },
      {
        label: 'Tạo biến thể từ tất cả thuộc tính',
        value: 2,
      },
      {
        label: 'Xóa tất cả biến thể',
        value: 3,
      },
    ]
  }, [])

  useEffect(() => {
    if (variations?.length) {
      groupVariantRef.current = variations
      setTrigger(!_trigger)
    }
  }, [variations])

  const handleAddVariant = () => {
    let nextState = [...groupVariantRef.current]
    switch (typeRef.current) {
      case 1: // Add Single variant
        // newVariant =
        let obj = {}
        for (let { name, value } of attributes) {
          obj[name] = ''
        }

        nextState.push({
          attributes: obj,
          price: '',
          regular_price: '',
          stock_status: 'instock',
          purchasable: true,
          _id: '',
        })
        console.log('nextState 1 ', nextState)

        groupVariantRef.current = nextState

        break
      case 2: // MutiItem
        const res = loopToLoop(attributes)
        nextState = [...nextState, ...res]
        console.log('nextState 2', nextState)

        groupVariantRef.current = nextState
        break
      case 3: // Clear all variants
        groupVariantRef.current = []
        break
    }
    setTrigger(!_trigger)
  }
  /**
   *
   * @param { [ { name, value: ['attribute', ...] }] } data
   * @return { [ { name : 'attribute'} ] }
   */

  const loopToLoop = (data) => {
    let i = 0
    let obj = {}
    let result = []
    loopCl(data, i, obj, result)

    return result
  }

  const loopCl = (data, i, obj, result) => {
    // console.log('i and obj: ', i, obj)
    // // console.log('data length', i, data.length)
    if (i >= data.length) {
      return result.push({
        attributes: obj,
        price: '',
        regular_price: '',
        stock_status: 'instock',
        purchasable: true,
        _id: '',
      })
    } else {
      const nextData = data[i]
      if (nextData?.value) {
        i++
        let value = nextData.value
        let name = nextData.name
        for (let j = 0; j < value.length; j++) {
          if (value?.[j]) {
            obj = { ...obj, [name]: value[j] }
            loopCl(data, i, obj, result)
          }
        }
      }
    }
  }

  /**
  Dung luong  [ 1 , 2 , 3] data
  Color       [ 1 , 2 , 3] nextData => data
  Version     [ 1 , 2 , 3] => nextData
  ....

  => [1,1,1] , [1,1,2], [1,1,3]
  => [1,2,1] , [1,2,2], [1,2,3]
  => [1,3,1] , [1,3,2], [1,3,3]

  => [2,1,1] , [2,1,2], [2,1,3]
  => [2,2,1] , [2,2,2], [2,2,3]
  => [2,3,1] , [2,3,2], [2,3,3]

  => [3,1,1] , [3,1,2], [3,1,3]
  => [3,2,1] , [3,2,2], [3,2,3]
  => [3,3,1] , [3,3,2], [3,3,3]
   */

  const renderVariant = (_, position) => {
    const item = groupVariantRef.current[position]
    if (!item) return

    const { _id, attributes: attributesItem, ...restItem } = item
    let html = null
    console.log('groupVariantRef.current', groupVariantRef.current)
    html = (
      <Panel
        collapsible
        header={
          <Stack justifyContent="space-between">
            <span>
              {Object.keys(attributesItem)
                .map((key) => attributesItem[key])
                ?.join(' - ')}
            </span>
            <ButtonGroup className="pe-4">
              <Checkbox className={styles.selectItem} checked={restItem?.purchasable} value={true}>
                Bật
              </Checkbox>
              <Checkbox
                className={styles.selectItem}
                checked={restItem?.stock_status === 'instock'}
                defaultValue={restItem?.stock_status}
                onChange={(value, checked) => console.log(value, checked)}
              >
                Còn hàng
              </Checkbox>
            </ButtonGroup>
          </Stack>
        }
        bordered
        key={[position, attributesItem]}
      >
        <div className={styles.groupItem}>
          <Form.Group controlId={['price', position]}>
            <Form.ControlLabel>Giá tiền</Form.ControlLabel>
            <PInput position={position} value={restItem?.price} name={'price'} ref={groupVariantRef} price />
          </Form.Group>

          <Form.Group controlId={['regular_price', position]}>
            <Form.ControlLabel>Giá gạch</Form.ControlLabel>
            <PInput
              position={position}
              value={restItem?.regular_price}
              name={'regular_price'}
              ref={groupVariantRef}
              price
            />
          </Form.Group>

          {Object.keys(attributesItem).map((key) => (
            <Form.Group controlId={[key, position]}>
              <Form.ControlLabel>{key}</Form.ControlLabel>
              <Select attributes={attributes} position={position} name={key} ref={groupVariantRef} />
            </Form.Group>
          ))}
        </div>
      </Panel>
    )
    return html
  }

  const getVariant = () => groupVariantRef.current?.map((_, index) => renderVariant(_, index))

  console.log(variations)
  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <VariantTypeSelection options={options} ref={typeRef} />

        <Button
          className="px-4 "
          style={{ color: 'var(--rs-primary-100)', background: 'var(--rs-blue-800)' }}
          onClick={handleAddVariant}
        >
          Thêm
        </Button>
      </div>
      <div className={styles.contentAttr}>{getVariant()}</div>
    </div>
  )
})

const VariantTypeSelection = forwardRef(({ options }, ref) => {
  const [_render, setRender] = useState(false)

  const handleSelect = (value) => {
    ref.current = value
    setRender(!_render)
  }

  return <SelectPicker data={options} onSelect={handleSelect} />
})

const Select = forwardRef(({ attributes, name, position, ...props }, ref) => {
  const [_render, setRender] = useState(false)

  const item = ref.current[position]

  const optiosnMemoiz = (selectOptions) => selectOptions?.value?.map((_val) => ({ label: _val, value: _val }))

  const handleSelect = (value) => {
    item.attributes[name] = value
    setRender(!_render)
  }

  let optionTarget = attributes.find((item) => item.name === name)

  return (
    <SelectPicker
      data={optiosnMemoiz(optionTarget)}
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
  console.log(item)

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

export default VariantGroup
