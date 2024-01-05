import { createGlobalStyle } from "styled-components";

const ResetStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	body {
		line-height: 1;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
	.swal2-title {
  font-family: 'Poppins', sans-serif;
	}
	.swal2-html-container {
	font-family: 'Poppins', sans-serif;
	}
	.swal2-confirm {
	font-family: 'Poppins', sans-serif;
	}
	div.swal2-icon.swal2-error.swal2-icon-show{
  margin: 2.5em auto .6em;
  border: 0.25em solid rgba(0, 0, 0, 0);
  border-color: #F27474;
	}
	div.swal2-icon.swal2-success.swal2-icon-show{
  margin: 2.5em auto .6em;
  border: 0.25em solid rgba(0, 0, 0, 0);
  border-color: #74F299;
	}
	div.swal2-icon.swal2-info.swal2-icon-show{
  margin: 2.5em auto .6em;
  border: 0.25em solid rgba(0, 0, 0, 0);
  border-color: #3fc3ee;
	}
	div.swal2-icon.swal2-warning.swal2-icon-show{
  margin: 2.5em auto .6em;
  border: 0.25em solid rgba(0, 0, 0, 0);
  border-color: #f8bb86;
	}
`;

export default ResetStyle;
