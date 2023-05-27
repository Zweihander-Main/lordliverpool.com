import React from 'react';
import * as styles from './ContImage.module.scss';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type ContendersImageProps = {
	featuredImage?: IGatsbyImageData;
	displayDate?: string | null;
	title?: string | null;
	selectedID?: string | null;
};

// TODO replace all imgstyle with imgclassname
const ContendersImage: React.FC<ContendersImageProps> = ({
	featuredImage,
	displayDate,
	title,
	selectedID,
}) => {
	return (
		<figure className={styles.pictureContainer}>
			{featuredImage && (
				<GatsbyImage
					alt={title || 'Contender Image'}
					image={featuredImage}
					key={selectedID}
					className={styles.picture}
					imgClassName={styles.pictureInner}
				/>
			)}
			<figcaption className={styles.caption}>
				{displayDate && <h2 className={styles.dates}>{displayDate}</h2>}
				{title && (
					<h1 data-testid="caption" className={styles.name}>
						{title}
					</h1>
				)}
			</figcaption>
		</figure>
	);
};

export default ContendersImage;
