import { MongoMemoryServer } from 'mongodb-memory-server';

import {
	MutableRefObject,
	createMutableRefObject,
} from './createMutableRefObject';

export function setUpMongoMemoryServerJest(
	version: string = 'latest'
): MutableRefObject<MongoMemoryServer | null> {
	jest.setTimeout(60000);
	const mongodRef = createMutableRefObject<MongoMemoryServer>();
	let mongod: MongoMemoryServer;

	beforeAll(async () => {
		mongod = new MongoMemoryServer({
			instance: { auth: false, storageEngine: 'wiredTiger' },
			binary: { version },
			autoStart: false,
		});
		mongodRef.current = mongod;
		await mongod.start();
	});

	afterAll(async () => {
		await mongod.stop();
	});
	return mongodRef;
}
