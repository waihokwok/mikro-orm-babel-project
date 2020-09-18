import { MikroORM } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import {
	BaseEntity,
	DummyGetterBaseEntity,
	DummyGetterUser,
	User,
} from './entities';
import { DummyGetterUserService, UserService } from './services';

async function start() {
	const mongod = new MongoMemoryServer({
		instance: { auth: false, storageEngine: 'wiredTiger' },
		binary: { version: 'latest' },
		autoStart: false,
	});

	await mongod.start();
	const orm = await MikroORM.init({
		entities: [User, DummyGetterUser, BaseEntity, DummyGetterBaseEntity],
		type: 'mongo',
		clientUrl: await mongod.getUri(),
		ensureIndexes: true,
	});
	const entityManager = orm.em;
	const userService = new UserService(entityManager.getRepository(User));
	const dummyGetterUserService = new DummyGetterUserService(
		entityManager.getRepository(DummyGetterUser)
	);

	const _id1 = new ObjectId();
	const _id2 = new ObjectId();

	const userData1 = {
		_id: _id1,
		username: 'apple',
	};
	const userData2 = {
		id: _id2.toHexString(),
		username: 'orange',
	};
	const userData3 = {
		username: 'grapes',
	};

	const user1 = await userService.create(userData1);
	const user2 = await userService.create(userData2);
	const user3 = await userService.create(userData3);
	console.log(
		'user1 own property descriptor keys include "id"?',
		Object.keys(Object.getOwnPropertyDescriptors(user1)).includes('id')
	);
	console.log(
		'user2 own property descriptor keys include "id"?',
		Object.keys(Object.getOwnPropertyDescriptors(user2)).includes('id')
	);
	console.log(
		'user3 own property descriptor keys include "id"?',
		Object.keys(Object.getOwnPropertyDescriptors(user3)).includes('id')
	);
	console.log('user1 id', user1.id);
	console.log('user2 id', user2.id);
	console.log('user3 id', user3.id);

	const dummyGetterUser1 = await dummyGetterUserService.create(userData1);
	const dummyGetterUser2 = await dummyGetterUserService.create(userData2);
	const dummyGetterUser3 = await dummyGetterUserService.create(userData3);
	console.log(
		'dummyGetterUser1 own property descriptor keys include "id"?',
		Object.keys(
			Object.getOwnPropertyDescriptors(dummyGetterUser1)
		).includes('id')
	);
	console.log(
		'dummyGetterUser2 own property descriptor keys include "id"?',
		Object.keys(
			Object.getOwnPropertyDescriptors(dummyGetterUser2)
		).includes('id')
	);
	console.log(
		'dummyGetterUser3 own property descriptor keys include "id"?',
		Object.keys(
			Object.getOwnPropertyDescriptors(dummyGetterUser3)
		).includes('id')
	);
	console.log('dummyGetterUser1 id', dummyGetterUser1.id);
	console.log('dummyGetterUser2 id', dummyGetterUser2.id);
	console.log('dummyGetterUser3 id', dummyGetterUser3.id);

	await mongod.stop();
}

start()
	.catch((err) => {
		console.log(err);
	})
	.finally(() => process.exit(0));
