import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.scss'

export default function PageHeader(props) {
  const classProps = clsx([
    styles.header,
    {
      [styles.center]: props?.center,
    },
    props.className,
  ])
  const getHeading = () => {
    switch (props.type) {
      case 'h1':
        return (
          <h1 className={classProps} style={{ fontSize: 30, lineHeight: '42px' }}>
            {props.children}
          </h1>
        )
      case 'h2':
        return (
          <h2 className={classProps} style={{ fontSize: 30, lineHeight: '42px' }}>
            {props.children}
          </h2>
        )
      case 'h3':
        return (
          <h3 className={classProps} style={{ fontSize: 30, lineHeight: '42px' }}>
            {props.children}
          </h3>
        )
      case 'h4':
        return (
          <h4 className={classProps} style={{ fontSize: 30, lineHeight: '42px' }}>
            {props.children}
          </h4>
        )
      case 'h5':
        return (
          <h5 className={classProps} style={{ fontSize: 30, lineHeight: '42px' }}>
            {props.children}
          </h5>
        )
    }
  }

  return <div className={clsx(styles.heading, 'container mx-auto py-2')}>{getHeading()}</div>
}
