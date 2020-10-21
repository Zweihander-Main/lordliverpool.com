import React, { ReactElement } from 'react';
import styles from './contendersImage.module.scss';
import Img from 'gatsby-image';

type ContendersImageProps = {
	featuredImage?: GatsbyTypes.Maybe<
		Pick<
			GatsbyTypes.ImageSharpFluid,
			'sizes' | 'base64' | 'aspectRatio' | 'src' | 'srcSet'
		>
	>;
	displayDate?: string;
	title?: string;
	selectedID?: string;
};

const ContendersImage: React.FC<ContendersImageProps> = ({
	featuredImage,
	displayDate,
	title,
	selectedID,
}) => {
	return (
		<figure className={styles.pictureContainer}>
			{featuredImage && (
				<Img
					key={selectedID}
					className={styles.picture}
					imgStyle={{
						objectPosition: 'center 25%',
					}}
					fluid={featuredImage}
					durationFadeIn={100}
				/>
			)}
			<figcaption className={styles.caption}>
				{displayDate && <h2 className={styles.dates}>{displayDate}</h2>}
				{title && <h1 className={styles.name}>{title}</h1>}
			</figcaption>
		</figure>
	);
};

export default ContendersImage;
