import {
	EntityManager,
	MikroORM,
	NotFoundError,
	UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

import {
	BaseEntity,
	DummyGetterBaseEntity,
	DummyGetterUser,
	DummyGetterUserService,
	User,
	UserService,
	setUpMongoMemoryServerJest,
} from '../src';

describe('EntityService', () => {
	const mongodRef = setUpMongoMemoryServerJest();
	let userService: UserService;
	let dummyGetterUserService: DummyGetterUserService;
	let entityManager: EntityManager;

	beforeAll(async () => {
		const orm = await MikroORM.init({
			entities: [
				DummyGetterUser,
				User,
				DummyGetterBaseEntity,
				BaseEntity,
			],
			type: 'mongo',
			clientUrl: await mongodRef.current?.getUri(),
			ensureIndexes: true,
		});
		entityManager = orm.em;
		userService = new UserService(entityManager.getRepository(User));
		dummyGetterUserService = new DummyGetterUserService(
			entityManager.getRepository(DummyGetterUser)
		);
	});

	afterEach(async () => {
		entityManager.clear();
		await entityManager.removeAndFlush(await entityManager.find(User, {}));
		await entityManager.removeAndFlush(
			await entityManager.find(DummyGetterUser, {})
		);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(dummyGetterUserService).toBeDefined();
	});

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

	describe('create (User)', () => {
		it('should be able to create entity with _id', async () => {
			const actual = await userService.create(userData1);
			expect(actual).toBeInstanceOf(User);
			expect(actual).toHaveProperty('_id', _id1);
			expect(actual).toHaveProperty('id', _id1.toHexString());
			expect(actual).toHaveProperty('created_at');
			expect(actual).toHaveProperty('updated_at');
			expect(actual).toHaveProperty('username', userData1.username);
			const dbActual = await entityManager.findOne(User, _id1);
			expect(dbActual).not.toBeNull();
		});

		it('should be able to create entity with id', async () => {
			const actual = await userService.create(userData2);
			expect(actual).toBeInstanceOf(User);
			expect(actual).toHaveProperty('_id', _id2);
			expect(actual).toHaveProperty('id', _id2.toHexString());
			expect(actual).toHaveProperty('created_at');
			expect(actual).toHaveProperty('updated_at');
			expect(actual).toHaveProperty('username', userData2.username);
			const dbActual = await entityManager.findOne(User, _id2);
			expect(dbActual).not.toBeNull();
		});

		it('should be able to create entity without id or _id', async () => {
			const actual = await userService.create(userData3);
			expect(actual).toBeInstanceOf(User);
			expect(actual).toHaveProperty('_id');
			expect(actual).toHaveProperty('id');
			expect(actual).toHaveProperty('created_at');
			expect(actual).toHaveProperty('updated_at');
			expect(actual).toHaveProperty('username', userData3.username);
			const dbActual = await entityManager.findOne(User, actual._id);
			expect(dbActual).not.toBeNull();
		});

		it('should be able to throw error if creating same (primary key) entity twice', async () => {
			let error: any;
			try {
				await userService.create(userData1);
				await userService.create(userData1);
			} catch (_error) {
				error = _error;
			}
			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(UniqueConstraintViolationException);
		});
	});

	describe('create (DummyGetterUser)', () => {
		it('should be able to create entity with _id', async () => {
			const actual = await dummyGetterUserService.create(userData1);
			expect(actual).toBeInstanceOf(DummyGetterUser);
			expect(actual).toHaveProperty('_id', _id1);
			expect(actual).toHaveProperty('id', _id1.toHexString());
			expect(actual).toHaveProperty('created_at');
			expect(actual).toHaveProperty('updated_at');
			expect(actual).toHaveProperty('username', userData1.username);
			const dbActual = await entityManager.findOne(DummyGetterUser, _id1);
			expect(dbActual).not.toBeNull();
		});

		it('should be able to create entity with id', async () => {
			const actual = await dummyGetterUserService.create(userData2);
			expect(actual).toBeInstanceOf(DummyGetterUser);
			expect(actual).toHaveProperty('_id', _id2);
			expect(actual).toHaveProperty('id', _id2.toHexString());
			expect(actual).toHaveProperty('created_at');
			expect(actual).toHaveProperty('updated_at');
			expect(actual).toHaveProperty('username', userData2.username);
			const dbActual = await entityManager.findOne(DummyGetterUser, _id2);
			expect(dbActual).not.toBeNull();
		});

		it('should be able to create entity without id or _id', async () => {
			const actual = await dummyGetterUserService.create(userData3);
			expect(actual).toBeInstanceOf(DummyGetterUser);
			expect(actual).toHaveProperty('_id');
			expect(actual).toHaveProperty('id');
			expect(actual).toHaveProperty('created_at');
			expect(actual).toHaveProperty('updated_at');
			expect(actual).toHaveProperty('username', userData3.username);
			const dbActual = await entityManager.findOne(
				DummyGetterUser,
				actual._id
			);
			expect(dbActual).not.toBeNull();
		});

		it('should be able to throw error if creating same (primary key) entity twice', async () => {
			let error: any;
			try {
				await dummyGetterUserService.create(userData1);
				await dummyGetterUserService.create(userData1);
			} catch (_error) {
				error = _error;
			}
			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(UniqueConstraintViolationException);
		});
	});

	describe('count', () => {
		const cond1 = { username: 'apple' };
		beforeEach(async () => {
			await userService.create(userData1);
			await userService.create(userData2);
		});
		it('should be able to count entities', async () => {
			const actual = await userService.count(cond1);
			expect(actual).toBe(1);
		});
	});

	describe('findOne', () => {
		const cond1 = { username: 'apple' };
		const cond2 = { username: 'notExists' };

		beforeEach(async () => {
			await userService.create(userData1);
		});

		it('should be able to find one if exists', async () => {
			const actual = await userService.findOne(cond1);
			expect(actual).toBeInstanceOf(User);
			expect(actual).toHaveProperty('username', cond1.username);
		});

		it('should be able to return null if not found', async () => {
			const actual = await userService.findOne(cond2);
			expect(actual).toBe(null);
		});
	});

	describe('findOneOrFail', () => {
		const cond1 = { username: 'apple' };
		const cond2 = { username: 'notExists' };

		beforeEach(async () => {
			await userService.create(userData1);
		});

		it('should be able to find one if exists', async () => {
			const actual = await userService.findOneOrFail(cond1);
			expect(actual).toBeInstanceOf(User);
			expect(actual).toHaveProperty('username', cond1.username);
		});

		it('should be able to throw error if not found', async () => {
			let error: any;
			try {
				await userService.findOneOrFail(cond2);
			} catch (_error) {
				error = _error;
			}
			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(NotFoundError);
		});
	});

	describe('find', () => {
		const cond1 = {};
		beforeEach(async () => {
			await userService.create(userData1);
			await userService.create(userData2);
		});
		it('should be able to find all entities', async () => {
			const actual = await userService.find(cond1);
			expect(actual).toBeInstanceOf(Array);
			expect(actual.length).toBe(2);
		});
	});

	describe('updateOne', () => {
		const update = { username: 'banana' };

		beforeEach(async () => {
			await userService.create(userData1);
		});

		it('should be able to update one if exists', async () => {
			const actual = await userService.updateOne(_id1, update);
			expect(actual).toBeInstanceOf(User);
			expect(actual).toHaveProperty('username', 'banana');
			const dbActual = await entityManager.findOne(User, _id1);
			expect(dbActual).toHaveProperty('username', 'banana');
		});
	});

	describe('removeOne', () => {
		beforeEach(async () => {
			await userService.create(userData1);
		});

		it('should be able to remove one if exists', async () => {
			const actual = await userService.removeOne(_id1);
			expect(actual).toBeInstanceOf(User);
			const dbActual = await entityManager.findOne(User, _id1);
			expect(dbActual).toBeNull();
		});
	});

	describe('remove', () => {
		const cond = {};

		beforeEach(async () => {
			await userService.create(userData1);
			await userService.create(userData2);
		});

		it('should be able to remove all entities', async () => {
			await userService.remove(cond);
			const dbActual = await entityManager.find(User, {});
			expect(dbActual.length).toBe(0);
		});
	});
});
