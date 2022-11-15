import ProductCreateModal from 'component/Modal/Product/create';
import AdminLayout from 'component/UI/AdminLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Content, Table, Button, Modal } from 'rsuite';
import { useCommonStore } from 'src/store/commonStore';

const { Column, HeaderCell, Cell } = Table;

const Products = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);

	const [open, setOpen] = useState(false);
	const router = useRouter();
	useEffect(() => {
		changeTitle('Page Products');
	}, []);

	const handleClose = () => setOpen(false);

	return (
		<>
			<Content className={'bg-w'}>
				<Button onClick={() => setOpen(true)}>Add</Button>
				<Table
					height={400}
					data={[]}
					onRowClick={(rowData) => {
						console.log(rowData);
					}}
				>
					<Column width={60} align='center' fixed>
						<HeaderCell>Id</HeaderCell>
						<Cell dataKey='id' />
					</Column>

					<Column width={150}>
						<HeaderCell>First Name</HeaderCell>
						<Cell dataKey='firstName' />
					</Column>

					<Column width={150}>
						<HeaderCell>Last Name</HeaderCell>
						<Cell dataKey='lastName' />
					</Column>

					<Column width={100}>
						<HeaderCell>Gender</HeaderCell>
						<Cell dataKey='gender' />
					</Column>

					<Column width={100}>
						<HeaderCell>Age</HeaderCell>
						<Cell dataKey='age' />
					</Column>

					<Column width={150}>
						<HeaderCell>Postcode</HeaderCell>
						<Cell dataKey='postcode' />
					</Column>

					<Column width={300}>
						<HeaderCell>Email</HeaderCell>
						<Cell dataKey='email' />
					</Column>
					<Column width={80} fixed='right'>
						<HeaderCell>...</HeaderCell>

						<Cell>
							{(rowData) => (
								<span>
									<a onClick={() => alert(`id:${rowData.id}`)}> Edit </a>
								</span>
							)}
						</Cell>
					</Column>
				</Table>
			</Content>

			<Modal size={'full'} open={open} onClose={handleClose} keyboard={false}>
				<Modal.Header>
					<Modal.Title>Create</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ProductCreateModal />
				</Modal.Body>
			</Modal>
		</>
	);
};
Products.Admin = AdminLayout;

export default Products;
