import AdminLayout from 'component/UI/AdminLayout'
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd'
import { useState, useEffect, useRef, cloneElement } from 'react'
import dynamic from 'next/dynamic'
import { Button, Drawer, RadioTileGroup, RadioTile } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { VscNotebookTemplate, VscRepoClone, VscFile } from 'react-icons/vsc'
const DynamicProductComponentInput = dynamic(() => import('component/UI/Content/DynamicContent/Products'))
const Card = dynamic(() => import('component/UI/Content/Card'), { ssr: false })
const Side = ({ data, mainId }) => {
  const [tab, setTabs] = useState(1)
  return (
    <div className="header flex flex-col gap-2">
      <div className="header flex flex-row gap-2 w-full">
        <RadioTileGroup
          defaultValue="blank"
          inline
          aria-label="Create new project"
          onChange={(e) => setTabs(e)}
          className="w-full"
        >
          <RadioTile icon={<Icon as={VscFile} />} label="Component" value="1" className="w-1/2" />
          <RadioTile icon={<Icon as={VscNotebookTemplate} />} label="Layout" value="2" className="w-1/2" />
        </RadioTileGroup>
      </div>
      <div className="content flex flex-col gap-2">
        {tab == 1
          ? data
              .filter((item) => item.tab === 'component')
              .map((item, i) => {
                return (
                  <ItemDragable
                    index={i}
                    id={mainId + '_' + item.id}
                    component={item.component}
                    key={`${mainId}_${item.id}_${i}`}
                  />
                )
              })
          : ''}
        {tab == 2
          ? data
              .filter((item) => item.tab === 'layout')
              .map((item, i) => {
                return (
                  <ItemDragable
                    index={i}
                    id={mainId + '_' + item.id}
                    component={item.component}
                    key={`${mainId}_${item.id}_${i}`}
                  />
                )
              })
          : ''}
      </div>
    </div>
  )
}

const ItemDragable = ({ id, index, component, config, openConfigs, children }) => {
  const draggableId = id + '_' + index
  console.log('component', component)
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            key={id}
            onClick={() => config?.component && openConfigs({ open: true, component: config?.component })}
          >
            {children ? cloneElement(component, component.props, children) : component}
          </div>
        )
      }}
    </Draggable>
  )
}

const List = ({ data, mainId, openConfigs }) => {
  const renderList = (list, parentId) => {
    let html = []
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      let result = null
      const id = parentId ? parent + '_' : '' + mainId + '_' + item.id
      if (item.children?.length) {
        result = (
          <ItemDragable
            {...item}
            openConfigs={openConfigs}
            index={i}
            id={id}
            component={item.component}
            key={`${id}_${i}`}
          >
            {renderList(item.children, id)}
          </ItemDragable>
        )
      } else {
        result = (
          <ItemDragable
            {...item}
            openConfigs={openConfigs}
            index={i}
            id={id}
            component={item.component}
            key={`${id}_${i}`}
          />
        )
      }

      html.push(result)
    }
    return html
  }
  return <div className="bg-slate-50 w-full h-full">{renderList(data)}</div>
}

const listDND = {
  body: {
    id: 'main',
    data: [],
  },
  sidebar: {
    id: 'side',
    data: [
      {
        tab: 'component',
        type: 'card',
        component: <Card />,
        id: 'card',
        config: {
          component: (
            <div className="border p-4">
              <div className="form-control ">
                <label>Img Src</label>
                <input name="imgSrc" className="p-2 border border-blue-500" />
              </div>
            </div>
          ),
        },
      },
      {
        tab: 'component',
        type: 'image',
        component: <div className="w-[100px] h-[100px] rounded border bg-slate-50" />,
        id: 'image',
      },
      {
        tab: 'component',
        type: 'text',
        component: <p>Text</p>,
        id: 'text',
      },
      {
        tab: 'layout',
        type: 'col_12',
        component: (
          <div className="grid grid-cols-1 w-full h-[50px] gap-4 border">
            <div className="bg-slate-100 col-span-1 ">Col 12</div>
          </div>
        ),
        id: 'col_12',
      },
      {
        tab: 'layout',
        type: 'col_6',
        component: (
          <div className="grid grid-cols-2 w-full h-[50px] gap-4 border">
            <div className="bg-slate-100 col-span-1">Col 6</div>
            <div className="bg-slate-100 col-span-1">Col 6</div>
          </div>
        ),
        id: 'col_6',
      },
    ],
  },
}

