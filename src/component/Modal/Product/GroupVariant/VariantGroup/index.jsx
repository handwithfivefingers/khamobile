import React, { forwardRef, useRef, useState, useMemo, useCallback } from 'react'
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
} from 'rsuite'
import styles from './styles.module.scss'

const VariantGroup = forwardRef(({ variableData, attribute, ...props }, ref) => {
  const { attributes, setAttributes } = attribute
  // const [typeVariant, setTypeVariant] = useState()

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

  const handleAddVariant = () => {
    let nextState = [...groupVariantRef.current]
    switch (typeRef.current) {
      case 1: // Add Single variant
        // newVariant =
        let obj = {}
        for (let { name, value } of attributes) {
          obj[name] = ''
        }
        nextState.push(obj)
        groupVariantRef.current = nextState

        break
      case 2: // MutiItem
        const res = loopToLoop(attributes)
        nextState = [...nextState, ...res]
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
      return result.push(obj)
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
    let html = null
    html = (
      <Panel collapsible header={`Biến thể ${position + 1}`} bordered key={[position, item]}>
        <div className={styles.groupItem}>
          {Object.keys(item).map((key) => (
            <Select attribute={attribute} position={position} name={key} ref={groupVariantRef} />
          ))}
        </div>
      </Panel>
    )
    return html
  }

  const getVariant = () => groupVariantRef.current?.map((_item, index) => renderVariant(_item, index))

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

const Select = forwardRef(({ attribute, name, position, ...props }, ref) => {
  const [_render, setRender] = useState(false)
  const { attributes } = attribute

  const item = ref.current[position]

  const optiosnMemoiz = (selectOptions) => selectOptions?.value?.map((_val) => ({ label: _val, value: _val }))

  const handleSelect = (value) => {
    item[name] = value
    setRender(!_render)
  }

  let optionTarget = attributes.find((item) => item.name === name)

  return (
    <SelectPicker
      data={optiosnMemoiz(optionTarget)}
      placeholder={name}
      className={styles.selectItem}
      value={item[name] || ''}
      onSelect={handleSelect}
    />
  )
})

export default VariantGroup
