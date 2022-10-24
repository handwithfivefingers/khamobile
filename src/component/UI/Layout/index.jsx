import Head from 'next/head';
import Footer from '../Footer';
import Header from '../Header';

const CommonLayout = ({ children }) => {
	return (
		<>
			<Head>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />
				<link rel='apple-touch-icon-precomposed' sizes='57x57' href='/theme/frontend/images/favicon/favicon-app-57.png' />
				<link rel='apple-touch-icon-precomposed' sizes='114x114' href='/theme/frontend/images/favicon/favicon-app-114.png' />
				<link rel='apple-touch-icon-precomposed' sizes='72x72' href='/theme/frontend/images/favicon/favicon-app-72.png' />
				<link rel='apple-touch-icon-precomposed' sizes='144x144' href='/theme/frontend/images/favicon/favicon-app-144.png' />
				<link rel='apple-touch-icon-precomposed' sizes='60x60' href='/theme/frontend/images/favicon/favicon-app-60.png' />
				<link rel='apple-touch-icon-precomposed' sizes='120x120' href='/theme/frontend/images/favicon/favicon-app-120.png' />
				<link rel='apple-touch-icon-precomposed' sizes='76x76' href='/theme/frontend/images/favicon/favicon-app-76.png' />
				<link rel='apple-touch-icon-precomposed' sizes='152x152' href='/theme/frontend/images/favicon/favicon-app-152.png' />
				<link rel='icon' type='image/png' href='/theme/frontend/images/favicon/favicon-196.png' sizes='196x196' />
				<link rel='icon' type='image/png' href='/theme/frontend/images/favicon/favicon-96.png' sizes='96x96' />
				<link rel='icon' type='image/png' href='/theme/frontend/images/favicon/favicon-32.png' sizes='32x32' />
				<link rel='icon' type='image/png' href='/theme/frontend/images/favicon/favicon-16.png' sizes='16x16' />
				<link rel='icon' type='image/png' href='/theme/frontend/images/favicon/favicon-128.png' sizes='128x128' />

				<meta name='msapplication-TileColor' content='#FFFFFF' />
				<meta name='msapplication-TileImage' content='/theme/frontend/images/favicon/mstile-144x144.png' />
				<meta name='msapplication-square70x70logo' content='/theme/frontend/images/favicon/mstile-70x70.png' />
				<meta name='msapplication-square150x150logo' content='/theme/frontend/images/favicon/mstile-150x150.png' />
				<meta name='msapplication-wide310x150logo' content='/theme/frontend/images/favicon/mstile-310x150.png' />
				<meta name='msapplication-square310x310logo' content='/theme/frontend/images/favicon/mstile-310x310.png' />
			</Head>

			<div className='container-fluid'>
				<Header />
			</div>
			<div className='container'>{children}</div>
			<Footer />
		</>
	);
};

export default CommonLayout;
