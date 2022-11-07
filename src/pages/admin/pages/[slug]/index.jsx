import clsx from 'clsx';
import AdminLayout from 'component/UI/AdminLayout';
import { useEffect, useState } from 'react';
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
		<div className='bg-white' style={{ height: 'fit-content' }}>
			<div className={styles.categories}>
				<div className={styles.listCate}>
					{[...data, ...data, ...data]?.map((item, index) => (
						<CardCate item={item} key={[index]} />
					))}
				</div>
			</div>
		</div>
	);
}

Category.Admin = AdminLayout;

const CardCate = (rest) => {
	return (
		<div
			className={clsx(styles.cateItem)}
			style={{
				backgroundImage: `url(https://cdn2.cellphones.com.vn/180x/https://cdn2.cellphones.com.vn/x/media/catalog/product/a/p/apple_care_1.png)`,
			}}
		>
			{rest?.item?.name || ' hehe'}
		</div>
	);
};
