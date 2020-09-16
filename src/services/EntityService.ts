import {
	AnyEntity,
	EntityData,
	EntityManager,
	EntityMetadata,
	EntityName,
	EntityRepository,
	FilterQuery,
	FindOneOptions,
	FindOptions,
	Loaded,
	Populate,
	Utils,
} from '@mikro-orm/core';
import createDebugger from 'debug';

export abstract class EntityService<T extends AnyEntity<T>> {
	constructor(readonly repository: EntityRepository<T>) {}

	private readonly debugger = createDebugger(
		`mikro-orm-babel-project:entity-service/${this.getEntityName()}`
	);

	getEntityManager(): EntityManager {
		return (this.repository as any).em; // Get protected property from EntityRepository
	}

	getEntityName(): EntityName<T> {
		return (this.repository as any).entityName; // Get protected property from EntityRepository
	}

	getEntityMetadata(): EntityMetadata<T> {
		const em: EntityManager = this.getEntityManager(); // Get protected property from EntityRepository
		return em.getMetadata().get(Utils.className(this.getEntityName()));
	}

	async has(where: FilterQuery<T>): Promise<boolean> {
		this.debugger('call has');
		this.debugger('input: %O', [where]);
		const existing = !!(await this.findOne(where));
		this.debugger('output: %O', existing);
		return existing;
	}

	async create(data: EntityData<T>): Promise<T> {
		this.debugger('call create');
		this.debugger('input: %O', [data]);

		const Entity = this.getEntityMetadata().class;
		const entity = new Entity();
		this.repository.assign(entity, data);
		await this.repository.persistAndFlush(entity);
		this.debugger('output: %O', entity);
		return entity;
	}

	async count(where: FilterQuery<T>): Promise<number> {
		this.debugger('call count');
		this.debugger('input: %O', [where]);

		const count = await this.repository.count(where);
		this.debugger('output: %O', count);
		return count;
	}

	async findOne<P extends Populate<T> = any>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P>
	): Promise<Loaded<T, P> | null> {
		this.debugger('call findOne');
		this.debugger('input: %O', [where, options]);

		const entity = await this.repository.findOne(where, options);
		this.debugger('output: %O', entity);
		return entity;
	}

	async findOneOrFail<P extends Populate<T> = any>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P> // providing failHandler is not allowed as this.rethrow relies on default handler.
	): Promise<Loaded<T, P>> {
		this.debugger('call findOneOrFail');
		this.debugger('input: %O', [where, options]);

		const entity = await this.repository.findOneOrFail(where, options);
		this.debugger('output: %O', entity);
		return entity;
	}

	async find<P extends Populate<T> = any>(
		where: FilterQuery<T> = {},
		options?: FindOptions<T, P>
	): Promise<Loaded<T, P>[]> {
		this.debugger('call find');
		this.debugger('input: %O', [where, options]);

		const entities = await this.repository.find(where, options);
		this.debugger('output: %O', entities);
		return entities;
	}

	async updateOne<P extends Populate<T> = any>(
		where: FilterQuery<T>,
		data: EntityData<T>,
		options?: FindOneOptions<T, P>
	): Promise<Loaded<T, P>> {
		this.debugger('call updateOne');
		this.debugger('input: %O', [where, data, options]);

		const entity = await this.findOneOrFail(where, options);
		this.repository.assign(entity, data);
		await this.repository.persistAndFlush(entity);
		this.debugger('output: %O', entity);
		return entity;
	}

	async removeOne<P extends Populate<T> = any>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P>
	): Promise<Loaded<T, P>> {
		this.debugger('call removeOne');
		this.debugger('input: %O', [where, options]);

		const entity = await this.findOneOrFail(where, options);
		await this.repository.removeAndFlush(entity);
		this.debugger('output: %O', entity);
		return entity;
	}

	async remove<P extends Populate<T> = any>(
		where: FilterQuery<T> = {},
		options?: FindOptions<T, P>
	): Promise<Loaded<T, P>[]> {
		this.debugger('call remove');
		this.debugger('input: %O', [where, options]);

		const entities = await this.find(where, options);
		for (const entity of entities) {
			await this.repository.removeAndFlush(entity);
		}
		this.debugger('output: %O', entities);
		return entities;
	}
}
