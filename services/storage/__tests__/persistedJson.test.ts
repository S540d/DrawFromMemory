import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPersistedJson } from '../persistedJson';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

interface Foo { n: number }
const isFoo = (v: unknown): v is Foo =>
  typeof v === 'object' && v !== null && typeof (v as any).n === 'number';

const makeStore = () => createPersistedJson<Foo>({
  key: '@test:foo',
  defaultValue: { n: 0 },
  isValid: isFoo,
});

describe('createPersistedJson', () => {
  beforeEach(() => {
    mockStorage.getItem.mockReset();
    mockStorage.setItem.mockReset();
    mockStorage.removeItem.mockReset();
    mockStorage.getItem.mockResolvedValue(null);
  });

  it('returns defaultValue when nothing is stored', async () => {
    const store = makeStore();
    expect(await store.load()).toEqual({ n: 0 });
  });

  it('roundtrips save + load', async () => {
    const store = makeStore();
    await store.save({ n: 42 });
    expect(mockStorage.setItem).toHaveBeenCalledWith('@test:foo', JSON.stringify({ n: 42 }));
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify({ n: 42 }));
    expect(await store.load()).toEqual({ n: 42 });
  });

  it('falls back to in-memory cache when AsyncStorage.getItem throws', async () => {
    const store = makeStore();
    await store.save({ n: 7 });
    mockStorage.getItem.mockRejectedValueOnce(new Error('offline'));
    expect(await store.load()).toEqual({ n: 7 });
  });

  it('falls back to in-memory cache when AsyncStorage.setItem throws', async () => {
    const store = makeStore();
    mockStorage.setItem.mockRejectedValueOnce(new Error('full'));
    await store.save({ n: 9 });
    mockStorage.getItem.mockResolvedValueOnce(null);
    expect(await store.load()).toEqual({ n: 9 });
  });

  it('recovers from corrupt JSON and clears storage', async () => {
    const store = makeStore();
    mockStorage.getItem.mockResolvedValueOnce('{not-json');
    expect(await store.load()).toEqual({ n: 0 });
    expect(mockStorage.removeItem).toHaveBeenCalledWith('@test:foo');
  });

  it('rejects values that fail the type-guard as corrupt', async () => {
    const store = makeStore();
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify({ wrong: 'shape' }));
    expect(await store.load()).toEqual({ n: 0 });
    expect(mockStorage.removeItem).toHaveBeenCalled();
  });

  it('reset removes both in-memory and AsyncStorage entries', async () => {
    const store = makeStore();
    await store.save({ n: 1 });
    await store.reset();
    expect(mockStorage.removeItem).toHaveBeenCalledWith('@test:foo');
    // After reset, load returns the default even if storage echoes the old value
    mockStorage.getItem.mockResolvedValueOnce(null);
    expect(await store.load()).toEqual({ n: 0 });
  });

  it('returns a fresh copy of defaultValue on each load — mutations do not persist', async () => {
    const store = createPersistedJson<{ items: string[] }>({
      key: '@test:arr',
      defaultValue: { items: [] },
    });
    const first = await store.load();
    first.items.push('mutated');
    const second = await store.load();
    expect(second.items).toHaveLength(0);
  });

  it('treats empty-string storage value as corrupt and clears it', async () => {
    const store = makeStore();
    mockStorage.getItem.mockResolvedValueOnce('');
    expect(await store.load()).toEqual({ n: 0 });
    expect(mockStorage.removeItem).toHaveBeenCalledWith('@test:foo');
  });

  it('isolates state across different stores', async () => {
    const a = createPersistedJson<Foo>({ key: '@a', defaultValue: { n: 0 }, isValid: isFoo });
    const b = createPersistedJson<Foo>({ key: '@b', defaultValue: { n: 0 }, isValid: isFoo });
    await a.save({ n: 1 });
    await b.save({ n: 2 });
    expect(mockStorage.setItem).toHaveBeenCalledWith('@a', JSON.stringify({ n: 1 }));
    expect(mockStorage.setItem).toHaveBeenCalledWith('@b', JSON.stringify({ n: 2 }));
  });
});
