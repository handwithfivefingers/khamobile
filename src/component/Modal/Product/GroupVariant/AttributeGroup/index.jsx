import React, { forwardRef, useRef, useState, useMemo, useEffect } from 'react'
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

const AttributeGroup = forwardRef(({ variableData, attribute, ...props }, ref) => {
  const { attributes, setAttributes } = attribute
  const [attr, setAttr] = useState()
  const [groupAttr, setGroupAttr] = useState([])

  useEffect(() => {
    if (attributes?.length) {
      // const value =
      const nextState = []
      for (const { name } of attributes) {
        let item = variableData.find((item) => item._id === name)
        if (item) {
          nextState.push({ name, child: item?.item })
        }
      }

      setGroupAttr(nextState)
    }
  }, [attributes])

  const options = useMemo(() => {
    let opts = []

    if (variableData?.length) {
      opts = variableData.map(({ _id, item }) => ({
        label: _id,
        value: [_id, item],
      }))
    }
    return opts
  }, [variableData, attributes])

  const handleAddAttribute = () => {
    const [attributeName, child] = attr

    const nextState = [...groupAttr]

    let index = nextState.findIndex((item) => item.name === attributeName)

    if (index !== -1) {
      nextState[index] = { name: attributeName, child }
    } else {
      nextState.push({ name: attributeName, child })
    }

    setGroupAttr(nextState)
    // console.log('handleAddAttribute', attributeName, child)
  }

  const renderAccordion = ({ name, child }, position) => {
    let html = null
    html = (
      <Panel header={name} collapsible bordered className={styles.contentItem}>
        <Stack spacing={12}>
          <label>Tên:</label>
          <Input value={name} plaintext />
        </Stack>

        <Stack spacing={12} className="mt-3">
          <label>Giá trị:</label>
          <Stack.Item grow={1}>
            <TagPicker
              // creatable
              trigger={['Enter', 'Space', 'Comma']}
              placeholder="Enter, Space, Comma"
              data={child?.map((_item) => ({ label: _item.name, value: _item.name }))}
              style={{ width: '100%', flex: 1 }}
              onChange={(value, event) => {
                const nextState = [...attributes]
                let index = nextState.findIndex((item) => item.name === name)
                if (index !== -1) {
                  nextState[index] = { name, value }
                } else {
                  nextState.push({ name, value })
                }
                setAttributes(nextState)
              }}
              value={attributes[position]?.value}
            />
          </Stack.Item>
        </Stack>
      </Panel>
    )
    return html
  }

  // console.log(groupAttr, attributes, variableData)
  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <SelectPicker
          data={options}
          onSelect={(value) => setAttr(value)}
          disabledItemValues={groupAttr?.map((item) => [item.name, item.child])}
        />

        <Button
          className="px-4 "
          style={{ color: 'var(--rs-primary-100)', background: 'var(--rs-blue-800)' }}
          onClick={handleAddAttribute}
        >
          Thêm
        </Button>
      </div>
      <div className={styles.contentAttr}>{groupAttr.map((_item, index) => renderAccordion(_item, index))}</div>
    </div>
  )
})

export default AttributeGroup
