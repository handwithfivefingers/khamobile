const { forwardRef } = require("react");
const { Form, Input, SelectPicker } = require("rsuite");

const CustomInput = forwardRef((props, ref) => {
  // console.log('custom input', props);
  return (
    <Input
      style={props?.style}
      onChange={props?.onChange}
      ref={ref}
      {...props}
    />
  );
});

const CustomSelect = forwardRef(
  ({ value, placeholder, data, name, ...props }, ref) => {
    return (
      <SelectPicker
        value={value}
        placeholder={placeholder}
        data={data}
        onChange={(value) => handleChange(value, name)}
        style={{ width: "100%" }}
        {...props}
      />
    );
  }
);

const KMInput = ({ name, label, ...props }) => {
  console.log("custom input", props);
  return (
    <Form.Group controlId={name}>
      <Form.ControlLabel>{label}</Form.ControlLabel>
      <Form.Control name={name} accepter={CustomInput} {...props} />
    </Form.Group>
  );
};

const KMSelect = ({ name, label, ...props }) => {
  return (
    <Form.Group controlId={name}>
      {label && <Form.ControlLabel>{label}</Form.ControlLabel>}
      <Form.Control name={name} accepter={SelectPicker} {...props} />
    </Form.Group>
  );
};

export { KMInput, KMSelect };
