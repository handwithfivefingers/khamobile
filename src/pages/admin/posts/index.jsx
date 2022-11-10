import AdminLayout from 'component/UI/AdminLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Content, Header, Table, Tree, Avatar } from 'rsuite';
import PostService from 'service/global/post.service';
import { useCommonStore } from 'src/store/commonStore';
import { useLoaderStore } from 'src/store/loaderStore';

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
				<Avatar src={`/public/${rowData[dataKey]?.[0]?.filename}`} />
			</div>
		</Cell>
	);
};

const Posts = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const { loading, setLoading } = useLoaderStore((state) => state);
	const router = useRouter();
	const [posts, setPosts] = useState();
	useEffect(() => {
		changeTitle('Page Posts');
		getPostData();
	}, []);

	const getPostData = async () => {
		try {
			setLoading(true);
			const res = await PostService.getPosts();
			setPosts(res.data.data);
			// pushMessage({ message: res.data.message, type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error, error?.response?.data?.message);
			// pushMessage({ message: error?.response?.data?.message || error?.message || 'Something was wrong', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<Button onClick={() => router.push('./posts/create')}>Add</Button>
			<Content className={'bg-w'}>
				<Table
					height={400}
					data={posts || []}
					onRowClick={(rowData) => {
						router.push({
							pathname: `./posts/${rowData.slug}`,
						});
					}}
				>
					<Column width={100}>
						<HeaderCell>Gender</HeaderCell>
						<CustomRenderCell dataKey='postImg' />
					</Column>

					<Column width={60} align='center'>
						<HeaderCell>Id</HeaderCell>
						<Cell dataKey='title' />
					</Column>

					<Column width={150}>
						<HeaderCell>First Name</HeaderCell>
						<Cell dataKey='description' />
					</Column>

					<Column width={150}>
						<HeaderCell>Last Name</HeaderCell>
						<Cell dataKey='content' />
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
Posts.Admin = AdminLayout;

export default Posts;
