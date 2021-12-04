import React from 'react';
import * as styles from './retailersModal.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

interface IFlagPics {
	[index: `${string}_pic`]: IGatsbyImageData | undefined;
}

const RetailersModal: React.FC = () => {
	const retailersData =
		useStaticQuery<GatsbyTypes.RetailersInfoQuery>(graphql`
			query RetailersInfo {
				allMarkdownRemark(
					sort: { order: ASC, fields: [frontmatter___order] }
					filter: {
						fields: { sourceInstanceName: { eq: "retailers" } }
					}
				) {
					edges {
						node {
							id
							frontmatter {
								title
								currency
								format
								link
								flag
								featuredImage {
									childImageSharp {
										gatsbyImageData(
											width: 400
											layout: CONSTRAINED
										)
									}
								}
							}
						}
					}
				}
				UK_pic: file(relativePath: { eq: "uk.png" }) {
					childImageSharp {
						gatsbyImageData(width: 40, layout: FIXED)
					}
				}
				USA_pic: file(relativePath: { eq: "usa.png" }) {
					childImageSharp {
						gatsbyImageData(width: 40, layout: FIXED)
					}
				}
				JP_pic: file(relativePath: { eq: "japan.png" }) {
					childImageSharp {
						gatsbyImageData(width: 40, layout: FIXED)
					}
				}
				ES_pic: file(relativePath: { eq: "spain.png" }) {
					childImageSharp {
						gatsbyImageData(width: 40, layout: FIXED)
					}
				}
				FR_pic: file(relativePath: { eq: "france.png" }) {
					childImageSharp {
						gatsbyImageData(width: 40, layout: FIXED)
					}
				}
				IT_pic: file(relativePath: { eq: "italy.png" }) {
					childImageSharp {
						gatsbyImageData(width: 40, layout: FIXED)
					}
				}
			}
		`);

	const flagPics = React.useRef<IFlagPics>(
		(() => {
			const UK_pic =
				retailersData?.UK_pic?.childImageSharp?.gatsbyImageData;
			const USA_pic =
				retailersData?.USA_pic?.childImageSharp?.gatsbyImageData;
			const JP_pic =
				retailersData?.JP_pic?.childImageSharp?.gatsbyImageData;
			const ES_pic =
				retailersData?.ES_pic?.childImageSharp?.gatsbyImageData;
			const FR_pic =
				retailersData?.FR_pic?.childImageSharp?.gatsbyImageData;
			const IT_pic =
				retailersData?.IT_pic?.childImageSharp?.gatsbyImageData;
			const flagObj = {
				UK_pic,
				USA_pic,
				JP_pic,
				ES_pic,
				FR_pic,
				IT_pic,
			};

			if (
				!UK_pic ||
				!USA_pic ||
				!JP_pic ||
				!ES_pic ||
				!FR_pic ||
				!IT_pic
			) {
				throw new Error('Missing image for flags');
			}
			return flagObj;
		})()
	);

	const { edges: retailers } = retailersData.allMarkdownRemark;

	const [formats, currencies] = React.useRef(
		(() => {
			const formatsGQL = retailers.map(
				(edge) => edge.node.frontmatter?.format
			);
			const currenciesGQL = retailers.map(
				(edge) => edge.node.frontmatter?.currency
			);
			const convertGQLListToArray = (
				gqlList: typeof formatsGQL | typeof currenciesGQL
			) => {
				const returnArr: Array<string> = [];
				gqlList.forEach((listItem) => {
					listItem?.forEach((item) => {
						if (item && returnArr.indexOf(item) === -1) {
							returnArr.push(item);
						}
					});
				});
				return returnArr;
			};
			const formats = convertGQLListToArray(formatsGQL);
			const currencies = convertGQLListToArray(currenciesGQL);
			return [formats, currencies];
		})()
	).current;

	const [selectedFormat, setSelectedFormat] = React.useState<string | null>(
		null
	);
	const [selectedCurrency, setSelectedCurrency] = React.useState<
		string | null
	>(null);

	type typeOfOption = 'format' | 'currency';

	const handleOptionChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: typeOfOption
	) => {
		const toChange = e.target.value;
		if (type === 'format') {
			setSelectedFormat(toChange);
		} else {
			setSelectedCurrency(toChange);
		}
	};

	const clearOptions = (type: typeOfOption) => {
		if (type === 'format') {
			setSelectedFormat(null);
		} else {
			setSelectedCurrency(null);
		}
	};

	const closeRef = React.useRef<HTMLAnchorElement>(null);

	const escFunction = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && closeRef.current) {
			closeRef.current.click();
		}
	};

	// Potential improvement: only add the event listener when the modal is
	// actually open
	React.useEffect(() => {
		document.addEventListener('keydown', escFunction, false);
		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, []);

	return (
		<section
			className={styles.outer}
			id={'retailers'}
			tabIndex={-1}
			role={'dialog'}
			aria-hidden={true}
		>
			<div className={styles.inner}>
				<div className={styles.menu}>
					<div className={styles.menuSelection}>
						<span className={styles.menuLabel}>Format:</span>
						<div className={styles.radioOptionsContainer}>
							{' '}
							{formats.map((format) => (
								<React.Fragment key={format}>
									<input
										className={styles.radioOption}
										type="radio"
										id={format.toLowerCase()}
										name="format-radio"
										value={format}
										checked={selectedFormat === format}
										onChange={(e) =>
											handleOptionChange(e, 'format')
										}
									/>
									<label
										className={styles.radioLabel}
										htmlFor={format.toLowerCase()}
									>
										{format}
									</label>
								</React.Fragment>
							))}
							<button
								className={`${styles.radioLabel} ${
									styles.unselect
								} ${
									selectedFormat !== null
										? styles.showUnselect
										: ''
								}`}
								onClick={() => clearOptions('format')}
							>
								X
							</button>
						</div>
					</div>
					<div className={styles.menuSelection}>
						<span className={styles.menuLabel}>Currency:</span>
						<div className={styles.radioOptionsContainer}>
							{currencies.map((currency) => (
								<React.Fragment key={currency}>
									<input
										className={styles.radioOption}
										type="radio"
										id={currency.toLowerCase()}
										name="currency-radio"
										value={currency}
										checked={selectedCurrency === currency}
										onChange={(e) =>
											handleOptionChange(e, 'currency')
										}
									/>
									<label
										className={styles.radioLabel}
										htmlFor={currency.toLowerCase()}
									>
										{currency}
									</label>
								</React.Fragment>
							))}
							<button
								className={`${styles.radioLabel} ${
									styles.unselect
								} ${
									selectedCurrency !== null
										? styles.showUnselect
										: ''
								}`}
								onClick={() => clearOptions('currency')}
							>
								X
							</button>
						</div>
					</div>
				</div>
				<div className={styles.retailersList}>
					{retailers &&
						retailers.map(({ node: retailer }) => {
							const flag = retailer?.frontmatter?.flag;
							const flagImage =
								flag && flag !== 'None'
									? flagPics.current[`${flag}_pic`]
									: undefined;
							let shouldDisplay = true;
							if (
								selectedCurrency !== null &&
								!retailer?.frontmatter?.currency?.includes(
									selectedCurrency
								)
							) {
								shouldDisplay = false;
							}
							if (
								selectedFormat !== null &&
								!retailer?.frontmatter?.format?.includes(
									selectedFormat
								)
							) {
								shouldDisplay = false;
							}
							return (
								<div
									className={
										shouldDisplay
											? `${styles.retailer} ${styles.showRetailer}`
											: styles.retailer
									}
									key={retailer.id}
								>
									<a
										target={'_blank'}
										rel={'noreferrer'}
										href={retailer?.frontmatter?.link || ''}
										className={styles.retailerLink}
									>
										{retailer?.frontmatter?.featuredImage
											?.childImageSharp
											?.gatsbyImageData && (
											<GatsbyImage
												image={
													retailer.frontmatter
														.featuredImage
														.childImageSharp
														.gatsbyImageData
												}
												alt={
													retailer.frontmatter
														.title ||
													'Retailer Image'
												}
												className={styles.logo}
												imgStyle={{
													margin: 0,
													objectFit: 'contain',
												}}
											/>
										)}
										{flagImage && (
											<GatsbyImage
												image={flagImage}
												alt={`${
													flag || 'Image of'
												} flag`}
												className={styles.flag}
												style={{ position: 'absolute' }}
											/>
										)}
									</a>
								</div>
							);
						})}
				</div>
			</div>

			<a
				href={'#!'}
				className={styles.close}
				title="Close the list of retailers"
				ref={closeRef}
			>
				?
			</a>
		</section>
	);
};

export default RetailersModal;
