/** Persistence boundary. Provider selection is intentionally deferred until ADR review. */
export interface Repository<T, ID extends string = string> { getById(id:ID):Promise<T|null>; list():Promise<readonly T[]>; save(entity:T):Promise<void>; delete(id:ID):Promise<void>; }
