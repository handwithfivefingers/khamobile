import { forwardRef, lazy, useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { Button, ButtonGroup, FlexboxGrid, IconButton, Loader, Panel, PanelGroup, SelectPicker, Stack } from 'rsuite'
import styles from './styles.module.scss'
import { GrFormClose } from 'react-icons/gr'
// import VariantItem from './VariantItem'

const VariantItem = lazy(() => import('./VariantItem'))

const VariantGroup = forwardRef(({ variableData, variation, attribute, deleteVariation, ...props }, ref) => {
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
    if (variations?.length) {
      groupVariantRef.current = variations
      setTrigger(!_trigger)
    }
  }, [])

  const onHandleRemoveVariantPosition = (position) => {
    let nextState = [...groupVariantRef.current]
    const itemToDelete = groupVariantRef.current[position]

    if (itemToDelete._id) {
      if (!deleteVariation.delete.includes(itemToDelete._id)) deleteVariation.setDeleteVariation(itemToDelete._id)
    }

    nextState.splice(position, 1)
    groupVariantRef.current = nextState
    setVariations(nextState)
  }

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
        deleteVariation.setDeleteVariation(null, true)
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
          <div className="flex justify-between">
            <span>
              {Object.keys(attributesItem)
                .map((key) => attributesItem[key])
                ?.join(' - ')}
            </span>
            <div className="flex mx-4" onClick={(e) => e.stopPropagation()}>
              <IconButton
                icon={<GrFormClose />}
                className="p-1 mx-4"
                style={{ fontSize: 16 }}
                appearance="subtle"
                color="red"
                onClick={() => onHandleRemoveVariantPosition(position)}
              />
            </div>
          </div>
        }
        bordered
        key={[position, attributesItem]}
      >
        <Suspense fallback={<Loader content="vertical Loading..." vertical />}>
          <VariantItem
            {...props}
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

        <Button className="px-4 " appearance="primary" onClick={handleAddVariant}>
          Thêm
        </Button>
      </div>
      <div className={styles.contentAttr}>
        <PanelGroup>{getVariant}</PanelGroup>
      </div>
    </div>
  )
})

const VariantTypeSelection = forwardRef(({ options }, ref) => {
  const [_render, setRender] = useState(false)

  const handleSelect = (value) => {
    ref.current = value
    console.log(ref.current)
    setRender(!_render)
  }

  return <SelectPicker data={options} onSelect={handleSelect} style={{ minWidth: 150 }} />
})

export default VariantGroup
