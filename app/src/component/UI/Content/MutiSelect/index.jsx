import { forwardRef } from 'react';
import { MultiCascader } from 'rsuite';

const Select = forwardRef((props, ref) => {
	const { data } = props;
	if (!data) return null;
	return <MultiCascader ref={ref} data={data} menuWidth={180} style={{ width: '100%' }} {...props} />;
});

export default Select;
