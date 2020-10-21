import React, { ReactElement } from 'react';
import styles from './contendersImage.module.scss';
import Img from 'gatsby-image';
import rafSchd from 'raf-schd';

type ContendersImageProps = {
	featuredImage?: GatsbyTypes.Maybe<
		Pick<
			GatsbyTypes.ImageSharpFluid,
			'sizes' | 'base64' | 'aspectRatio' | 'src' | 'srcSet'
		>
	>;
	displayDate?: string;
	title?: string;
};

const ContendersImage: React.FC<ContendersImageProps> = ({
	featuredImage,
	displayDate,
	title,
}) => {
	const [component, setComponent] = React.useState<ReactElement | null>(null);
	const renderComponent = () => {
		setComponent(
			<figure className={styles.pictureContainer}>
				{featuredImage && (
					<Img
						className={styles.picture}
						imgStyle={{
							objectPosition: 'center 25%',
						}}
						fluid={featuredImage}
						durationFadeIn={100}
					/>
				)}
				<figcaption className={styles.caption}>
					{displayDate && (
						<h2 className={styles.dates}>{displayDate}</h2>
					)}
					{title && <h1 className={styles.name}>{title}</h1>}
				</figcaption>
			</figure>
		);
	};

	const rafRenderComponent = rafSchd(renderComponent);

	React.useEffect(() => {
		rafRenderComponent();
		return () => {
			rafRenderComponent.cancel();
		};
	}, []);

	return component;
};

export default ContendersImage;
