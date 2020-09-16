export interface MutableRefObject<T> {
	current: T;
}

export function createMutableRefObject<T>(
	value?: T
): MutableRefObject<T | null> {
	return { current: value ?? null };
}
