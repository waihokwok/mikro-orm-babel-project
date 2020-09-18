import { EntityRepository } from '@mikro-orm/core';

import { DummyGetterUser, User } from '../entities';
import { EntityService } from './EntityService';

export class UserService extends EntityService<User> {
	constructor(repository: EntityRepository<User>) {
		super(repository);
	}
}

export class DummyGetterUserService extends EntityService<DummyGetterUser> {
	constructor(repository: EntityRepository<DummyGetterUser>) {
		super(repository);
	}
}
