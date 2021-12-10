
const key = process.env.NODE_ENV;
module.exports = {
	isDev: key === 'development',
	isProd: !this.isDev,
	isAbsPath: key === 'abspath',
};