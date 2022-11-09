import AdminLayout from 'component/UI/AdminLayout';
import Select from 'component/UI/Content/MutiSelect';
import CustomUpload from 'component/UI/CustomUpload';
import Textarea from 'component/UI/Editor';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Content, Form, Loader, Message, Placeholder, Uploader, useToaster } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import PostService from 'service/global/post.service';
import { useCommonStore } from 'src/store/commonStore';
import { useLoaderStore } from 'src/store/loaderStore';
import axios from 'configs/axiosInstance';
import styles from './styles.module.scss';

const PostEdit = (props) => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const router = useRouter();
	const { loading, setLoading } = useLoaderStore((state) => state);
	const [_render, setRender] = useState(false);
	const [form, setForm] = useState({
		title: '',
		slug: '',
		description: '',
		postImg: [],
		category: '',
	});

	const [data, setData] = useState();

	useEffect(() => {
		changeTitle('Edit Post');
		getCateData();
		getPostData();
	}, []);

	useEffect(() => {
		setRender(!_render);
	}, [loading]);

	// useEffect(() => {
	// 	setForm((state) => ({ ...state, ...props.data }));
	// }, [props]);

	const getCateData = async () => {
		try {
			// setLoading(true);
			const res = await CategoryService.getCate({ type: 'post' });
			let { data } = res.data;
			setData(data);
		} catch (error) {
			console.log('error', error, error?.response?.data?.message);
		} finally {
			// setLoading(false);
		}
	};

	const getPostData = async () => {
		try {
			setLoading(true);
			const { slug } = router.query;
			const res = await PostService.getPostBySlug(slug);
			setForm((state) => ({ ...state, ...res.data.data }));
			console.log('data', res.data.data);
		} catch (error) {
			console.log('error', error, error?.response?.data?.message);
		} finally {
			await new Promise((resolve) => setTimeout(resolve, 500));
			setLoading(false);
		}
	};

	const onSubmit = async () => {
		try {
			setLoading(true);
			const formdata = new FormData();
			for (let key in form) {
				if (key === 'postImg') {
					if (form[key]?.[0]?.blobFile) {
						formdata.append(key, form[key]?.[0]?.blobFile);
					}
				} else formdata.append(key, form?.[key]);
			}

			console.log(form._id);

			const id = form._id;

			formdata.delete('_id');

			await PostService.updatePost(id, formdata);
			console.log('ready for ');
		} catch (error) {
			console.log('error', error, error?.response?.data?.message);
		} finally {
			await new Promise((resolve) => setTimeout(resolve, 500));
			setLoading(false);
		}
	};
	return (
		<>
			<Button onClick={() => router.back()}>Back</Button>
			<Content className={'bg-w p-4'}>
				{!loading ? (
					<Form formValue={form} onChange={(formVal) => setForm(formVal)} className={'row'} fluid>
						<div className='col-10'>
							<Form.Group controlId='title'>
								<Form.ControlLabel>Title</Form.ControlLabel>
								<Form.Control name='title' />
							</Form.Group>

							<Form.Group controlId='slug'>
								<Form.ControlLabel>Đường dẫn</Form.ControlLabel>
								<Form.Control name='slug' />
							</Form.Group>

							<Form.Group controlId='description'>
								<Form.ControlLabel>Mô tả</Form.ControlLabel>
								<Form.Control name='description' />
							</Form.Group>

							<Form.Group controlId='content'>
								<Form.ControlLabel>Nội dung</Form.ControlLabel>
								<Form.Control rows={5} name='content' accepter={Textarea} />
							</Form.Group>
						</div>
						<div className='col-2'>
							<Form.Group controlId='postImg'>
								<Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
								<Form.Control rows={5} name='postImg' accepter={CustomUpload} action='#' file={form['postImg']?.slice(-1)} />
							</Form.Group>

							<Form.Group controlId='category'>
								<Form.ControlLabel>Danh mục cha</Form.ControlLabel>
								<Form.Control name='category' accepter={Select} data={data || []} labelKey={'name'} valueKey={'_id'} preventOverflow cascade />
							</Form.Group>
						</div>
						<div className='col-12'>
							<Form.Group>
								<ButtonToolbar>
									<Button appearance='primary' onClick={() => onSubmit()}>
										Submit
									</Button>
									<Button appearance='default'>Cancel</Button>
								</ButtonToolbar>
							</Form.Group>
						</div>
					</Form>
				) : (
					<Placeholder.Graph active className={styles.loader} />
				)}
			</Content>
		</>
	);
};
PostEdit.Admin = AdminLayout;

// export const getServerSideProps = async (ctx) => {
// 	console.log(ctx.query);
// 	const { slug } = ctx.query;
// 	const response = await axios.get(`/admin/post/${slug}`);
// 	return {
// 		props: {
// 			data: response.data.data,
// 		},
// 	};
// };

export default PostEdit;
