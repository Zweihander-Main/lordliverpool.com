import React from 'react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import * as styles from './singlePost.module.scss';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { NextPrevInfo } from '../../../types';

type SinglePostProps = {
	headerImage?: IGatsbyImageData;
	title: string;
	subtitle?: string | null;
	extraHeaderText?: string | null;
	content: string;
	meta?: string | null;
	linkBackURL?: string | null;
	linkBackName?: string | null;
	prev?: NextPrevInfo;
	next?: NextPrevInfo;
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
}) => {
	//TODO add in author
	// TODO figure out width
	return (
		<div className={styles.postContainer}>
			<article className={styles.singlePost}>
				<nav className={styles.navLinks}>
					{prev && prev.title && prev.slug && (
						<Link
							to={prev.slug}
							className={styles.linkPrev}
							aria-label={`Previous entry: ${prev.title}`}
						>
							<MdArrowBack className={styles.arrowPrev} />
							{prev.title}
						</Link>
					)}
					{linkBackURL && linkBackName && (
						<Link
							to={linkBackURL}
							className={styles.linkUp}
							aria-label={`Back to ${linkBackName}`}
						>
							Back to {linkBackName}
						</Link>
					)}
					{next && next.title && next.slug && (
						<Link
							to={next.slug}
							className={styles.linkNext}
							aria-label={`Next entry: ${next.title}`}
						>
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
						<h2 className={styles.extraHeaderText}>
							{extraHeaderText}
						</h2>
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
