import clsx from 'clsx';
import AdminLayout from 'component/UI/AdminLayout';
import { useEffect, useState } from 'react';
import { Content, FlexboxGrid, Form, ButtonGroup, IconButton, Input, InputNumber } from 'rsuite';
import MinusIcon from '@rsuite/icons/Minus';
import PlusIcon from '@rsuite/icons/Plus';

import styles from './styles.module.scss';
import JsonViewer from 'component/UI/JsonViewer';
import CardBlock from 'component/UI/Content/CardBlock';

const Cell = ({ children, style, ...rest }) => (
	<td style={{ padding: '2px 4px 2px 0', verticalAlign: 'top', ...style }} {...rest}>
		{children}
	</td>
);

const VariableItem = ({ rowValue = {}, onChange, rowIndex }) => {
	const handleChange = (value, name) => onChange(rowIndex, { ...rowValue, [name]: value });

	return (
		<FlexboxGrid.Item>
			<Cell>
				<Input value={rowValue.color} onChange={(value) => handleChange(value, 'color')} />
			</Cell>
		</FlexboxGrid.Item>
	);
};

const OptionsControlInput = ({ value, onChange, ...props }) => {
	const [products, setProducts] = useState(value);

	const handleChangeProducts = (nextProducts) => {
		setProducts(nextProducts);
		onChange(nextProducts);
	};
	const handleInputChange = (rowIndex, value) => {
		const nextProducts = [...products];
		nextProducts[rowIndex] = value;
		handleChangeProducts(nextProducts);
	};

	const handleMinus = () => {
		handleChangeProducts(products.slice(0, -1));
	};

	const handleAdd = () => {
		handleChangeProducts(products.concat([{ color: '' }]));
	};

	return (
		<>
			<FlexboxGrid>
				<FlexboxGrid.Item>
					<Cell>{props.label}</Cell>
				</FlexboxGrid.Item>
			</FlexboxGrid>
			<FlexboxGrid>
				{products?.map((rowValue, index) => {
					return <VariableItem key={index} rowIndex={index} rowValue={rowValue} onChange={handleInputChange} />;
				})}
			</FlexboxGrid>
			<Cell colSpan={2} style={{ paddingTop: 10 }}>
				<ButtonGroup size='xs'>
					<IconButton onClick={handleAdd} icon={<PlusIcon />} />
					<IconButton onClick={handleMinus} icon={<MinusIcon />} />
				</ButtonGroup>
			</Cell>
		</>
	);
};

const CustomVariableInput = ({ value, onChange, ...props }) => {
	// const [products, setProducts] = useState(value);

	// const handleMinus = () => {
	// 	handleChangeProducts(products.slice(0, -1));
	// };

	// const handleAdd = () => {
	// 	handleChangeProducts(products.concat([{ color: '' }]));
	// };

	const [fieldValue, setFieldValue] = useState(value);

	const handleInputChange = (rowIndex, value) => {
		const nextFields = [...fieldValue];
		nextFields[rowIndex] = value;
		handleChangeFields(nextFields);
	};

	const handleChangeFields = (nextValue) => {
		setFieldValue(nextValue);
		onChange(nextValue);
	};
	const handleMinus = () => {
		handleChangeFields(fieldValue.slice(0, -1));
	};

	const handleAdd = () => {
		handleChangeFields(fieldValue.concat([{}]));
	};
	return (
		<>
			<FlexboxGrid>
				<FlexboxGrid.Item>
					<Cell>{props.label}</Cell>
				</FlexboxGrid.Item>
			</FlexboxGrid>
			<FlexboxGrid>
			
				{fieldValue.map((rowValue, index) => {
					return (
						<FlexboxGrid>
							<FlexboxGrid.Item>
								<Cell>{props.label}</Cell>
								<Input onChange={(value, name) => handleInputChange(index, { ...rowValue, [name]: value })} />
							</FlexboxGrid.Item>
						</FlexboxGrid>
					);
				})}
			</FlexboxGrid>
			<Cell colSpan={2} style={{ paddingTop: 10 }}>
				<ButtonGroup size='xs'>
					<IconButton onClick={handleAdd} icon={<PlusIcon />} />
					<IconButton onClick={handleMinus} icon={<MinusIcon />} />
				</ButtonGroup>
			</Cell>
		</>
	);
};

export default function Category(props) {
	const [form, setForm] = useState({
		carousel: [],
		groupVariable: [{}],
	});
	return (
		<Content className='rounded'>
			<JsonViewer data={form} className={'my-2'} />

			<CardBlock className={'my-2'}>
				<Form formValue={form}>
					<Form.Group controlId='carousel'>
						<Form.ControlLabel> Slider</Form.ControlLabel>
						<Form.Control name={'carousel'} accepter={CustomVariableInput} />
					</Form.Group>

					<Form.Group controlId='groupVariable'>
						<Form.ControlLabel>Biến thể</Form.ControlLabel>
						<Form.Control name={'groupVariable'} accepter={OptionsControlInput} />
					</Form.Group>
				</Form>
			</CardBlock>
		</Content>
	);
}

Category.Admin = AdminLayout;
