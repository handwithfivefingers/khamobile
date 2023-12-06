import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { memo, useMemo, useRef, useState } from 'react'
import { Radio, RadioGroup } from 'rsuite'
import AttributeGroup from './AttributeGroup'
import InformationGroup from './InformationGroup'
import styles from './styles.module.scss'

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
        style={{ minHeight: 200 }}
      >
        <Radio value={1}>Thông tin cơ bản</Radio>
        <Radio value={2} disabled={props?.productType?.type === 'simple'}>
          Thuộc tính
        </Radio>
        <Radio value={3} disabled={props?.productType?.type === 'simple'}>
          Các biến thể
        </Radio>
        <Radio value={4}>Liên kết sản phẩm</Radio>
      </RadioGroup>

      <div className={clsx(styles.contentVariant, 'position-relative')}>{renderBySideActiveKey}</div>
    </div>
  )
}

export default memo(GroupVariant)
