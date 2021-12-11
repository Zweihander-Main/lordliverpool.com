import React, { useContext, useEffect } from 'react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import Link from 'gatsby-link';
import * as styles from './singlePost.module.scss';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { AppLocState, NextPrevInfo } from 'types';
import ScrollLocContext from 'contexts/ScrollLocContext';

type SinglePostProps = {
	headerImage?: IGatsbyImageData;
	title: string;
	subtitle?: string;
	extraHeaderText?: string;
	content: string;
	meta?: string;
	linkBackURL?: string;
	linkBackName?: string;
	prev?: NextPrevInfo;
	next?: NextPrevInfo;
	id?: string;
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
	prev,
	next,
	id,
}) => {
	const { setId } = useContext(ScrollLocContext);

	useEffect(() => {
		if (id) {
			setId(id);
		}
	}, [id, setId]);

	//TODO add in author
	// TODO figure out width
	return (
		<div className={styles.postContainer}>
			<article className={styles.singlePost}>
				<nav className={styles.navLinks}>
					{prev && prev.title && prev.slug && (
						<Link to={prev.slug} className={styles.linkPrev}>
							<MdArrowBack className={styles.arrowPrev} />
							{prev.title}
						</Link>
					)}
					{linkBackURL && linkBackName && (
						<Link to={linkBackURL} className={styles.linkUp}>
							Back to {linkBackName}
						</Link>
					)}
					{next && next.title && next.slug && (
						<Link to={next.slug} className={styles.linkNext}>
							{next.title}
							<MdArrowForward className={styles.arrowNext} />
						</Link>
					)}
				</nav>
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
					<GatsbyImage
						alt={title}
						image={headerImage}
						className={styles.postImage}
					/>
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
