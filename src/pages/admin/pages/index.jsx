import AdminLayout from 'component/UI/AdminLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Content, Table } from 'rsuite';
import { useCommonStore } from 'src/store/commonStore';

const { Column, HeaderCell, Cell } = Table;

const Pages = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const router = useRouter();
	useEffect(() => {
		changeTitle('Page Pages');
	}, []);

	const tableData = [
		{
			id: 1,
			name: 'Homepage',
			slug: 'home',
		},
		{
			id: 2,
			name: 'Danh mục',
			slug: 'category',
		},
		{
			id: 3,
			name: 'Sản phẩm',
			slug: 'san-pham',
		},
	];

	return (
		<>
			<Content className={'bg-w'}>
				<Table
					height={400}
					data={tableData}
					onRowClick={(rowData) => {
						router.push(`./pages/${rowData.slug}`);
					}}
				>
					<Column width={60} align='center' fixed>
						<HeaderCell>Id</HeaderCell>
						<Cell dataKey='id' />
					</Column>

					<Column width={150}>
						<HeaderCell>Trang</HeaderCell>
						<Cell dataKey='name' />
					</Column>

					<Column width={100}>
						<HeaderCell>Đường dẫn</HeaderCell>
						<Cell dataKey='slug' />
					</Column>

					<Column width={80} fixed='right'>
						<HeaderCell>...</HeaderCell>

						<Cell>
							{(rowData) => (
								<span>
									<a onClick={() => router.push(`./pages/${rowData.slug}`)}> Edit </a>
								</span>
							)}
						</Cell>
					</Column>
				</Table>
			</Content>
		</>
	);
};
Pages.Admin = AdminLayout;

export default Pages;
