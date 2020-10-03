import Typography from 'typography';
import * as v from 'styles/util/_variables.global.scss';

const fonts = {};

Object.keys(v).forEach((key) => {
	fonts[key] = v[key]
		.replace(/\"/g, '')
		.split(',')
		.map((font) => font.trim());
});

const letterSpacing = '0.05em';

const typography = new Typography({
	title: 'Lord Liverpool',
	baseFontSize: '18px',
	baseLineHeight: 1.38,
	scaleRatio: 2,
	headerFontFamily: fonts.headerFont,
	bodyFontFamily: fonts.bodyFont,
	headerGray: 0,
	headerGrayHue: 0,
	bodyGray: 0,
	bodyGrayHue: 0,
	headerWeight: 700,
	bodyWeight: 400,
	boldWeight: 700,
	blockMarginBottom: 1.0,
	includeNormalize: true,
	overrideStyles: ({ adjustFontSizeTo, rhythm }, options, styles) => ({
		'h1,h2,h3,h4,h5,h6': {
			letterSpacing,
		},
	}),
});
export default typography;
