import Textarea from 'component/UI/Editor'
import { Form, Input, SelectPicker, InputGroup } from 'rsuite'
import { forwardRef, useState } from 'react'
import EyeIcon from '@rsuite/icons/legacy/Eye'
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash'

const CustomInput = forwardRef((props, ref) => {
  return <Input style={props?.style} onChange={props?.onChange} ref={ref} {...props} />
})

const CustomSelect = forwardRef(({ value, placeholder, data, name, ...props }, ref) => {
  return (
    <SelectPicker
      value={value}
      placeholder={placeholder}
      data={data}
      onChange={(value) => handleChange(value, name)}
      style={{ width: '100%' }}
      {...props}
    />
  )
})

const InputPassword = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const handleChange = () => {
    setVisible(!visible)
  }
  return (
    <>
      <InputGroup inside >
        <Input type={visible ? 'text' : 'password'} ref={ref} {...props}/>
        <InputGroup.Button onClick={handleChange}>{visible ? <EyeIcon /> : <EyeSlashIcon />}</InputGroup.Button>
      </InputGroup>
    </>
  )
})
const KMInputPassword = ({ name, label, ...props }) => {
  return (
    <Form.Group controlId={name}>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      <Form.Control name={name} accepter={InputPassword} {...props} />
    </Form.Group>
  )
}
const KMInput = ({ name, label, ...props }) => {
  return (
    <Form.Group controlId={name}>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      <Form.Control name={name} accepter={CustomInput} {...props} />
    </Form.Group>
  )
}

const KMSelect = ({ name, label, ...props }) => {
  return (
    <Form.Group controlId={name}>
      {label && <Form.ControlLabel>{label}</Form.ControlLabel>}
      <Form.Control name={name} accepter={SelectPicker} {...props} />
    </Form.Group>
  )
}

const KMEditor = ({ name, label, ...props }) => {
  return (
    <Form.Group controlId={name}>
      {label && <Form.ControlLabel>{label}</Form.ControlLabel>}
      <Form.Control name={name} accepter={Textarea} {...props} />
    </Form.Group>
  )
}

export { KMInput, KMSelect, KMEditor, KMInputPassword }
