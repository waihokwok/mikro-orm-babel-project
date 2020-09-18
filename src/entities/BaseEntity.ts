import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

function MySerializedPrimaryKey(): any {
	// Typescript property decorator will ignore property descriptor return.
	// Therefore, it should have no effect when running with tsc
	return function (target: Object, property: string): any {
		SerializedPrimaryKey()(target, property);
		return {};
	};
}

export abstract class BaseEntity {
	@PrimaryKey()
	_id!: ObjectId;

	@MySerializedPrimaryKey()
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
