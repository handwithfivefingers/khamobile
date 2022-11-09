import clsx from 'clsx';
import Card from 'component/UI/Content/Card';
import CardBlock from 'component/UI/Content/CardBlock';
import CardPost from 'component/UI/Content/CardPost';
import Divider from 'component/UI/Content/Divider';
import Heading from 'component/UI/Content/Heading';
import SidePost from 'component/UI/Content/SidePost';
import CommonLayout from 'component/UI/Layout';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dropdown, Pagination, SelectPicker } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import PostService from 'service/global/post.service';
import TOAST_STATUS from 'src/constant/message.constant';
import { useMessageStore } from 'src/store/messageStore';
import styles from './styles.module.scss';

export default function Category(props) {
	const [activePage, setActivePage] = useState(1);
	const [data, setData] = useState([]);
	const [posts, setPosts] = useState([]);

	const [loading, setLoading] = useState(false);

	const pushMessage = useMessageStore((state) => state.pushMessage);

	useEffect(() => {
		getCateData();
		getPostData();
	}, []);

	const getCateData = async () => {
		try {
			setLoading(true);
			const res = await CategoryService.getCate({ type: 'post' });
			setData(res.data.data);
			pushMessage({ message: res.data.message, type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error?.response?.data?.message);
			pushMessage({ message: error?.response?.data?.message || error?.message || 'Something was wrong', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};

	const getPostData = async () => {
		try {
			setLoading(true);
			const res = await PostService.getPosts();
			setPosts(res.data.data);
			pushMessage({ message: res.data.message, type: 'success', status: TOAST_STATUS.PUSHED });
		} catch (error) {
			console.log('error', error?.response?.data?.message);
			pushMessage({ message: error?.response?.data?.message || error?.message || 'Something was wrong', type: 'error', status: TOAST_STATUS.PUSHED });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container'>
			<div className='row'>
				<div className='col-12'>
					<Heading type='h3' left divideClass={styles.divideLeft}>
						Sản phẩm
					</Heading>
				</div>

				<div className={clsx([styles.vr, 'col-lg-10 col-md-12'])}>
					<div className='row gy-4'>
					
						{posts?.map((post) => {
							return (
								<Link href={`/tin-tuc/${post.slug}`} passHref>
									<div className='col-12'>
										<CardPost border hover shadow imgSrc={`/public/${post.postImg?.[0]?.filename}`} title={post?.title} description={post?.description} />
									</div>
								</Link>
							);
						})}
					</div>
					<div className={styles.pagi}>
						<Pagination prev last next first size='sm' total={100} limit={10} activePage={activePage} onChangePage={(page) => setActivePage(page)} />
					</div>
				</div>
				<div className='col-lg-2 col-md-12'>
					<SidePost />
				</div>
			</div>
		</div>
	);
}

Category.Layout = CommonLayout;
