import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import PageHeader from 'component/UI/Content/PageHeader'
import JsonViewer from 'component/UI/JsonViewer'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  ButtonGroup,
  Form,
  List,
  Panel,
  Placeholder,
  Radio,
  RadioGroup,
  Table,
  Schema,
  Stack,
  IconButton,
  Avatar,
} from 'rsuite'
import GlobalOrderService from 'service/global/Order.service'
import GlobalProductService from 'service/global/Product.service'
import { CheckoutModel } from 'src/constant/model.constant'
import { formatCurrency } from 'src/helper'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import { useDevStore } from 'src/store/devStore'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function MyOrder() {
  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Tài khoản
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <CardBlock className="border-0">
                <Stack spacing={8} direction="column" justifyContent="center" alignItems="center">
                  <Stack.Item className="d-flex align-items-center" style={{ gap: 6 }}>
                    <Avatar src="https://avatars.githubusercontent.com/u/12592949" alt="@superman66" />
                    <span>User name</span>
                  </Stack.Item>

                  <ButtonGroup vertical>
                    <Button style={{ textAlign: 'left' }}>Đơn hàng</Button>
                    <Button style={{ textAlign: 'left' }}>Địa chỉ</Button>
                    <Button style={{ textAlign: 'left' }}>Tài khoản</Button>
                    <Button style={{ textAlign: 'left' }}>Thoát</Button>
                  </ButtonGroup>
                </Stack>
              </CardBlock>
            </div>
            <div className="col-10">
              <CardBlock className={clsx('border-0 ', styles.main)}>12345</CardBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
