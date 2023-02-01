import { isEqual } from 'lodash'
import { memo, useMemo, useRef, useState } from 'react'
import { Radio, RadioGroup, Loader } from 'rsuite'
import AttributeGroup from './AttributeGroup'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import InformationGroup from './InformationGroup'

const VariantGroup = dynamic(() => import('./VariantGroup'))

const GroupVariant = (props) => {
  const [sideActiveKey, setSideActiveKey] = useState(1)

  const formRef = useRef()

  const renderBySideActiveKey = useMemo(() => {
    let html = null

    switch (sideActiveKey) {
      case 1:
        html = <InformationGroup {...props} ref={formRef} />
        break
      case 2:
        html = <AttributeGroup {...props} ref={formRef} />
        break
      case 3:
        html = <VariantGroup {...props} ref={formRef} />
        break
      case 4:
        break
      default:
        break
    }

    return html
  }, [sideActiveKey, props?.attribute])

  return (
    <div className={styles.groupVariant}>
      <RadioGroup
        name="radioList"
        appearance="picker"
        defaultValue={1}
        onChange={(val) => setSideActiveKey(val)}
        className={styles.sideVariant}
      >
        <Radio value={1}>Thông tin cơ bản</Radio>
        <Radio value={2}>Thuộc tính</Radio>
        <Radio value={3}>Các biến thể</Radio>
        <Radio value={4}>Các sản phẩm được kết nối</Radio>
      </RadioGroup>

      <div className={clsx(styles.contentVariant, 'position-relative')}>{renderBySideActiveKey}</div>
    </div>
  )
}

export default memo(GroupVariant)
