import type { ForecastInput, SavedPlan } from "./types";

// Demo data deliberately uses a separate database. A visitor can explore the
// sample without reading or changing plans saved for themselves.
const DB_NAME = new URLSearchParams(window.location.search).get("demo") === "1"
  ? "review-backlog-forecast-demo"
  : "review-backlog-forecast";
const STORE = "records";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Local storage could not be opened."));
  });
}

async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Local storage failed."));
    transaction.oncomplete = () => db.close();
  });
}

export const storage = {
  getInput: () => transact<ForecastInput | undefined>("readonly", (store) => store.get("input")),
  saveInput: (input: ForecastInput) => transact("readwrite", (store) => store.put(input, "input")),
  getPlan: () => transact<SavedPlan | undefined>("readonly", (store) => store.get("plan")),
  savePlan: (plan: SavedPlan) => transact("readwrite", (store) => store.put(plan, "plan")),
  clearPlan: () => transact("readwrite", (store) => store.delete("plan")),
  clearAll: async () => {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Local data could not be cleared."));
    });
    db.close();
  }
};
