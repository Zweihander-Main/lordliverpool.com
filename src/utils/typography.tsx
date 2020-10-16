import Typography from 'typography';
import * as v from 'styles/util/_variables.global.scss';

const fonts: { [key: string]: Array<string> } = {};

Object.keys(v).forEach((key) => {
	fonts[key] = v[key]
		.replace(/\"/g, '')
		.split(',')
		.map((font: string) => font.trim());
});

const typography = new Typography({
	baseFontSize: '18px',
	baseLineHeight: 1.38,
	scaleRatio: 2,
	bodyColor: 'inherit',
	headerFontFamily: fonts.headerFont,
	bodyFontFamily: fonts.bodyFont,
	headerWeight: 700,
	bodyWeight: 400,
	boldWeight: 700,
	blockMarginBottom: 1.0,
	includeNormalize: true,
	overrideStyles: () => ({
		'h1,h2,h3,h4,h5,h6': {
			letterSpacing: v.letterSpacing,
		},
		body: {
			fontKerning: 'normal',
			fontFeatureSettings: '"kern", "liga", "clig", "calt"',
		},
	}),
});
export default typography;
