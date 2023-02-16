import CloseIcon from '@rsuite/icons/Close'
import FunnelIcon from '@rsuite/icons/Funnel'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { FaSearch, FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa'
import { Button, ButtonGroup, Checkbox, CheckboxGroup, Drawer, IconButton, Stack, Tag, TagGroup } from 'rsuite'
import { useCommonStore } from 'src/store'
import styles from './styles.module.scss'
const pricingFilter = [
  {
    label: 'Từ thấp đến cao',
    value: ['price', -1],
    icon: <FaSortAmountDownAlt />,
  },
  {
    label: 'Từ cao đến đến',
    value: ['price', 1],
    icon: <FaSortAmountDown />,
  },
  {
    label: 'Dung lượng',
    value: ['Dung lượng', 1],
    icon: <FaSortAmountDown />,
  },
  {
    label: 'Dung lượng',
    value: ['Dung lượng', -1],
    icon: <FaSortAmountDownAlt />,
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

  const [filter, setFilter] = useState(props.filter)

  const openFilter = (placement) => setDrawer({ open: true, placement })

  const productCategory = useCommonStore((state) => state.productCategory)

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
    setDrawer((state) => ({ ...state, open: false }))
  }
  const handleFilterChange = (val) => {
    let lastElement = val.slice(-1)
    setFilter({ ...filter, maxPrice: lastElement.join('') })
  }
  const clearFilter = () => {
    setFilter({})
    setParentChange()
  }

  const color = ['orange', 'red', 'green', 'yellow', 'cyan', 'blue', 'white']

  const handleTagClick = (item) => {
    if (props.tagClick) {
      props.tagClick(item)
    }
  }

  const renderCategory = useMemo(() => {
    let html = []

    let cate_1 = productCategory.slice(0, productCategory.length / 2)
    let cate_2 = productCategory.slice(productCategory.length / 2)

    html = (
      <>
        <TagGroup className={styles.tagGroup}>
          {cate_2.map((item, index) => {
            return (
              <div className={styles.tagItem}>
                <Tag
                  color={color[(Math.random() * 6).toFixed(0)]}
                  key={Math.random() * 6}
                  className="shadow-sm"
                  onClick={() => handleTagClick(item)}
                >
                  {item.name}
                </Tag>
                {cate_1[index] && (
                  <Tag
                    color={color[(Math.random() * 6).toFixed(0)]}
                    key={Math.random() * 6}
                    className="shadow-sm"
                    onClick={() => handleTagClick(cate_1[index])}
                  >
                    {cate_1[index]?.name}
                  </Tag>
                )}
              </div>
            )
          })}
        </TagGroup>
      </>
    )
    return html
  }, [productCategory])

  return (
    <div className={'row gy-2'}>
      {/* <div className="col-12">
        <div className={clsx(styles.filter, styles.showOnMD)}>
          <Button onClick={() => openFilter('left')}>
            <FunnelIcon /> Bộ lọc
          </Button>
        </div>
      </div> */}
      <div className="col-12">
        <div className={clsx(styles.filter, styles.showOnMD)}>
          <h5 style={{ color: 'var(--rs-gray-800)' }}>Danh mục</h5>
          {renderCategory}
        </div>
      </div>

      <div className="col-12">
        <div className={styles.sort}>
          <h5 style={{ color: 'var(--rs-gray-800)' }}>Sắp xếp theo</h5>
          <div className={styles.flex}>
            {renderButtonSort} <IconButton icon={<CloseIcon />} onClick={clearFilter} className={clsx(styles.btn)} />
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
