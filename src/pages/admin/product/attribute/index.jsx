import TrashIcon from '@rsuite/icons/Trash'
import VariableModal from 'component/Modal/Variable/create'
import AdminLayout from 'component/UI/AdminLayout'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import { useEffect, useRef, useState } from 'react'
import { Button, Col, Content, Form, Grid, IconButton, Modal, Popover, Row, Table, useToaster, Whisper } from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { AttributeModel } from 'src/constant/model.constant'
import { message } from 'src/helper'
import { useCommonStore } from 'src/store'
const { Column, HeaderCell, Cell } = Table

const ProductVariable = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const toaster = useToaster()
  const [attribute, setAttribute] = useState([])
  const [form, setForm] = useState({
    key: '',
  })

  const [modal, setModal] = useState({
    open: false,
    component: null,
  })

  const formRef = useRef()
  const whisperRef = useRef()
  useEffect(() => {
    changeTitle('Thuộc tính sản phẩm')
    getAttributes()
  }, [])

  const getAttributes = async () => {
    try {
      let resp = await ProductService.getAttributeList()
      const { data } = resp.data
      setAttribute(data)
    } catch (error) {
      console.log('getVariables error', error)
    }
  }

  const handleClose = () => setModal({ ...modal, open: false, component: null })

  const handleDelete = async (rowData) => {
    console.log(rowData)
    try {
      const resp = await ProductService.deleteAttribute(rowData._id)

      if (resp.status === 200) {
        toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
      }
    } catch (error) {
      toaster.push(message('error', error.response?.data?.message || error.response?.message), {
        placement: 'topEnd',
      })
    } finally {
      getAttributes()
    }
  }

  const onCreateAttributes = async () => {
    // console.log(form)
    try {
      if (!formRef.current.check()) return
      const resp = await ProductService.createAttribute({ key: form.key })
      console.log(resp)
    } catch (error) {
      console.log('onCreateAttributes error', error)
    } finally {
      getAttributes()
    }
  }

  const getAttributesTerm = async (_id) => {
    try {
      const resp = await ProductService.getAttributeTermById(_id)
      return resp.data.data
    } catch (error) {
      console.log('getAttributesTerm error', error)
    }
  }

  const handleSaveAtributesTerm = async (val, _id) => {
    console.log('save attributes term', val, _id)
    try {
      if (!_id) return
      const resp = await ProductService.saveAttributeTerm(_id, val)
      console.log(resp)
    } catch (error) {
      console.log('handleSaveAtributesTerm error', error)
    }
  }

  const handleOpenAttributesTerm = async (rowData) => {
    const data = await getAttributesTerm(rowData._id)
    setModal({
      ...modal,
      open: true,
      component: <VariableModal data={data} handleSubmit={handleSaveAtributesTerm} parentId={rowData._id} />,
    })
  }
  return (
    <>
      <Content>
        <div className="row gy-4">
          <Grid>
            <Row>
              <Col xs={6}>
                <CardBlock style={{ border: 0 }}>
                  <Form formValue={form} onChange={(val) => setForm(val)} ref={formRef} model={AttributeModel}>
                    <KMInput name="key" label="Tên thuộc tính" className="w-100" helpText={'Thuộc tính là bắt buộc'} />
                    <Form.Group>
                      <Form.ControlLabel> </Form.ControlLabel>
                      <Button onClick={onCreateAttributes} appearance="primary">
                        Tạo thuộc tính
                      </Button>
                    </Form.Group>
                  </Form>
                </CardBlock>
              </Col>
              <Col xs={18}>
                <CardBlock style={{ border: 0 }}>
                  <Table
                    height={420}
                    data={attribute}
                    bordered
                    cellBordered
                    // onSortColumn={(sortColumn, sortType) => {
                    //   console.log(sortColumn, sortType)
                    // }}
                    rowHeight={60}
                    onRowClick={handleOpenAttributesTerm}
                  >
                    <Column flexGrow={2}>
                      <HeaderCell>Tên thuộc tính</HeaderCell>
                      <Cell dataKey="key" />
                    </Column>
                    <Column width={80} align="center" verticalAlign="middle">
                      <HeaderCell>...</HeaderCell>
                      <Cell>
                        {(rowData) => (
                          <span>
                            <Whisper
                              placement="left"
                              trigger="click"
                              speaker={
                                <Popover
                                  arrow={false}
                                  className="d-flex "
                                  style={{ width: '200px' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>
                                    Sau khi xóa thuộc tính này, các sản phẩm có biến thể này vẫn sẽ tồn tại. Các sản
                                    phẩm được tạo mới sau này sẽ không còn thuộc tính này nữa.
                                  </span>
                                  <br />
                                  <Button
                                    size="sm"
                                    appearance="primary"
                                    color="red"
                                    onClick={(e) => {
                                      handleDelete(rowData)
                                      whisperRef.current.close()
                                    }}
                                    style={{ background: 'var(--rs-red-800)' }}
                                  >
                                    Xác nhận
                                  </Button>
                                </Popover>
                              }
                              ref={whisperRef}
                            >
                              <IconButton icon={<TrashIcon />} onClick={(e) => e.stopPropagation()} />
                            </Whisper>
                          </span>
                        )}
                      </Cell>
                    </Column>
                  </Table>
                </CardBlock>
              </Col>
            </Row>
          </Grid>
        </div>
      </Content>

      <Modal size={'md'} open={modal.open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.component}</Modal.Body>
      </Modal>
    </>
  )
}
ProductVariable.Admin = AdminLayout

export default ProductVariable
