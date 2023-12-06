import React, { useRef } from 'react'
import demoImg from 'assets/img/demo-phone.png'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { ButtonGroup, Panel, Placeholder, Stack, Button } from 'rsuite'
import parse from 'html-react-parser'
import ImageBlock from '../ImageBlock'

export default function CardPost({ loading = false, ...props }) {
  if (loading) return <CardSkeleton {...props} />
  return <Card {...props} />
}

function Card({ title, description, imgSrc, shadow, border, hover, cover, cardType, imgHeight = '250px' }) {
  const classCard = clsx([
    'card',
    styles.card,
    {
      [styles.shadow]: shadow,
      [styles.border]: border,
      [styles.hover]: hover,
      [styles.cover]: cover,
      [styles.horizontal]: cardType === 'horizontal',
      [styles.vertical]: cardType === 'vertical',
    },
  ])

  const imgRef = useRef(imgSrc)

  return (
    <div className={classCard}>
      <div className={clsx('card-img-top', styles.cardImg)}>
        <ImageBlock className={styles.img} src={imgSrc} ref={imgRef} objectFit={'cover'} height={imgHeight} />
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
