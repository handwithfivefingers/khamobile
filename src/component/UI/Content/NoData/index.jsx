import React from 'react'
import { FcDeleteDatabase } from 'react-icons/fc'
import { Panel } from 'rsuite'
import styles from './styles.module.scss'
export default function NoData() {
  return (
    <Panel bodyFill className={styles.noItem}>
      <span className={styles.desc}>Hiện chưa có dữ liệu!</span>
      <FcDeleteDatabase className={styles.icon} />
    </Panel>
  )
}
