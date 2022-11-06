import Link from 'next/link';
import React from 'react';
import { forwardRef } from 'react';
import Breadcrumb from 'rsuite/Breadcrumb';

const NavLink = forwardRef((props, ref) => {
	const { href, as, children, ...rest } = props;
	return (
		<Link href={href} passHref {...rest}>
			{children}
		</Link>
	);
});

export default function KMBreadcrumb({ listNav }) {
	return (
		<Breadcrumb>
			<Breadcrumb.Item as={NavLink} href='/'>
				Home
			</Breadcrumb.Item>
			<Breadcrumb.Item as={NavLink} href='/components/overview'>
				Components
			</Breadcrumb.Item>
			<Breadcrumb.Item active>Breadcrumb</Breadcrumb.Item>
		</Breadcrumb>
	);
}
