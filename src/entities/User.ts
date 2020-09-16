import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity, DummyGetterBaseEntity } from './BaseEntity';

@Entity()
export class User extends BaseEntity {
	@Property()
	username!: string;
}

@Entity()
export class DummyGetterUser extends DummyGetterBaseEntity {
	@Property()
	username!: string;
}
