'use client';

import { Blog, CheckList } from '@san-siva/blogkit';
import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'blogkit-md:increased-width-mode';

let increasedWidthMode =
	typeof localStorage === 'undefined'
		? false
		: localStorage.getItem(STORAGE_KEY) === 'true';

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

const getSnapshot = () => increasedWidthMode;

const setIncreasedWidthMode = (value: boolean) => {
	increasedWidthMode = value;
	localStorage.setItem(STORAGE_KEY, String(value));
	for (const listener of listeners) listener();
};

type BlogPageProperties = {
	children: ReactNode;
};

const BlogPage = ({ children }: BlogPageProperties) => {
	const checked = useSyncExternalStore(subscribe, getSnapshot, () => false);

	return (
		<Blog increasedWidthMode={checked}>
			<CheckList
				items={[
					{
						id: 'increased-width-mode',
						isChecked: checked,
						onClick: () => setIncreasedWidthMode(!checked),
						children: <p>Increased width mode</p>,
					},
				]}
			/>
			{children}
		</Blog>
	);
};

export default BlogPage;
