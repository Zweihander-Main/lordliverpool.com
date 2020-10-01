import React from 'react';
import { FluidObject } from 'gatsby-image';
import BackgroundImage from 'gatsby-background-image';
import styles from './singlePost.module.scss';

type SinglePostProps = {
	headerImage?: FluidObject;
	title: string;
	content: string;
};

//TODO attribution for lifted posts
//TODO figure out origin source stuff

const PostHeader: React.FC<SinglePostProps> = ({
	headerImage,
	title,
	content,
}) => {
	const backgroundStack = headerImage
		? [
				'linear-gradient(180deg, rgba(66, 1, 1, 0.0) 50%, rgba(66,1,1,0.15) 75%, rgba(66, 1, 1, 0.6) 100%)',
				headerImage,
		  ]
		: [];

	//TODO add in author
	// TODO figure out width
	return (
		<article>
			{headerImage && (
				<BackgroundImage
					className={styles.postHeaderSection}
					fluid={backgroundStack}
					Tag={'section'}
				>
					<div className={styles.headings}>
						<h1 className={styles.postMainHeader}>{title}</h1>
					</div>
				</BackgroundImage>
			)}
			<section className={styles.postContentContainer}>
				<div className={styles.postContent}>
					<div
						className={styles.postText}
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				</div>
			</section>
		</article>
	);
};

export default PostHeader;
