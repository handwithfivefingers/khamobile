import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button, Input, Panel, SelectPicker,
  Stack, TagPicker
} from 'rsuite'
import styles from './styles.module.scss'

const AttributeGroup = forwardRef(({ variableData, attribute, ...props }, ref) => {

  const { attributes, setAttributes } = attribute
  const [groupAttr, setGroupAttr] = useState([])

  const attributesRef = useRef()

  useEffect(() => {
    if (attributes?.length) {
      // const value =
      const nextState = []
      for (const { name } of attributes) {
        let item = variableData.find((item) => item._id?.key === name)
        if (item) {
          nextState.push({ name, child: item?.item })
        }
      }
      setGroupAttr(nextState)
    }
  }, [attributes, variableData])

  const options = useMemo(() => {
    let opts = []

    if (variableData?.length) {
      opts = variableData.map(({ _id, item }) => ({
        label: _id.key,
        value: [_id.key, item],
      }))
    }
    return opts
  }, [variableData, attributes])

  const handleAddAttribute = () => {
    if (!attributesRef.current) return
    const [attributeName, child] = attributesRef.current

    const nextState = [...groupAttr]

    let index = nextState.findIndex((item) => item.name === attributeName)

    if (index !== -1) {
      nextState[index] = { name: attributeName, child }
    } else {
      nextState.push({ name: attributeName, child })
      const newProps = [...attributes]
      newProps.push({ name: attributeName, value: [] })
      setAttributes(newProps)
    }

    attributesRef.current = null
    setGroupAttr(nextState)
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

  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <AttributeSelection ref={attributesRef} options={options} groupAttr={groupAttr} />

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

const AttributeSelection = forwardRef(({ options, groupAttr }, ref) => {
  const [_render, setRender] = useState(false)

  const handleSelect = (value) => {
    ref.current = value
    setRender(!_render)
  }

  return (
    <SelectPicker
      data={options}
      onSelect={handleSelect}
      disabledItemValues={groupAttr?.map((item) => [item.name, item.child])}
    />
  )
})


export default AttributeGroup
