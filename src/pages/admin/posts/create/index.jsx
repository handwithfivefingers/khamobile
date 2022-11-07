import AdminLayout from 'component/UI/AdminLayout';
import CustomUpload from 'component/UI/CustomUpload';
import Textarea from 'component/UI/Editor';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Content, Form, Loader, Message, Uploader, useToaster } from 'rsuite';
import { useCommonStore } from 'src/store/commonStore';

const PostCreate = () => {
	const changeTitle = useCommonStore((state) => state.changeTitle);
	const router = useRouter();
	const [form, setForm] = useState({
		title: '',
		slug: '',
		description: '',
		post_image: [],
	});
	useEffect(() => {
		changeTitle('Create Post');
	}, []);

	return (
		<>
			<Button onClick={() => router.back()}>Back</Button>
			<Content className={'bg-w p-4'}>
				<Form formData={form} onChange={(formData) => setForm(formData)} className={'row'} fluid>
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
							<Form.ControlLabel>Nội dung</Form.ControlLabel>
							<Form.Control rows={5} name='description' accepter={Textarea} />
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button appearance='primary' onClick={() => console.log(form)}>
									Submit
								</Button>
								<Button appearance='default'>Cancel</Button>
							</ButtonToolbar>
						</Form.Group>
					</div>
					<div className='col-2'>
						<Form.Group controlId='post_image'>
							<Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
							<Form.Control rows={5} name='post_image' accepter={CustomUpload} action='#' file={form['post_image']?.slice(-1)} />
						</Form.Group>
					</div>
				</Form>
			</Content>
		</>
	);
};
PostCreate.Admin = AdminLayout;

export default PostCreate;
