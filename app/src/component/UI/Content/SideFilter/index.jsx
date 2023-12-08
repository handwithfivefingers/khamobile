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
    label: 'Giá tăng dần',
    value: ['price', 1],
    icon: <FaSortAmountDownAlt />,
  },
  {
    label: 'Giá giảm dần',
    value: ['price', -1],
    icon: <FaSortAmountDown />,
  },
]
const SideFilter = ({ withMemory = false, ...props }) => {
  const [drawer, setDrawer] = useState({
    open: false,
    placement: 'left',
  })

  const [filter, setFilter] = useState(props.filter)

  const openFilter = (placement) => setDrawer({ open: true, placement })

  const productCategory = useCommonStore((state) => state.productCategory)

  const memoryFilter = [
    {
      label: 'Dung lượng tăng dần',
      value: ['Dung lượng', 1],
      icon: <FaSortAmountDownAlt />,
    },
    {
      label: 'Dung lượng giảm dần',
      value: ['Dung lượng', -1],
      icon: <FaSortAmountDown />,
    },
  ]

  const renderButtonSort = useMemo(() => {
    const ListFilter = [...pricingFilter]
    if (withMemory) {
      ListFilter.push(...memoryFilter)
    }

    return ListFilter.map((item) => {
      return (
        <Button
          onClick={() => props?.onChange({ [item.value[0]]: item.value[1] })}
          className={clsx(styles.btn, 'hover:!bg-blue-500 hover:!text-white hover:shadow-lg hover:shadow-blue-500/50', {
            // [styles.active]: props?.filter?.[item.value[0]] === item.value[1],
            ['!bg-blue-500 !text-white shadow-lg shadow-blue-500/50']: props?.filter?.[item.value[0]] === item.value[1],
          })}
          key={Math.random()}
        >
          {item.icon} {item.label}
        </Button>
      )
    })
  }, [props.filter, withMemory])

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

  const color = ['blue', 'purple', 'pink', 'orange', 'cyan', 'white']

  const handleTagClick = (item) => {
    if (props.tagClick) {
      props.tagClick(item)
    }
  }
  // ;<button class="bg-cyan-500 shadow-lg shadow-cyan-500/50 ...">Subscribe</button>

  const renderCategory = useMemo(() => {
    let html = []

    let cate_1 = productCategory.slice(0, productCategory.length / 2)
    let cate_2 = productCategory.slice(productCategory.length / 2)
    html = (
      <>
        <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto">
          {cate_2.map((item, index) => {
            let i = (Math.random() * 6).toFixed(0)
            let cl = (num) =>
              num == 1
                ? `bg-blue-500 shadow-blue-500/50`
                : num == 2
                ? `bg-purple-500 shadow-purple-500/50`
                : num == 3
                ? `bg-pink-500 shadow-pink-500/50`
                : num == 4
                ? `bg-orange-500 shadow-orange-500/50`
                : num == 5
                ? `bg-cyan-500 shadow-cyan-500/50`
                : num == 6
                ? `bg-white-500 shadow-white-500/50`
                : ''

            return (
              <div className={clsx(styles.tagItem, '')} key={`randomColor_${i}_${index}`}>
                <button
                  class={`${cl(
                    (Math.random() * 6).toFixed(0),
                  )} !text-[rgba(0,0,0,0.5)] shadow-lg rounded px-4 py-1 w-[200px] truncate mb-3`}
                  onClick={() => handleTagClick(item)}
                >
                  {item.name}
                </button>
                {cate_1[index] && (
                  <button
                    class={`${cl(
                      (Math.random() * 6).toFixed(0),
                    )} !text-[rgba(0,0,0,0.5)] shadow-lg rounded px-4 py-1 w-[200px] truncate`}
                    onClick={() => handleTagClick(cate_1[index])}
                  >
                    {cate_1[index]?.name}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </>
    )
    return html
  }, [productCategory])

  return (
    <div className={'grid grid-cols-12 gap-y-2'}>
      <div className="col-span-12">
        <div className={clsx(styles.filter, styles.showOnMD)}>
          <h5 style={{ color: 'var(--rs-gray-800)' }}>Danh mục</h5>
          {renderCategory}
        </div>
      </div>

      <div className="col-span-12">
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
