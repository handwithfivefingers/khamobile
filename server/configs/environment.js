import env from 'dotenv';
class LoadEnv {
	constructor() {
		env.config();
		console.log('Environments Loaded');
	}

	envInit = () => {
		this.envLoaded();
	};
	envLoaded = () => {
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1; // Conflict ssl
	};
}

const { envInit } = new LoadEnv();

export { envInit };
