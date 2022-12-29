import { Form, Input, SelectPicker, InputGroup, MaskedInput } from 'rsuite'
import { forwardRef, useEffect, useRef, useState } from 'react'
import EyeIcon from '@rsuite/icons/legacy/Eye'
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash'

import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { NumericFormat } from 'react-number-format'

const Textarea = dynamic(() => import('component/UI/Editor'))

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
      <InputGroup inside>
        <Input type={visible ? 'text' : 'password'} ref={ref} {...props} />
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

const KMInput = ({ name, label, onChange, helpText, ...props }) => {
  const handleOnChange = (v) => {
    if (onChange) {
      onChange(v)
    }
  }
  if (props?.mask?.length) {
    return (
      <Form.Group controlId={name}>
        <Form.ControlLabel>{label}</Form.ControlLabel>
        <Form.Control name={name} accepter={MaskInput} {...props} onChange={handleOnChange} />
        {helpText && <Form.HelpText>{helpText}</Form.HelpText>}
      </Form.Group>
    )
  }
  return (
    <Form.Group controlId={name}>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      <Form.Control name={name} accepter={CustomInput} {...props} onChange={handleOnChange} />
      {helpText && <Form.HelpText>{helpText}</Form.HelpText>}
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
      <Form.Control name={name} accepter={Textarea} {...props} onChange={(v) => props?.onChange(v)} />
    </Form.Group>
  )
}

const KMPrice = ({ name, label, onChange, ...props }) => {
  const handleOnChange = (v) => {
    if (onChange) {
      onChange(v)
    }
  }
  return (
    <Form.Group controlId={name}>
      {label && <Form.ControlLabel>{label}</Form.ControlLabel>}
      <Form.Control name={name} accepter={Pricing} {...props} onChange={handleOnChange} />
    </Form.Group>
  )
}

const Pricing = forwardRef(({ value, onChange, ...props }, ref) => {
  console.log(value)
  const handleChange = ({ formattedValue, value, floatValue }) => {
    if (onChange) {
      return onChange(value)
    }
  }
  return (
    <NumericFormat
      {...props}
      defaultValue={value}
      allowLeadingZeros
      thousandSeparator=","
      onValueChange={handleChange}
      customInput={InputProxy}
      suffix=" đ"
      ref={ref}
    />
  )
})

const InputProxy = forwardRef((props, ref) => {
  return <input class="rs-input" type="text" {...props} ref={ref} />
})

const MaskInput = forwardRef((props, ref) => {
  return <MaskedInput {...props} ref={ref} />
})

export { KMInput, KMSelect, KMEditor, KMInputPassword, KMPrice, Pricing }
