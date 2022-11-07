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

	return (
		<>
			<Content className={'bg-w'}>
				<Table
					height={400}
					data={[{ id: 1, page: 'Danh mục', slug: 'category' }]}
					onRowClick={(rowData) => {
						router.push(`./pages/${rowData.slug}`);
					}}
				>
					<Column width={60} align='center' fixed>
						<HeaderCell>Id</HeaderCell>
						<Cell dataKey='id' />
					</Column>

					<Column width={150}>
						<HeaderCell>Page</HeaderCell>
						<Cell dataKey='page' />
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
									<a onClick={() => router.push(`./pages/${rowData.slug}`)} > Edit </a>
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
