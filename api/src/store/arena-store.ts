import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { createInitialState } from "../data/seed.ts";
import type { ArenaState } from "../domain/types.ts";

export interface ArenaStore {
  snapshot(): ArenaState;
  update<T>(mutator: (draft: ArenaState) => T): Promise<T>;
}

export class MemoryArenaStore implements ArenaStore {
  protected state: ArenaState;
  private queue: Promise<void> = Promise.resolve();

  constructor(initialState = createInitialState()) {
    this.state = structuredClone(initialState);
  }

  snapshot() {
    return structuredClone(this.state);
  }

  async update<T>(mutator: (draft: ArenaState) => T): Promise<T> {
    let result!: T;
    const operation = this.queue.then(async () => {
      const draft = structuredClone(this.state);
      result = mutator(draft);
      await this.persist(draft);
      this.state = draft;
    });
    this.queue = operation.catch(() => undefined);
    await operation;
    return result;
  }

  protected async persist(_state: ArenaState) {}
}

export class FileArenaStore extends MemoryArenaStore {
  private readonly filePath: string;

  private constructor(filePath: string, state: ArenaState) {
    super(state);
    this.filePath = filePath;
  }

  static async create(filePath: string) {
    try {
      const stored = JSON.parse(await readFile(filePath, "utf8")) as ArenaState;
      return new FileArenaStore(filePath, stored);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      const store = new FileArenaStore(filePath, createInitialState());
      await store.persist(store.snapshot());
      return store;
    }
  }

  protected override async persist(state: ArenaState) {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    await rename(temporaryPath, this.filePath);
  }
}
