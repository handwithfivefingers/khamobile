import clsx from 'clsx'
import { BsInboxes } from 'react-icons/bs'
import { Panel } from 'rsuite'
import styles from './styles.module.scss'
export default function NoData(props) {
  return (
    <Panel bodyFill className={styles.noItem} style={props.style}>
      <span className={clsx('text-secondary', styles.desc)}>{props?.description || 'Nothing here'}</span>
      <BsInboxes className={styles.icon} style={{ fontSize: 36, color: 'var(--rs-blue-800)' }} />
    </Panel>
  )
}
