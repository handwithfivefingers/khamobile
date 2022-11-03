import clsx from 'clsx';
import styles from './styles.module.scss';

const Catalog = () => {
	return (
		<div className={styles.grid}>
			<div className={clsx(styles.col, styles.firstCol)}>
				<div className={styles.title}>
					<h5>Feature</h5>

					<div className='title__divider' />
				</div>
				<div className={styles.content}>
					<div className={styles.img}>
						<img src='https://www.journal-theme.com/1/image/cache/catalog/journal3/categories/demo09-260x260.jpg.webp' />
					</div>

					<div className={styles.listLink}>
						<ul>
							<li>
								<a>Accessories</a>
							</li>
							<li>
								<a>Dresses</a>
							</li>
							<li>
								<a>Pants</a>
							</li>
							<li>
								<a>T-Shirts</a>
							</li>
						</ul>
					</div>
					<button className={'btn btn-primary'}>See All</button>
				</div>
			</div>

			<div className={clsx(styles.lastCol, styles.col)}></div>
		</div>
	);
};

export default Catalog;
