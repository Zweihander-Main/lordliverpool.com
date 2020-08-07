import React from 'react';
import styles from './bookInfo.module.scss';
import Img, { FluidObject } from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';

type BookImageProps = {
	file: {
		childImageSharp: {
			fluid: FluidObject;
		};
	};
};

const BookInfo: React.FC = () => {
	//TODO better naming for images and support for alt ect.
	const bookImageData = useStaticQuery<BookImageProps>(graphql`
		query {
			file(relativePath: { eq: "bookcover.png" }) {
				childImageSharp {
					fluid {
						...GatsbyImageSharpFluid
					}
				}
			}
		}
	`);
	return (
		<section className={styles.bookInfo}>
			<Img
				className={styles.bookDisplay}
				fluid={bookImageData.file.childImageSharp.fluid}
			/>
			<article className={styles.info}>
				<h1 className={styles.header}>
					Britain’s Greatest Prime Minister
				</h1>
				<h2 className={styles.subHeader}>Lord Liverpool</h2>
				<h3 className={styles.authorHeader}>By Martin Hutchinson</h3>
				<p>
					Labore et vitae autem est explicabo quo. Qui eos nemo unde
					accusamus atque. Repellendus suscipit et veritatis tempora
					aut consequatur est est. Inventore repellendus omnis vel qui
					odit. Ipsam voluptatum nihil aut mollitia sit nihil.
					Deserunt dolore voluptatem quia autem quia velit accusantium
					est.
				</p>
				<p>
					Non quas et neque assumenda quidem dolorum aspernatur a. Vel
					sit porro qui sed aut. Sed enim eveniet voluptatum
					laboriosam iure a. Ut quae officiis aut architecto. Eligendi
					reprehenderit dicta earum esse vel vitae. Illum aliquam eius
					et est et molestias magnam similique.
				</p>
				<p>
					Ratione odio voluptas eius veritatis quaerat tempora omnis.
					Occaecati et occaecati rerum ipsa similique voluptatibus.
					Delectus et et pariatur impedit explicabo dolorem molestias.
					Asperiores sed repudiandae sunt tempora exercitationem
					blanditiis.
				</p>
				<p>
					Facilis soluta aperiam molestiae illum officia voluptas.
					Quos iste perspiciatis voluptates repudiandae architecto. Ab
					et repellendus voluptatibus impedit iure veritatis cumque.
				</p>
				<p>
					Rem atque dignissimos voluptas nam. Omnis tenetur odio non
					non sed iure fuga. Harum repellat libero odit. Enim quaerat
					consequatur mollitia quos autem illo saepe. Dolores et hic
					dolorum maxime et. Odio labore consequatur aspernatur
					dolorem nesciunt optio.
				</p>
			</article>
		</section>
	);
};

export default BookInfo;
