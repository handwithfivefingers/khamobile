import React, { useEffect, useState } from 'react'

import MinusIcon from '@rsuite/icons/Minus'
import PlusIcon from '@rsuite/icons/Plus'
import CardBlock from 'component/UI/Content/CardBlock'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import Textarea from 'component/UI/Editor'
import JsonViewer from 'component/UI/JsonViewer'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  IconButton,
  Input,
  InputNumber,
  InputPicker,
} from 'rsuite'
import ProductService from 'service/admin/Product.service'

const Cell = ({ children, style, ...rest }) => (
  <td style={{ padding: '2px 4px 2px 0', verticalAlign: 'top', ...style }} {...rest}>
    {children}
  </td>
)

const VariableItem = ({ rowValue = '', onChange, rowIndex }) => {
  const handleChange = (value) => onChange(rowIndex, value)

  return (
    <FlexboxGrid.Item>
      <Cell>
        <Input value={rowValue} onChange={(value) => handleChange(value)} />
      </Cell>
    </FlexboxGrid.Item>
  )
}

const OptionsControlInput = ({ value, onChange, ...props }) => {
  const [products, setProducts] = React.useState(value)

  const handleChangeProducts = (nextProducts) => {
    setProducts(nextProducts)
    onChange(nextProducts)
  }

  const handleMinus = () => {
    handleChangeProducts(products.slice(0, -1))
  }

  const handleAdd = () => {
    handleChangeProducts([...products, ''])
  }

  const handleInputChange = (rowIndex, value) => {
    const nextProducts = [...products]
    nextProducts[rowIndex] = value
    handleChangeProducts(nextProducts)
  }

  return (
    <>
      <FlexboxGrid>
        <FlexboxGrid.Item>
          <Cell>{props.label}</Cell>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <FlexboxGrid>
        {products?.map((rowValue, index) => {
          return <VariableItem key={index} rowIndex={index} rowValue={rowValue} onChange={handleInputChange} />
        })}
      </FlexboxGrid>

      <Cell colSpan={2} style={{ paddingTop: 10 }}>
        <ButtonGroup size="xs">
          <IconButton onClick={handleMinus} icon={<MinusIcon />} />

          <IconButton onClick={handleAdd} icon={<PlusIcon />} />
        </ButtonGroup>
      </Cell>
    </>
  )
}

const VariableModal = (props) => {
  const [form, setForm] = useState({
    value: [],
    key: props.variableKey,
  })
  const [variant, setVariant] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getVariables()
  }, [])

  const getVariables = async () => {
    try {
      setLoading(true)
      let _variables = await ProductService.getVariables()

      let option = Object.keys(_variables.data?.data).map((key) => ({
        label: key,
        value: key,
      }))
      setVariant(option)
    } catch (error) {
      console.log('getVariables error', error)
    } finally {
      setLoading(false)
    }
  }

  console.log(variant)
  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>

      <JsonViewer data={form} />

      <Content className={' p-4'}>
        <Form formValue={form} onChange={(formVal) => setForm(formVal)} className={'row '} fluid>
          <div className="col-12 bg-w rounded">
            <CardBlock>
              <Form.Group controlId="variable">
                <Form.ControlLabel> Biến thể</Form.ControlLabel>

                <InputPicker
                  value={form.key}
                  data={variant}
                  onChange={(value) => setForm({ ...form, key: value })}
                  creatable
                  placeholder="Biến thể"
                />
              </Form.Group>

              <Form.Group controlId="">
                <Form.ControlLabel>Giá trị</Form.ControlLabel>
                <Form.Control name={'value'} accepter={OptionsControlInput} label={props.variableKey} />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" onClick={() => props?.onSubmit(form)}>
                    Tạo
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </CardBlock>
          </div>
        </Form>
      </Content>
    </>
  )
}

export default VariableModal
