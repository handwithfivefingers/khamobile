import clsx from 'clsx';
import AdminLayout from 'component/UI/AdminLayout';
import Heading from 'component/UI/Content/Heading';
import CustomUpload from 'component/UI/CustomUpload';
import Textarea from 'component/UI/Editor';
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { Avatar, Button, Content, Table, Modal, Placeholder, MultiCascader, Form, ButtonToolbar, Tree, Panel, Header } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import TOAST_STATUS from 'src/constant/message.constant';
import { useCommonStore } from 'src/store/commonStore';
import { useLoaderStore } from 'src/store/loaderStore';
import { useMessageStore } from 'src/store/messageStore';
import styles from './styles.module.scss';
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

	const { loading, setLoading } = useLoaderStore((state) => state);

	const [data, setData] = useState();

	const [treeData, setTreeData] = useState([]);

	const treeRef = useRef();

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

			setData(data);

			pushMessage({ message: res.data.message, type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error?.response?.data?.message);
			pushMessage({ message: error?.response?.data?.message || error?.message || 'Something was wrong', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};

	const getCateById = async (id) => {
		try {
			setLoading(true);

			const res = await CategoryService.getCateById(id);

			let { data } = res.data;

			setForm({ ...data, parentCategory: [data.parentCategory] });

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
			const formData = new FormData();
			for (let key in form) {
				if (key === 'categoryImg') {
					formData.append(key, form[key]?.[0]?.blobFile || null);
				} else formData.append(key, form?.[key]);
			}

			await CategoryService.createCate(formData);

			pushMessage({ message: 'Create Success', type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error);
			pushMessage({
				message: error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || error?.message,
				type: 'error',
				status: TOAST_STATUS.PUSHED,
			});
		} finally {
			setLoading(false);
		}
	};

	const onHandleEdit = async (v) => {
		return getCateById(v);
	};

	console.log(form);

	return (
		<>
			<Content className={clsx('bg-w')}>
				<div className={styles.content}>
					{!loading ? (
						<Form
							formValue={form}
							onCheck={(error) => console.log('checked')}
							onChange={(formData) => {
								console.log('changeing');
								setForm(formData);
							}}
							className={'row'}
							fluid
						>
							<div className='col-12'>
								<Panel>
									<Form.Group controlId='name'>
										<Form.ControlLabel>Title</Form.ControlLabel>
										<Form.Control name='name' />
									</Form.Group>
									<Form.Group controlId='slug'>
										<Form.ControlLabel>Đường dẫn</Form.ControlLabel>
										<Form.Control name='slug' />
									</Form.Group>
									<Form.Group controlId='categoryImg'>
										<Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
										<Form.Control rows={5} name='categoryImg' accepter={CustomUpload} action='#' file={form['categoryImg']?.slice(-1)} />
									</Form.Group>
									<Form.Group controlId='parentCategory'>
										<Form.ControlLabel>Danh mục cha</Form.ControlLabel>
										<Form.Control name='parentCategory' accepter={Select} data={data || []} labelKey={'name'} valueKey={'_id'} />
									</Form.Group>
									<Form.Group controlId='description'>
										<Form.ControlLabel>Nội dung</Form.ControlLabel>
										<Form.Control rows={5} name='description' accepter={Textarea} />
									</Form.Group>
								</Panel>
							</div>
						</Form>
					) : (
						<Placeholder.Graph active className={styles.loader} />
					)}
					<Panel>
						<Header>
							<h2>Danh mục</h2>
						</Header>
						<Tree data={data} ref={treeRef} defaultExpandAll virtualized showIndentLine labelKey='name' valueKey='_id' onChange={(v) => onHandleEdit(v)} />
					</Panel>
				</div>
				<Panel className={styles.btnAction}>
					{form._id ? (
						<Button onClick={handleSubmit} appearance='primary'>
							Edit
						</Button>
					) : (
						<Button onClick={handleSubmit} appearance='primary'>
							Create
						</Button>
					)}
				</Panel>
			</Content>
		</>
	);
};
PostCategory.Admin = AdminLayout;

export default PostCategory;
