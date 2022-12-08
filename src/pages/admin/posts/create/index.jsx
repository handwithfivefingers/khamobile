import AdminLayout from 'component/UI/AdminLayout';
import Select from 'component/UI/Content/MutiSelect';
import CustomUpload from 'component/UI/Upload/CustomUpload';
import Textarea from 'component/UI/Editor';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Content, Form, Loader, Message, Uploader, useToaster } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import { useCommonStore } from 'src/store/commonStore';
import { useLoaderStore } from 'src/store/loaderStore';

const PostCreate = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const router = useRouter();
	const { loading, setLoading } = useLoaderStore((state) => state);

	const [form, setForm] = useState({
		title: '',
		slug: '',
		description: '',
		postImg: [],
		category: '',
	});

	const [data, setData] = useState();

	useEffect(() => {
		changeTitle('Create Post');
		getCateData();
	}, []);

	const getCateData = async () => {
		try {
			setLoading(true);
			const res = await CategoryService.getCate({ type: 'post' });
			let { data } = res.data;
			setData(data);
		} catch (error) {
			console.log('error', error, error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async () => {
		try {
			setLoading(true);
			const formdata = new FormData();
			for (let key in form) {
				if (key === 'postImg') {
					formdata.append(key, form[key]?.[0]?.blobFile || null);
				} else formdata.append(key, form?.[key]);
			}

			await PostService.createPost(formdata);
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
			</Content>
		</>
	);
};
PostCreate.Admin = AdminLayout;

export default PostCreate;
