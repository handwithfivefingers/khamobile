import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Col,
  Drawer,
  Form,
  IconButton,
  InputGroup,
  InputNumber,
  Radio,
  RadioGroup,
  RangeSlider,
  Row,
  SelectPicker,
  Stack,
  Tag,
  TagGroup,
} from 'rsuite'
import { formatCurrency } from 'src/helper'
import ImageBlock from '../ImageBlock'
import { Pricing } from '../KMInput'
import styles from './styles.module.scss'
import FunnelIcon from '@rsuite/icons/Funnel'
import { FaSortAmountDown, FaSortAmountDownAlt, FaSearch } from 'react-icons/fa'
import CloseIcon from '@rsuite/icons/Close'
const pricingFilter = [
  {
    label: 'Từ thấp đến cao',
    value: ['price', '1'],
    icon: <FaSortAmountDownAlt />,
  },
  {
    label: 'Từ cao đến đến',
    value: ['price', '-1'],
    icon: <FaSortAmountDown />,
  },
  // {
  //   label: 'Mới nhất',
  //   value: ['feature', '-1'],
  // },
  // {
  //   label: 'Hot nhất',
  //   value: ['createdAt', '-1'],
  // },
]
const SideFilter = (props) => {
  const [drawer, setDrawer] = useState({
    open: false,
    placement: 'left',
  })

  const [filter, setFilter] = useState({})

  const openFilter = (placement) => setDrawer({ open: true, placement })

  const renderButtonSort = useMemo(() => {
    return pricingFilter.map((item) => {
      return (
        <Button
          onClick={() => props?.onChange({ [item.value[0]]: item.value[1] })}
          className={clsx(styles.btn, {
            [styles.active]: props?.filter?.[item.value[0]] === item.value[1],
          })}
        >
          {item.icon} {item.label}
        </Button>
      )
    })
  }, [props.filter])

  const setParentChange = () => {
    props?.onChange(filter)
  }
  const handleFilterChange = (val) => {
    let lastElement = val.slice(-1)
    setFilter({ ...filter, maxPrice: lastElement.join('') })
  }
  const clearFilter = () => {
    setFilter({})
    setParentChange()
  }
  // console.log(filter, props?.filter)
  return (
    <div className={'row gy-2'}>
      <div className="col-12">
        <div className={clsx(styles.filter, styles.showOnMD)}>
          <h5 style={{ color: 'var(--rs-gray-800)' }}>Chọn theo tiêu chí</h5>

          <Button onClick={() => openFilter('left')}>
            <FunnelIcon /> Bộ lọc
          </Button>
        </div>
      </div>
      <div className="col-12">
        <div className={styles.sort}>
          <h5 style={{ color: 'var(--rs-gray-800)' }}>Sắp xếp theo</h5>
          <Stack spacing={6}>
            {renderButtonSort} <IconButton icon={<CloseIcon />} onClick={clearFilter} />
          </Stack>
        </div>
      </div>
      <Drawer
        placement={drawer.placement}
        open={drawer.open}
        onClose={() => setDrawer({ ...drawer, open: false })}
        size="xs"
      >
        <Drawer.Header>
          <Drawer.Title>Lọc sản phẩm</Drawer.Title>
          <Drawer.Actions>
            <ButtonGroup>
              <Button
                onClick={() => {
                  setFilter((prevState) => ({ ...prevState, maxPrice: '' }))
                  setParentChange()
                }}
              >
                <CloseIcon />
              </Button>

              <Button onClick={setParentChange}>
                <FaSearch />
              </Button>
            </ButtonGroup>
          </Drawer.Actions>
        </Drawer.Header>

        <Drawer.Body>
          <div className="row">
            <div className="col-12">
              <h5 style={{ color: 'var(--rs-gray-800)' }}>Giá tiền:</h5>
              <CheckboxGroup name="checkboxList" value={[filter.maxPrice]} onChange={handleFilterChange}>
                <Checkbox value="25">Dưới 25 Triệu</Checkbox>
                <Checkbox value="20">Dưới 20 Triệu</Checkbox>
                <Checkbox value="15">Dưới 15 Triệu</Checkbox>
                <Checkbox value="10">Dưới 10 Triệu</Checkbox>
                <Checkbox value="5">Dưới 5 Triệu</Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </div>
  )
}

export default SideFilter
