import clsx from 'clsx'
import React from 'react'
import { Placeholder } from 'rsuite'
import styles from './styles.module.scss'
const CardSkeletonProduct = () => {
  const classCard = clsx([
    'card',
    styles.card,
    {
      [styles.shadow]: true,
      [styles.border]: true,
    },
  ])

  return (
    <div className={classCard}>
      <Placeholder.Graph active />
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <Placeholder.Paragraph rows={2} active />
        </div>
        <p className={styles.cardText}>
          <Placeholder.Paragraph rows={1} active />
        </p>
      </div>
    </div>
  )
}

const CardSkeletonPost = () => {
  const classCard = clsx([
    'card',
    styles.card,
    {
      [styles.shadow]: true,
      [styles.border]: true,
    },
  ])
  return (
    <div className={classCard}>
      <Placeholder.Graph active />
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <Placeholder.Paragraph rows={2} active />
        </div>
        <p className={styles.cardText}>
          <Placeholder.Paragraph rows={1} active />
        </p>
      </div>
    </div>
  )
}

const CardSkeletonCategory = () => {
  const classCard = clsx([
    'card',
    styles.card,
    {
      [styles.shadow]: true,
      [styles.border]: true,
    },
  ])
  return (
    <div className={classCard}>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <Placeholder.Paragraph rows={2} active />
        </div>
        <p className={styles.cardText}>
          <Placeholder.Paragraph rows={2} active />
        </p>
      </div>
    </div>
  )
}

export { CardSkeletonProduct, CardSkeletonPost, CardSkeletonCategory }
