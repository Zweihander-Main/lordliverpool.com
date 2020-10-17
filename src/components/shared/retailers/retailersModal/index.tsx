import React from 'react';
import styles from './retailersModal.module.scss';
import ModalContext from 'contexts/ModalContext';
import useJS from 'hooks/useJS';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const RetailersModal: React.FC = () => {
	const retailersData = useStaticQuery<
		GatsbyTypes.RetailersInfoQuery
	>(graphql`
		query RetailersInfo {
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___order] }
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
									fluid(maxWidth: 400) {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
					}
				}
			}
			UK_pic: file(relativePath: { eq: "uk.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
			USA_pic: file(relativePath: { eq: "usa.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
		}
	`);

	const UK_pic = retailersData?.UK_pic?.childImageSharp?.fixed;
	const USA_pic = retailersData?.USA_pic?.childImageSharp?.fixed;
	const flagPics = {
		UK_pic,
		USA_pic,
	};

	if (!UK_pic || !USA_pic) {
		throw new Error('Missing image for flags');
	}

	const { edges: retailers } = retailersData.allMarkdownRemark;

	const formatsGQL = retailers.map((edge) => edge.node.frontmatter?.format);
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

	const { open, toggleModal } = React.useContext(ModalContext);
	const hasJS = useJS();

	const onCloseClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		e.preventDefault();
		toggleModal();
	};

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

	return (
		<section
			className={
				open ? `${styles.outer} ${styles.isActive}` : styles.outer
			}
			id={'retailers'}
			tabIndex={-1}
			role={'dialog'}
			aria-hidden={true}
		>
			<div className={styles.inner}>
				<div className={styles.menu}>
					<div className={styles.menuSelection}>
						<span className={styles.menuLabel}>Format:</span>
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
						<span
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
						</span>
					</div>
					<div className={styles.menuSelection}>
						<span className={styles.menuLabel}>Currency:</span>
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
						<span
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
						</span>
					</div>
				</div>
				<div className={styles.retailersList}>
					{retailers &&
						retailers.map(({ node: retailer }) => {
							const flag = retailer?.frontmatter?.flag;
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
										href={retailer?.frontmatter?.link || ''}
										className={styles.retailerLink}
									>
										{retailer?.frontmatter?.featuredImage
											?.childImageSharp?.fluid && (
											<Img
												fluid={
													retailer.frontmatter
														.featuredImage
														.childImageSharp.fluid
												}
												alt={retailer.frontmatter.title}
												className={styles.logo}
												imgStyle={{
													margin: 0,
													objectFit: 'contain',
												}}
											/>
										)}
										{flag && flag !== 'None' && (
											<Img
												fixed={flagPics[`${flag}_pic`]}
												alt={`${flag} flag`}
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
				href={hasJS ? '' : '#!'}
				onClick={onCloseClick}
				className={styles.close}
				title="Close the list of retailers"
			>
				?
			</a>
		</section>
	);
};

export default RetailersModal;
