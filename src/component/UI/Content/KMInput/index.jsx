const { forwardRef } = require('react');
const { Form, Input } = require('rsuite');

const CustomInput = forwardRef((props, ref) => {
	// console.log('custom input', props);
	return <Input style={props?.style} onChange={props?.onChange} ref={ref} {...props} />;
});

const KMInput = ({ name, label, ...props }) => {
	console.log('custom input', props);
	return (
		<Form.Group controlId={name}>
			<Form.ControlLabel>{label}</Form.ControlLabel>
			<Form.Control name={name} accepter={CustomInput} {...props} />
		</Form.Group>
	);
};

export { KMInput };
