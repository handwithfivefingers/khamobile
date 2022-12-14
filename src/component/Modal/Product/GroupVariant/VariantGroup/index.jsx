import { forwardRef, lazy, useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { Button, ButtonGroup, Loader, Panel, SelectPicker, Stack } from 'rsuite'
import styles from './styles.module.scss'

// import VariantItem from './VariantItem'

const VariantItem = lazy(() => import('./VariantItem'))

const VariantGroup = forwardRef(({ variableData, variation, attribute, ...props }, ref) => {
  const { attributes } = attribute
  const { variations, setVariations } = variation
  const [_trigger, setTrigger] = useState(false)

  const groupVariantRef = useRef([])

  const typeRef = useRef()

  const options = useMemo(() => {
    return [
      {
        label: 'Thêm biến thể',
        value: 1,
      },
      {
        label: 'Tạo biến thể từ tất cả thuộc tính',
        value: 2,
      },
      {
        label: 'Xóa tất cả biến thể',
        value: 3,
      },
    ]
  }, [])

  useEffect(() => {
    console.log('trigger rendered variation')
    if (variations?.length) {
      console.log('trigger rendered 1')

      groupVariantRef.current = variations
      setTrigger(!_trigger)
    }
  }, [])

  const handleAddVariant = () => {
    let nextState = [...groupVariantRef.current]
    switch (typeRef.current) {
      case 1: // Add Single variant
        // newVariant =
        let obj = {}
        for (let { name, value } of attributes) {
          obj[name] = ''
        }

        nextState.push({
          attributes: obj,
          price: '',
          regular_price: '',
          stock_status: 'instock',
          purchasable: true,
          _id: '',
        })

        groupVariantRef.current = nextState

        break
      case 2: // MutiItem
        const res = loopToLoop(attributes)
        nextState = [...nextState, ...res]
        console.log('nextState 2', nextState)

        groupVariantRef.current = nextState
        break
      case 3: // Clear all variants
        groupVariantRef.current = []
        break
    }
    setVariations(groupVariantRef.current)
    // setTrigger(!_trigger)
  }
  /**
   *
   * @param { [ { name, value: ['attribute', ...] }] } data
   * @return { [ { name : 'attribute'} ] }
   */

  const loopToLoop = (data) => {
    let i = 0
    let obj = {}
    let result = []
    loopCl(data, i, obj, result)

    return result
  }

  const loopCl = (data, i, obj, result) => {
    // console.log('i and obj: ', i, obj)
    // // console.log('data length', i, data.length)
    if (i >= data.length) {
      return result.push({
        attributes: obj,
        price: '',
        regular_price: '',
        stock_status: 'instock',
        purchasable: true,
        _id: '',
      })
    } else {
      const nextData = data[i]
      if (nextData?.value) {
        i++
        let value = nextData.value
        let name = nextData.name
        for (let j = 0; j < value.length; j++) {
          if (value?.[j]) {
            obj = { ...obj, [name]: value[j] }
            loopCl(data, i, obj, result)
          }
        }
      }
    }
  }

  /**
  Dung luong  [ 1 , 2 , 3] data
  Color       [ 1 , 2 , 3] nextData => data
  Version     [ 1 , 2 , 3] => nextData
  ....

  => [1,1,1] , [1,1,2], [1,1,3]
  => [1,2,1] , [1,2,2], [1,2,3]
  => [1,3,1] , [1,3,2], [1,3,3]

  => [2,1,1] , [2,1,2], [2,1,3]
  => [2,2,1] , [2,2,2], [2,2,3]
  => [2,3,1] , [2,3,2], [2,3,3]

  => [3,1,1] , [3,1,2], [3,1,3]
  => [3,2,1] , [3,2,2], [3,2,3]
  => [3,3,1] , [3,3,2], [3,3,3]
   */

  const renderVariant = (_, position) => {
    const item = groupVariantRef.current[position]
    if (!item) return

    const { _id, attributes: attributesItem, ...restItem } = item
    let html = null
    html = (
      <Panel
        collapsible
        header={
          <Stack justifyContent="space-between">
            <span>
              {Object.keys(attributesItem)
                .map((key) => attributesItem[key])
                ?.join(' - ')}
            </span>
            <ButtonGroup className="pe-4"></ButtonGroup>
          </Stack>
        }
        bordered
        key={[position, attributesItem]}
      >
        <Suspense fallback={<Loader content="vertical Loading..." vertical />}>
          <VariantItem
            data={restItem}
            attributes={attributes}
            attributesItem={attributesItem}
            position={position}
            ref={groupVariantRef}
          />
        </Suspense>
      </Panel>
    )
    return html
  }

  const getVariant = groupVariantRef.current?.map((_, index) => renderVariant(_, index))

  return (
    <div className={styles.group}>
      <div className={styles.selectAttr}>
        <VariantTypeSelection options={options} ref={typeRef} />

        <Button
          className="px-4 "
          style={{ color: 'var(--rs-primary-100)', background: 'var(--rs-blue-800)' }}
          onClick={handleAddVariant}
        >
          Thêm
        </Button>
      </div>
      <div className={styles.contentAttr}>{getVariant}</div>
    </div>
  )
})

const VariantTypeSelection = forwardRef(({ options }, ref) => {
  const [_render, setRender] = useState(false)

  const handleSelect = (value) => {
    ref.current = value
    setRender(!_render)
  }

  return <SelectPicker data={options} onSelect={handleSelect} />
})

export default VariantGroup
