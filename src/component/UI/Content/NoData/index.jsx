import clsx from 'clsx'
import React from 'react'
import { BsInboxes } from 'react-icons/bs'
import { FcDeleteDatabase } from 'react-icons/fc'
import { Panel } from 'rsuite'
import styles from './styles.module.scss'
export default function NoData(props) {
  return (
    <Panel bodyFill className={styles.noItem} style={props.style}>
      <span className={clsx('text-secondary', styles.desc)}>Không có sản phẩm phù hợp với tiêu chí bạn tìm</span>
      <BsInboxes className={styles.icon} style={{ fontSize: 36, color: 'var(--rs-blue-800)' }} />
    </Panel>
  )
}
