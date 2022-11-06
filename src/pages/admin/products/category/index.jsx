import AdminLayout from 'component/UI/AdminLayout';
import { useEffect, useState } from 'react';
import { Content, Table } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import TOAST_STATUS from 'src/constant/message.constant';
import { useCommonStore } from 'src/store/commonStore';
import { useMessageStore } from 'src/store/messageStore';

const { Column, HeaderCell, Cell } = Table;

const Products = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const pushMessage = useMessageStore((state) => state.pushMessage);
	const [data, setData] = useState();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getCateData();
		changeTitle('Page Danh mục');
	}, []);

	const getCateData = async () => {
		try {
			setLoading(true);
			const res = await CategoryService.getCate();
			setData(res.data.data);
			pushMessage({ message: res.data.message, type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error?.response?.data?.message);
			pushMessage({ message: error?.response?.data?.message || error?.message || 'Something was wrong', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Content className={'bg-w'}>
				<Table
					height={400}
					data={data}
					onRowClick={(rowData) => {
						console.log(rowData);
					}}
					loading={loading}
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
		</>
	);
};
Products.Admin = AdminLayout;

export default Products;
