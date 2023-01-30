import React from 'react'
import demoImg from 'assets/img/demo-phone.png'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { ButtonGroup, Panel, Placeholder, Stack, Button } from 'rsuite'
import parse from 'html-react-parser'

export default function CardPost({ loading = false, ...props }) {
  if (loading) return <CardSkeleton {...props} />
  return <Card {...props} />
}

function Card({ title, description, imgSrc, shadow, border, hover, cover }) {
  const classCard = clsx([
    'card',
    styles.card,
    {
      [styles.shadow]: shadow,
      [styles.border]: border,
      [styles.hover]: hover,
      [styles.cover]: cover,
    },
  ])

  return (
    <div className={classCard}>
      <div className={clsx('card-img-top', styles.cardImg)}>
        <img
          src={
            imgSrc ||
            'https://www.journal-theme.com/1/image/cache/catalog/journal3/gallery/aiony-haust-667702-unsplash-300x225w.jpg.webp'
          }
          className={styles.img}
          alt="..."
        />
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <h3>{title}</h3>
        </div>
        <p>{parse(description)}</p>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <Panel
      bordered
      header={
        <Stack justifyContent="space-between">
          <span>Report Title</span>
          <ButtonGroup>
            <Button active>Day</Button>
            <Button>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
        </Stack>
      }
    >
      <Placeholder.Paragraph rows={5} graph="image" />
    </Panel>
  )
}
