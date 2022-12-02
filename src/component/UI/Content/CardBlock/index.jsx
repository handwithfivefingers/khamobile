import React from 'react'
import demoImg from 'assets/img/demo-phone.png'
import styles from './styles.module.scss'
import clsx from 'clsx'

export default function CardBlock(props) {
  const classCard = clsx(['card', props.className, styles.card])
  return <div className={classCard}>{props.children}</div>
}
