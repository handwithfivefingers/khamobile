import VariableModal from 'component/Modal/Variable/create';
import AdminLayout from 'component/UI/AdminLayout';
import CardBlock from 'component/UI/Content/CardBlock';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Avatar, Content, Table, Button, Message, useToaster, Modal, Panel, List, Stack, ButtonGroup } from 'rsuite';
import ProductService from 'service/admin/Product.service';
import TEXT from 'src/constant/text.constant';
import { useCommonStore } from 'src/store/commonStore';
import styles from './styles.module.scss';
const { Column, HeaderCell, Cell } = Table;

const CustomRenderCell = ({ rowData, dataKey, ...props }) => {
	return (
		<Cell {...props} style={{ padding: 0 }}>
			<div
				style={{
					borderRadius: 6,
					marginTop: 2,
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Avatar src={`/public/${rowData[dataKey]}`} />
			</div>
		</Cell>
	);
};

const ProductVariable = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);

	const [variable, setVariable] = useState([]);

	const [loading, setLoading] = useState(false);

	const [modal, setModal] = useState({
		open: false,
		component: null,
	});

	const router = useRouter();

	const toaster = useToaster();
	useEffect(() => {
		changeTitle('Page Danh mục');
		getVariables();
	}, []);

	const getVariables = async () => {
		try {
			setLoading(true);
			let _variables = await ProductService.getVariables();

			setVariable(_variables.data.data);

			toaster.push(<Message>{_variables.data.message}</Message>);
		} catch (error) {
			console.log('getVariables error', error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => setModal({ ...modal, open: false, component: null });

	const handleSubmit = async (formValue) => {
		const listPromise = formValue.groupVariable?.map((item) => {
			createVariable(item);
		});

		await Promise.all(listPromise);

		toaster.push(<Message>{'Created Bulk successfully '}</Message>);
	};

	const createVariable = async (item) => {
		try {
			const resp = await ProductService.createVariable(item);
			return resp;
		} catch (error) {
			toaster.push(<Message>{error?.response?.data.message || error?.message || 'something was wrong'}</Message>);
		}
	};

	console.log(variable);

	return (
		<>
			<Content>
				<div className='row gy-4'>
					{variable?.map(({ key, value, _id }) => {
						return (
							<div className='col-12' key={[key, _id]}>
								<CardBlock>
									<Panel
										bordered
										header={
											<Stack justifyContent='space-between'>
												<span>{TEXT[key]}</span>
												<ButtonGroup>
													<Button
														appearance='primary'
														onClick={() => setModal({ open: true, component: <VariableModal onSubmit={(value) => handleSubmit(value)} variableKey={key} /> })}
													>
														Add
													</Button>
												</ButtonGroup>
											</Stack>
										}
									>
										<List size='md'>
											{value.map((item, index) => (
												<List.Item key={[_id, key, index]} index={index}>
													{item}
												</List.Item>
											))}
										</List>
									</Panel>
								</CardBlock>
							</div>
						);
					})}
				</div>
			</Content>

			{modal.open && (
				<Modal size={'md'} open={modal.open} onClose={handleClose}>
					<Modal.Header>
						<Modal.Title>Create</Modal.Title>
					</Modal.Header>
					<Modal.Body>{modal.component}</Modal.Body>
				</Modal>
			)}
		</>
	);
};
ProductVariable.Admin = AdminLayout;

export default ProductVariable;
