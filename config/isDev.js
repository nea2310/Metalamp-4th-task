
const key = process.env.NODE_ENV;
module.exports = {
	isDev: key === 'development' || key !== 'abspath',
	isProd: !this.isDev,
	isAbsPath: key === 'abspath',
};