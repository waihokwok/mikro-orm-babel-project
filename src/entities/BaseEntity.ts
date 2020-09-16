import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export abstract class BaseEntity {
	@PrimaryKey()
	_id!: ObjectId;

	@SerializedPrimaryKey()
	id!: string;

	@Property()
	created_at: Date = new Date();

	@Property({ onUpdate: () => new Date() })
	updated_at: Date = new Date();
}

export abstract class DummyGetterBaseEntity {
	@PrimaryKey()
	_id!: ObjectId;

	@SerializedPrimaryKey()
	get id(): string {
		return '';
	}

	@Property()
	created_at: Date = new Date();

	@Property({ onUpdate: () => new Date() })
	updated_at: Date = new Date();
}
