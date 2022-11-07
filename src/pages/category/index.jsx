import clsx from 'clsx';
import Card from 'component/UI/Content/Card';
import CardBlock from 'component/UI/Content/CardBlock';
import Divider from 'component/UI/Content/Divider';
import Heading from 'component/UI/Content/Heading';
import SideFilter from 'component/UI/Content/SideFilter';
import CommonLayout from 'component/UI/Layout';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dropdown, Pagination, SelectPicker } from 'rsuite';
import CategoryService from 'service/admin/Category.service';
import TOAST_STATUS from 'src/constant/message.constant';
import { useMessageStore } from 'src/store/messageStore';
import styles from './styles.module.scss';

export default function Category(props) {
	const [data, setData] = useState([]);

	const [loading, setLoading] = useState(false);

	const pushMessage = useMessageStore((state) => state.pushMessage);

	useEffect(() => {
		getCateData();
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
		<div className='container'>
			<div className='row'>
				<div className='col-12'>
					<Heading type='h3' left divideClass={styles.divideLeft}>
						Danh mục
					</Heading>
				</div>

				<div className={styles.categories}>
					<div className={styles.listCate}>
						{data?.map((item, index) => {
							return (
								<div
									className={clsx(styles.cateItem)}
									style={{
										backgroundImage: `url(https://cdn2.cellphones.com.vn/180x/https://cdn2.cellphones.com.vn/x/media/catalog/product/a/p/apple_care_1.png)`,
									}}
								>
									{item.name}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

Category.Layout = CommonLayout;