function Demo2() {
  const [hasMounted, setHasMounted] = useState(false)
  const [state, setState] = useState(listDND)
  const len = state.sidebar.data.length
  const ref = useRef(null)
  // const [open, setOpen] = useState(false)
  // const component =
  const [drawer, setDrawer] = useState({
    open: false,
    component: null,
  })
  useEffect(() => {
    setHasMounted(true)
    return () => setHasMounted(false)
  }, [])

  const onDragEnd = (result) => {
    console.log('result', result)
    const { destination, source, draggableId, combine } = result

    console.log(
      `!combine || !destination || destination.droppableId !== 'main'`,
      !combine || !destination || destination.droppableId !== 'main',
    )
    if (!combine && !destination) return // prevent drop from main to side
    if (destination && destination?.droppableId !== 'main') return
    // if (destination.droppableId === source.droppableId && destination.index === source.index) return

    let target
    const { body, sidebar } = state
    const { id: mainId, data: bodyData } = body
    const { id: sideId, data: sideData } = sidebar
    const isSidebar = draggableId.includes('side_')
    const isMain = source.droppableId === 'main'
    const findItem = (id, list) => list.find((item) => `${id}_${item.id}_${source.index}` === draggableId)
    if (combine) {
      const targetId = combine?.draggableId

      console.log('isCombine is true')

      let itemMove

      if (isMain) itemMove = findItem(mainId, bodyData)
      else itemMove = findItem(sideId, sideData)

      bodyData.map((item, i) => {
        if (`${mainId}_${item.id}_${i}` == targetId) {
          if (Array.isArray(item.children)) {
            item.children.push(itemMove)
          } else {
            item.children = [itemMove]
          }
        }
        return item
      })

      bodyData.splice(source.index, 1)

      // bodyData.splice(destination.index, 0, target)

      console.log('itemMove', itemMove)
      console.log('bodyData', bodyData)

      return
    }

    // Push data from side to main
    if (isSidebar) {
      target = sideData.find((item) => `${sideId}_${item.id}_${source.index}` === draggableId)
      console.log('target', target, sideData)
      if (!target) return
      const nextTarget = Object.assign({}, target)
      bodyData.push(nextTarget)
    } else {
      target = sideData.find((item) => `${mainId}_${item.id}_${source.index}` === draggableId)
      if (!target) return
      bodyData.splice(source.index, 1)
      bodyData.splice(destination.index, 0, target)
    }
    body.data = bodyData
    sidebar.data = sideData
    setState({ sidebar, body })
  }

  const exportHTML = () => {
    console.log(ref.current.outerHTML)
  }

  if (!hasMounted) return null
  return (
    <div>
      <Button onClick={exportHTML}>Export HTML</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row w-full gap-2">
          <Droppable droppableId={`side`}>
            {(provided) => {
              return (
                <>
                  <div
                    ref={(innerRef) => {
                      provided.innerRef(innerRef)
                      ref.current = innerRef
                    }}
                    {...provided.droppableProps}
                    className="w-3/4 border border-dashed p-2 border-blue-500 flex flex-col gap-4"
                  >
                    <Droppable droppableId="main" isCombineEnabled>
                      {(props, snapshot) => {
                        return (
                          <div ref={props.innerRef} {...props.droppableProps} className="w-full h-full">
                            <List
                              data={state.body.data}
                              placeholder={props.placeholder}
                              startIndex={len}
                              mainId={state.body.id}
                              openConfigs={setDrawer}
                            />
                            {props.placeholder}
                          </div>
                        )
                      }}
                    </Droppable>
                  </div>
                  <div
                    {...provided.droppableProps}
                    className="w-1/4 border border-dashed p-2 border-blue-500 flex flex-col gap-4"
                  >
                    <Side data={state.sidebar.data} mainId={state.sidebar.id} />
                    {provided.placeholder}
                  </div>
                </>
              )
            }}
          </Droppable>
        </div>
      </DragDropContext>
      <Drawer open={drawer.open}>{drawer.component}</Drawer>
    </div>
  )
}

Demo2.Admin = AdminLayout

export default Demo2
