import React, { memo } from 'react';
import * as styles from './RetailersModal.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import isEqual from 'react-fast-compare';

interface IFlagPics {
	[index: `${string}_pic`]: IGatsbyImageData | undefined;
}

type RetailerItemFlagImageProps = {
	flagImage: IGatsbyImageData;
	flagName: string;
};

const RetailerItemFlagImage: React.FC<RetailerItemFlagImageProps> = ({
	flagImage,
	flagName,
}) => (
	<GatsbyImage
		image={flagImage}
		alt={`${flagName} flag`}
		className={styles.flag}
		style={{ position: 'absolute' }}
	/>
);

const MemoizedRetailerItemFlagImage = memo(RetailerItemFlagImage, isEqual);

type RetailerItemImageProps = {
	image: IGatsbyImageData;
	title: string;
};

const RetailerItemImage: React.FC<RetailerItemImageProps> = ({
	image,
	title,
}) => (
	<GatsbyImage
		image={image}
		alt={title}
		className={styles.logo}
		imgStyle={{
			margin: 0,
			objectFit: 'contain',
		}}
	/>
);

const MemoizedRetailerItemImage = memo(RetailerItemImage, isEqual);

type RetailerItemProps = {
	shouldDisplay: boolean;
	title: string;
	link: string;
	image: IGatsbyImageData | undefined;
	flagImage: IGatsbyImageData | undefined;
	flagName: string;
};

const RetailerItem: React.FC<RetailerItemProps> = ({
	shouldDisplay,
	title,
	link,
	image,
	flagImage,
	flagName,
}) => {
	return (
		<div
			className={
				shouldDisplay
					? `${styles.retailer} ${styles.showRetailer}`
					: styles.retailer
			}
		>
			<a
				target={'_blank'}
				aria-label={title}
				rel={'noreferrer noopener'}
				href={link}
				className={styles.retailerLink}
			>
				{image && <MemoizedRetailerItemImage {...{ title, image }} />}
				{flagImage && (
					<MemoizedRetailerItemFlagImage
						{...{ flagImage, flagName }}
					/>
				)}
			</a>
		</div>
	);
};

const MemoizedRetailerItem = memo(RetailerItem, isEqual);

const RetailersModal: React.FC = () => {
	const retailersData = useStaticQuery<Queries.RetailersInfoQuery>(graphql`
		query RetailersInfo {
			allMarkdownRemark(
				sort: { frontmatter: { order: ASC } }
				filter: { fields: { sourceInstanceName: { eq: "retailers" } } }
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
			UK_pic: file(relativePath: { eq: "retailerFlags/uk.png" }) {
				childImageSharp {
					gatsbyImageData(width: 40, layout: FIXED)
				}
			}
			USA_pic: file(relativePath: { eq: "retailerFlags/usa.png" }) {
				childImageSharp {
					gatsbyImageData(width: 40, layout: FIXED)
				}
			}
			JP_pic: file(relativePath: { eq: "retailerFlags/japan.png" }) {
				childImageSharp {
					gatsbyImageData(width: 40, layout: FIXED)
				}
			}
			ES_pic: file(relativePath: { eq: "retailerFlags/spain.png" }) {
				childImageSharp {
					gatsbyImageData(width: 40, layout: FIXED)
				}
			}
			FR_pic: file(relativePath: { eq: "retailerFlags/france.png" }) {
				childImageSharp {
					gatsbyImageData(width: 40, layout: FIXED)
				}
			}
			IT_pic: file(relativePath: { eq: "retailerFlags/italy.png" }) {
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
								type="reset"
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
								type="reset"
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
								<MemoizedRetailerItem
									{...{
										shouldDisplay,
										title:
											retailer?.frontmatter?.title ||
											'Retailer',
										link: retailer?.frontmatter?.link || '',
										image: retailer?.frontmatter
											?.featuredImage?.childImageSharp
											?.gatsbyImageData,
										flagImage,
										flagName: flag || 'Image of',
									}}
									key={retailer.id}
								/>
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
