import mongoose from 'mongoose';
class ConfigDatabase {
	constructor() {
		this.mongoseOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useCreateIndex: true,
		};
	}
	connectDB = async () => {
		try {
			const db = await mongoose.connect(process.env.DATABASE_URL, this.mongoseOptions);

			if (db.connections) {
				console.log('Database Loaded');
			}
		} catch (err) {
			console.log('db error connection', err);
		}
	};
}

export default new ConfigDatabase();
