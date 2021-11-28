import React from 'react';
import Img, { FluidObject } from 'gatsby-image';
import Link from 'gatsby-link';
import * as styles from './singlePost.module.scss';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { AppLocState, LocTyping, NextPrevInfo } from 'types';
import { useLocation } from '@reach/router';

type SinglePostProps = {
	headerImage?: FluidObject;
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
	const location = useLocation() as LocTyping;
	const upperState = location?.state?.upperState;
	const initialPos = location?.state?.initialPos;

	// If scroll position exists, restore it
	// Otherwise, just tell the menu which item this is
	const passingState: AppLocState | null = id
		? typeof initialPos === 'number'
			? {
					upperState,
					initialPos,
			  }
			: {
					id,
			  }
		: null;

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
						<Link
							to={linkBackURL}
							className={styles.linkUp}
							state={passingState}
						>
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
