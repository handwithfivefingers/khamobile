import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import AdminLayout from 'component/UI/AdminLayout'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState, forwardRef } from 'react'
import { ButtonGroup, Content, IconButton, Input, Message, Pagination, Popover, Stack, Table, Whisper } from 'rsuite'
import { PostService } from 'service/global'
import { formatCurrency } from 'src/helper'
import { useCommonStore } from 'src/store'
const { Column, HeaderCell, Cell } = Table

const RenderAlert = forwardRef(({ right, top, className, ...props }, ref) => {
  return (
    <Popover ref={ref} className={className} full>
      <Message showIcon type="warning" header="Bạn có muốn xóa?">
        <ButtonGroup>
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            appearance="default"
            color="blue"
            onClick={(event) => {
              props?.closeRef.current.close()
            }}
          />
          <IconButton
            icon={<CheckIcon />}
            size="sm"
            appearance="primary"
            color="blue"
            onClick={() => props.onClick()}
          />
        </ButtonGroup>
      </Message>
    </Popover>
  )
})
const ActionCell = ({ rowData, dataKey, onEdit, ...props }) => {
  const whisperRef = useRef()
  const onProgress = (event) => {
    props?.onDelete(rowData, event)
  }
  return (
    <Cell {...props} className="link-group">
      <Stack spacing={8}>
        <IconButton onClick={() => onEdit(rowData)} size="sm" appearance="primary" icon={<EditIcon />} color="blue" />
        <Whisper
          placement="leftStart"
          trigger="click"
          speaker={<RenderAlert {...props} onClick={onProgress} closeRef={whisperRef} />}
          ref={whisperRef}
        >
          <IconButton size="sm" appearance="primary" icon={<TrashIcon />} color="red" />
        </Whisper>
      </Stack>
    </Cell>
  )
}

const Posts = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [posts, setPosts] = useState([])

  const [pagiConfig, setPagiConfig] = useState({
    page: 1,
    limit: 10,
  })
  useEffect(() => {
    changeTitle('Bài viết')
    getPostData()
  }, [])

  const getPostData = async () => {
    try {
      setLoading(true)
      const res = await PostService.getPosts()
      setPosts(res.data.data)
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (rowData, event) => {
    try {
      // let resp = await ProductService.deleteProduct({ _id: rowData._id, type: rowData.type })
      // if (resp.status === 200) {
      // }
    } catch (error) {
      console.log('deleteProduct', error, error?.response?.data)
    } finally {
      getProducts()
    }
  }

  const handleEdit = async (rowData, event) => {
    router.push(`./posts/${rowData._id}`)
  }

  const getData = () => {
    return posts.filter((v, i) => {
      const start = pagiConfig.limit * (pagiConfig.page - 1)
      const end = start + pagiConfig.limit
      return i >= start && i < end
    })
  }

  return (
    <>
      <Stack spacing={10} className="py-2">
        <span>Tìm kiếm: </span>
        <Input placeholder="Tên sản phẩm" onChange={(v) => setFilter((state) => ({ ...state, title: v }))} />
        {/* <SelectPicker
            placeholder="Danh mục"
            data={categorySelector || []}
            onChange={(v) => setFilter((state) => ({ ...state, category: v }))}
          /> */}
      </Stack>
      <Content className={'bg-w'}>
        <Table height={60 * (pagiConfig.limit + 1)} rowHeight={60} data={getData()} loading={loading}>
          <Column width={60} align="center" fixed fullText>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id">{(rowData) => <span onClick={(e) => e.preventDefault()}>{rowData['_id']}</span>}</Cell>
          </Column>

          <Column width={150} flexGrow={1}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Ngày cập nhật</HeaderCell>
            <Cell dataKey="updatedAt">
              {(rowData) => <span>{moment(rowData.updatedAt).format('DD/MM/YYYY')}</span>}
            </Cell>
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Ngày tạo</HeaderCell>
            <Cell dataKey="createdAt">
              {(rowData) => <span>{moment(rowData.createdAt).format('DD/MM/YYYY')}</span>}
            </Cell>
          </Column>

          <Column width={120} fullText>
            <HeaderCell>Price</HeaderCell>
            <Cell dataKey="price">{(rowData) => <span>{formatCurrency(rowData.price, { symbol: ' đ' })}</span>}</Cell>
          </Column>

          <Column width={100} align="center">
            <HeaderCell>
              <IconButton
                icon={<PlusIcon />}
                size="xs"
                color="blue"
                appearance="primary"
                onClick={() => router.push('./posts/create')}
              />
            </HeaderCell>

            <ActionCell onDelete={handleDelete} onEdit={handleEdit} right={0} />
          </Column>
        </Table>
        <div style={{ padding: 20 }}>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
            total={posts.length}
            limitOptions={[10, 30, 50]}
            limit={pagiConfig.limit}
            activePage={pagiConfig.page}
            onChangePage={(page) => setPagiConfig((prev) => ({ ...prev, page }))}
            onChangeLimit={(limit) => setPagiConfig((next) => ({ ...next, limit }))}
          />
        </div>
      </Content>
    </>
  )
}
Posts.Admin = AdminLayout

export default Posts
