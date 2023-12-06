import clsx from 'clsx'
import React from 'react'

import styles from './styles.module.scss'

export default function Divider(props) {
  return <div {...props} className={clsx([styles.divider, props?.divideClass])} />
}
