import Head from 'next/head';
import CommonLayout from '../component/UI/Layout';

const Home = () => {
	return (
		<div className='container'>
			<Head>
				<title>Kha Mobile</title>
			</Head>
		</div>
	);
};

Home.Layout = CommonLayout;

export default Home;
