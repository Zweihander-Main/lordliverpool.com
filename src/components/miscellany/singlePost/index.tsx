import React from 'react';
import { FluidObject } from 'gatsby-image';
import BackgroundImage from 'gatsby-background-image';

import styles from './singlePost.module.scss';

type SinglePostProps = {
	headerImage: FluidObject;
	title: string;
	subtitle: string | undefined;
	date: string | undefined;
	content: string;
};

const PostHeader: React.FC<SinglePostProps> = ({
	headerImage,
	title,
	subtitle,
	date,
	content,
}) => {
	return (
		<article>
			<BackgroundImage
				className={styles.postHeaderSection}
				fluid={headerImage}
				Tag={'section'}
			>
				<div className={styles.headings}>
					<h1 className={styles.postMainHeader}>{title}</h1>
					{subtitle && (
						<h2 className={styles.postSubHeader}>{subtitle}</h2>
					)}
				</div>
			</BackgroundImage>
			<section className={styles.postContentContainer}>
				<div className={styles.postContent}>
					<div
						className={styles.postText}
						dangerouslySetInnerHTML={{ __html: content }}
					/>
					<div className={styles.postMeta}>
						{date && <p>{date}</p>}
					</div>
				</div>
			</section>
		</article>
	);
};

export default PostHeader;
