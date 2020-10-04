import React from 'react';
import Img, { FluidObject } from 'gatsby-image';
import Link from 'gatsby-link';
import styles from './singlePost.module.scss';
import { MdArrowBack } from 'react-icons/md';

type SinglePostProps = {
	headerImage?: FluidObject;
	title: string;
	subtitle?: string;
	extraHeaderText?: string;
	content: string;
	meta?: string;
	linkBackURL?: string;
	linkBackName?: string;
};

//TODO attribution for lifted posts
//TODO figure out origin source stuff

const PostHeader: React.FC<SinglePostProps> = ({
	headerImage,
	title,
	subtitle,
	extraHeaderText,
	content,
	meta,
	linkBackURL,
	linkBackName,
}) => {
	//TODO add in author
	// TODO figure out width
	return (
		<div className={styles.postContainer}>
			<article className={styles.singlePost}>
				{linkBackURL && linkBackName && (
					<Link to={linkBackURL} className={styles.linkBack}>
						<MdArrowBack className={styles.arrowBack} />
						Back to {linkBackName}
					</Link>
				)}
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
					{meta && (
						<div>
							<p>{meta}</p>
						</div>
					)}
				</section>
			</article>
		</div>
	);
};
//TODO alt attributes
export default PostHeader;
