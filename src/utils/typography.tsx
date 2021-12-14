import Typography from 'typography';
import * as v from 'styles/util/_variables.module.scss';

const formatFont = (font: string) => {
	if (!font) return [''];
	return font
		.replace(/"/g, '') //TODO removing the escape didn't break fonts
		.split(',')
		.map((font: string) => font.trim());
};

const typography = new Typography({
	baseFontSize: v.baseSize,
	baseLineHeight: parseFloat(v.baseLineHeight),
	scaleRatio: parseInt(v.scaleRatio),
	bodyColor: 'inherit',
	headerFontFamily: formatFont(v.headerFont),
	bodyFontFamily: formatFont(v.bodyFont),
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
