import { isEqual } from 'lodash'
import { memo, useMemo, useRef, useState } from 'react'
import { Radio, RadioGroup, Loader } from 'rsuite'
import AttributeGroup from './AttributeGroup'
import styles from './styles.module.scss'
// import VariantGroup from './VariantGroup'
import dynamic from 'next/dynamic'
import clsx from 'clsx'

const VariantGroup = dynamic(() => import('./VariantGroup'))
// const VariantGroup = lazy(() => import('./VariantGroup'))
const GroupVariant = (props) => {
  const [sideActiveKey, setSideActiveKey] = useState(1)

  const variantRef = useRef()

  const renderBySideActiveKey = useMemo(() => {
    let html = null

    switch (sideActiveKey) {
      case 1:
        html = <AttributeGroup {...props} ref={variantRef} />
        break
      case 2:
        html = <VariantGroup {...props} ref={variantRef} />

        break
      case 3:
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
        <Radio value={1}>Thuộc tính</Radio>
        <Radio value={2}>Các biến thể</Radio>
        <Radio value={3}>Các sản phẩm được kết nối</Radio>
      </RadioGroup>

      <div className={clsx(styles.contentVariant, 'position-relative')}>{renderBySideActiveKey}</div>
    </div>
  )
}

export default memo(GroupVariant)
