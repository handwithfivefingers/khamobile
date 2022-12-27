import React from 'react'
import { List } from 'rsuite'

export default function DeliveryModal({ deliveryInformation, ...props }) {
  return (
    <List>
      {Object.keys(deliveryInformation).map((key) => {
        return <List.Item>{deliveryInformation[key]}</List.Item>
      })}
    </List>
  )
}
