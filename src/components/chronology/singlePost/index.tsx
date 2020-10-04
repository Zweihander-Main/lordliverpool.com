import React from 'react';
import Img, { FluidObject } from 'gatsby-image';
import styles from './singlePost.module.scss';

type SinglePostProps = {
	headerImage?: FluidObject;
	title: string;
	subtitle?: string;
	extraHeaderText?: string;
	content: string;
};

//TODO attribution for lifted posts
//TODO figure out origin source stuff

const PostHeader: React.FC<SinglePostProps> = ({
	headerImage,
	title,
	subtitle,
	extraHeaderText,
	content,
}) => {
	//TODO add in author
	// TODO figure out width
	return (
		<div className={styles.postContainer}>
			<article className={styles.singlePost}>
				<div className={styles.headings}>
					<h1
						className={
							subtitle
								? `${styles.title} ${styles.successiveHeadings}`
								: styles.title
						}
					>
						{title}
					</h1>
					{subtitle && (
						<h2 className={styles.subtitle}>{subtitle}</h2>
					)}
					{extraHeaderText && (
						<h4 className={styles.extraHeaderText}>
							{extraHeaderText}
						</h4>
					)}
				</div>
				{headerImage && (
					<Img className={styles.postImage} fluid={headerImage} />
				)}
				<section className={styles.postContent}>
					<div dangerouslySetInnerHTML={{ __html: content }} />
				</section>
			</article>
		</div>
	);
};
//TODO alt attributes
export default PostHeader;
