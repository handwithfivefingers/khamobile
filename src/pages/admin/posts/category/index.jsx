import AdminLayout from 'component/UI/AdminLayout';
import CustomUpload from 'component/UI/CustomUpload';
import Textarea from 'component/UI/Editor';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import { Avatar, Button, Content, Table, Modal, Placeholder, MultiCascader, Form, ButtonToolbar } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import TOAST_STATUS from 'src/constant/message.constant';
import { useCommonStore } from 'src/store/commonStore';
import { useMessageStore } from 'src/store/messageStore';

const { Column, HeaderCell, Cell } = Table;

const CustomRenderCell = ({ rowData, dataKey, ...props }) => {
	console.log(rowData[dataKey]);
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

const Select = forwardRef((props, ref) => {
	const { data } = props;

	if (!data) return null;

	return <MultiCascader ref={ref} data={data} menuWidth={180} cascade={false} style={{ width: '100%' }} {...props} />;
});

const PostCategory = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const pushMessage = useMessageStore((state) => state.pushMessage);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [treeData, setTreeData] = useState([]);

	const [form, setForm] = useState({
		name: '',
		description: '',
		slug: '',
		categoryImg: [],
		parentCategory: '',
		type: 'post',
	});

	useEffect(() => {
		getCateData();
		changeTitle('Danh mục bài viết');
	}, []);

	const getCateData = async () => {
		try {
			setLoading(true);
			const res = await CategoryService.getCate({ type: 'post' });
			let { data } = res.data;
			console.log('data', data);
			let tree = data?.map((item) => ({ value: item._id, label: item.name }));

			setData(data);
			setTreeData(tree);
			pushMessage({ message: res.data.message, type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error?.response?.data?.message);
			pushMessage({ message: error?.response?.data?.message || error?.message || 'Something was wrong', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};
	const handleSubmit = async () => {
		try {
			setLoading(true);
			const type = 'post';
			const formData = new FormData();
			// Object.keys(form).forEach(key => {})
			for (let key in form) {
				if (key === 'categoryImg') {
					formData.append(key, form[key]?.[0]?.blobFile || null);
				} else formData.append(key, form?.[key]);
			}
			formData.append('type', type);

			await CategoryService.createCate(formData);

			pushMessage({ message: 'Fetch user success', type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error);
			pushMessage({ message: 'Fetch user error', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button onClick={handleOpen}>Add</Button>
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
						<CustomRenderCell dataKey='categoryImg' />
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

			<Modal open={open} onClose={handleClose} size={'lg'} overflow={false} backdrop={'static'}>
				<Modal.Header>
					<Modal.Title>Thêm mới danh mục</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form formData={form} onChange={(formData) => setForm(formData)} className={'row'} fluid>
						<div className='col-10'>
							<Form.Group controlId='name'>
								<Form.ControlLabel>Title</Form.ControlLabel>
								<Form.Control name='name' />
							</Form.Group>

							<Form.Group controlId='slug'>
								<Form.ControlLabel>Đường dẫn</Form.ControlLabel>
								<Form.Control name='slug' />
							</Form.Group>

							<Form.Group controlId='parentCategory'>
								<Form.ControlLabel>Danh mục cha</Form.ControlLabel>
								<Form.Control name='parentCategory' accepter={Select} data={treeData} />
							</Form.Group>

							<Form.Group controlId='description'>
								<Form.ControlLabel>Nội dung</Form.ControlLabel>
								<Form.Control rows={5} name='description' accepter={Textarea} />
							</Form.Group>
						</div>
						<div className='col-2'>
							<Form.Group controlId='categoryImg'>
								<Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
								<Form.Control rows={5} name='categoryImg' accepter={CustomUpload} action='#' file={form['categoryImg']?.slice(-1)} />
							</Form.Group>
						</div>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={handleSubmit} appearance='primary'>
						Ok
					</Button>
					<Button onClick={handleClose} appearance='subtle'>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
PostCategory.Admin = AdminLayout;

export default PostCategory;
