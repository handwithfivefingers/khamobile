import React, { forwardRef, useRef, useState, useMemo } from 'react'
import {
  Button,
  ButtonGroup,
  FlexboxGrid,
  Panel,
  Placeholder,
  Radio,
  RadioGroup,
  SelectPicker,
  Stack,
  TagInput,
  TagPicker,
} from 'rsuite'
import styles from './styles.module.scss'
export default function GroupVariant(props) {
  const [sideActiveKey, setSideActiveKey] = useState(1)
  const variantRef = useRef()
  const renderBySideActiveKey = useMemo(() => {
    let html = null

    switch (sideActiveKey) {
      case 1:
        html = <AttributeGroup {...props} ref={variantRef} />
        break
      case 2:
        html = <></>
        break
      case 3:
        break
      default:
        break
    }

    return html
  }, [sideActiveKey])

  return (
    <div className={styles.groupVariant}>
      <RadioGroup
        name="radioList"
        appearance="picker"
        defaultValue={1}
        onChange={(val) => setSideActiveKey(val)}
        className={styles.sideVariant}
      >
        <Radio value={1}>Thuộc tính</Radio>
        <Radio value={2}>Các biến thể</Radio>
        <Radio value={3}>Các sản phẩm được kết nối</Radio>
      </RadioGroup>

      <div className={styles.contentVariant}>{renderBySideActiveKey}</div>
    </div>
  )
}

const AttributeGroup = forwardRef((props, ref) => {
  const { attributes } = props

  const [attr, setAttr] = useState()

  const [listAttr, setListAttr] = useState([])

  const options = useMemo(() => {
    let opts = []

    if (attributes?.length) {
      opts = attributes.map(({ _id, item }) => ({
        label: _id,
        value: _id,
      }))
    }
    return opts
  }, [attributes, listAttr])

  const handleAddAttribute = () => {
    const nextListAttr = [...listAttr]

    let child = attributes.find((_item) => _item._id === attr)

    nextListAttr.push({ name: attr, child: child?.item || [] })

    setListAttr(nextListAttr)
  }

  const renderAccordion = (item, position) => {
    let html = null
    console.log('renderAccordion', item)
    html = (
      <Panel header={item.name} collapsible bordered className={styles.contentItem}>
        <Stack spacing={12}>
          <span>Tên:</span>
          <span>{item.name}</span>
        </Stack>
        <Stack spacing={12}>
          <span>Giá trị:</span>
          <Stack.Item grow={1}>
            <TagPicker
              creatable
              trigger={['Enter', 'Space', 'Comma']}
              placeholder="Enter, Space, Comma"
                data={item.child?.map((_item) => ({ label: _item.name, value: _item.name }))}
              style={{ width: '100%', flex: 1 }}
              onCreate={(value, item) => {
                console.log(value, item)
              }}
            />
          </Stack.Item>
        </Stack>
      </Panel>
    )
    return html
  }
  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <SelectPicker
          data={options}
          onSelect={(value) => setAttr(value)}
          disabledItemValues={listAttr?.map((item) => item.name)}
        />

        <Button
          className="px-4 "
          style={{ color: 'var(--rs-primary-100)', background: 'var(--rs-blue-800)' }}
          onClick={handleAddAttribute}
        >
          Thêm
        </Button>
      </div>
      <div className={styles.contentAttr}>{listAttr.map((_item, index) => renderAccordion(_item, index))}</div>
    </div>
  )
})
