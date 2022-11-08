import React from 'react';
import demoImg from 'assets/img/demo-phone.png';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { ButtonGroup, Panel, Placeholder, Stack, Button } from 'rsuite';

export default function CardPost({ loading = false, ...props }) {
	if (loading) return <CardSkeleton {...props} />;
	return <Card {...props} />;
}

function Card({ imgSrc, shadow, border, hover, cover }) {
	const classCard = clsx([
		'card',
		styles.card,
		{
			[styles.shadow]: shadow,
			[styles.border]: border,
			[styles.hover]: hover,
			[styles.cover]: cover,
		},
	]);

	return (
		<div className={classCard}>
			<div className={clsx('card-img-top', styles.cardImg)}>
				<img src={imgSrc || 'https://www.journal-theme.com/1/image/cache/catalog/journal3/gallery/aiony-haust-667702-unsplash-300x225w.jpg.webp'} className={styles.img} alt='...' />
			</div>

			<div className={styles.content}>
				<div className={styles.title}>
					<h3>title post</h3>
				</div>
				<p>
					The category description can be positioned anywhere on the page via the layout page builder inside the Blocks module with full typography control and
					advanced container styling options. The category image can also be added to the Category layouts automatically via the Blocks module. This allows for
					more creative placements on the page. It can also be enabled/disabled on any device and comes with custom image dimensions, including fit or fill
					(crop) options for all system images such as products, categories, banners, sliders, etc. Advanced Product Filter module included. This is the most
					comprehensive set of filtering tools rivaling the top paid extensions. It supports Opencart filters, price, availability, category, brands, options,
					attributes, tags, all included in the same Journal 3 package. Ajax Infinite Scroll with Load More / Load Previous and browser back button support.
					Load products in category pages as you scroll down or by clicking the Load More button, or disable this feature entirely and display the default
					pagination.
				</p>
			</div>
		</div>
	);
}

function CardSkeleton() {
	return (
		<Panel
			bordered
			header={
				<Stack justifyContent='space-between'>
					<span>Report Title</span>
					<ButtonGroup>
						<Button active>Day</Button>
						<Button>Week</Button>
						<Button>Month</Button>
					</ButtonGroup>
				</Stack>
			}
		>
			<Placeholder.Paragraph rows={5} graph='image' />
		</Panel>
	);
}
