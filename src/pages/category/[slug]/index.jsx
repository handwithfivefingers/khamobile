import FunnelIcon from '@rsuite/icons/Funnel'
import clsx from 'clsx'
import Card from 'component/UI/Content/Card'
import CardBlock from 'component/UI/Content/CardBlock'
import PageHeader from 'component/UI/Content/PageHeader'
import SideFilter from 'component/UI/Content/SideFilter'
import CommonLayout from 'component/UI/Layout'
import axios from 'configs/axiosInstance'
import { useState } from 'react'
import { Button, Divider, Drawer, IconButton, InputNumber, SelectPicker } from 'rsuite'
import styles from './styles.module.scss'
const CustomInputNumber = ({ rowKey, value, ...props }) => {
  return <InputNumber value={value} {...props} />
}
const pricingFilter = [
  {
    label: 'Từ thấp đến cao',
    value: ['price', '1'],
  },
  {
    label: 'Từ cao đến đến',
    value: ['price', '-1'],
  },
  {
    label: 'Mới nhất',
    value: ['feature', '1'],
  },
  {
    label: 'Hot nhất',
    value: ['createdAt', '1'],
  },
]
export default function SingleCategory({ data }) {
  const [drawer, setDrawer] = useState({
    open: false,
    placement: '',
  })

  const openFilter = (placement) => setDrawer({ open: true, placement })

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left divideClass={styles.divideLeft}>
          {data.name}
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container product_detail">
          <div className="row gy-4">
            <div className={clsx('col-12 col-md-4 col-lg-2', styles.hideOnMD)}>
              <SideFilter />
            </div>

            <div className={clsx([styles.vr, 'col-12 col-md-8 col-lg-10 '])}>
              <CardBlock>
                <div className="row gy-4">
                  <div className="col-12">
                    <p>
                      The category description can be positioned anywhere on the page via the layout page builder inside
                      the
                    </p>
                  </div>
                  <Divider />
                  <div className="col-6">
                    <div className={clsx(styles.filter, styles.showOnMD)}>
                      <label>Filter: </label>
                      <IconButton icon={<FunnelIcon />} onClick={() => openFilter('left')} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles.sort}>
                      <label>Pricing: </label>
                      <SelectPicker data={pricingFilter} style={{ width: 224 }} />
                    </div>
                  </div>

                  {data?.child?.map((item) => {
                    return (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={item._id}>
                        <Card
                          imgSrc={item.img?.[0]?.filename}
                          title={item.title}
                          price={item.price}
                          underlinePrice={item?.underlinePrice || null}
                          type={item.type}
                          variable={item.variable}
                          slug={`/product/${item.slug}`}
                        />
                      </div>
                    )
                  })}
                </div>
              </CardBlock>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        placement={drawer.placement}
        open={drawer.open}
        onClose={() => setDrawer({ ...drawer, open: false })}
        size="xs"
      >
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setDrawer({ ...drawer, open: false })}>Cancel</Button>
            <Button onClick={() => setDrawer({ ...drawer, open: false })} appearance="primary">
              Confirm
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <SideFilter />
        </Drawer.Body>
      </Drawer>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query

  const resp = await axios.get('/product_category' + '/' + slug)
  const data = resp.data
  return {
    props: data,
  }
}

SingleCategory.Layout = CommonLayout
