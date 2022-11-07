import AdminLayout from 'component/UI/AdminLayout';
import { useEffect, useState } from 'react';
import { Avatar, Content, Table } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import TOAST_STATUS from 'src/constant/message.constant';
import { useCommonStore } from 'src/store/commonStore';
import { useMessageStore } from 'src/store/messageStore';

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
					<Column width={150}>
						<HeaderCell></HeaderCell>
						<CustomRenderCell dataKey='img' />
					</Column>

					<Column width={150} flexGrow={1}>
						<HeaderCell>Danh mục</HeaderCell>
						<Cell dataKey='name' />
					</Column>

					<Column width={150} flexGrow={1}>
						<HeaderCell>Mô tả</HeaderCell>
						<Cell dataKey='description' />
					</Column>
					<Column width={100} flexGrow={1}>
						<HeaderCell>Đường dẫn </HeaderCell>
						<Cell dataKey='slug' />
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
