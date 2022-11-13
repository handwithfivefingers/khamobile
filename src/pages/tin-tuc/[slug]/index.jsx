import React from 'react';
import axios from 'configs/axiosInstance';
import PostHelmet from 'component/PostHelmet';
import Heading from 'component/UI/Content/Heading';
import styles from './styles.module.scss';
import clsx from 'clsx';
import parse from 'html-react-parser';
import CardBlock from 'component/UI/Content/CardBlock';
export default function PostDetail(props) {
	const { seo, data } = props;

	return (
		<>
			<PostHelmet seo={seo} />

			<div className='container-fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className={styles.heading} style={{ backgroundImage: `url(${data?.postImg?.[0]?.filename})` }}>
							<Heading type='h3' left divideClass={styles.divideLeft}>
								{data?.title}
							</Heading>
						</div>
					</div>

					<div className='col-12'>
						<div className='container'>
							<div className='row'>
								<div className={clsx([styles.vr, 'col-lg-8 col-md-12'])}>
									<CardBlock>{parse(data?.content)}</CardBlock>
								</div>

								<div className={clsx([styles.vr, 'col-lg-4 col-md-12'])}>
									<CardBlock>....</CardBlock>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps = async (ctx) => {
	const { slug } = ctx.query;
	const response = await axios.get(`/admin/post/${slug}`);
	return {
		props: {
			data: response.data.data,
			seo: response.data.seo,
		},
	};
};
