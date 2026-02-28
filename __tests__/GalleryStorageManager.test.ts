/**
 * Tests für die Galerie-Funktionen des StorageManagers
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageManager } from '../services/StorageManager';
import type { GalleryEntry } from '../services/StorageManager';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const makePaths = () => [{ points: [{ x: 0, y: 0 }], color: '#000', strokeWidth: 2 }];

const makeEntry = (overrides: Partial<Omit<GalleryEntry, 'id' | 'savedAt'>> = {}) => ({
  levelNumber: 1,
  imageFilename: 'cat.svg',
  imageName: 'Katze',
  paths: makePaths(),
  rating: 3,
  ...overrides,
});

describe('StorageManager – Gallery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    mockAsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  describe('getGallery', () => {
    it('should return empty array when no data exists', async () => {
      const gallery = await storageManager.getGallery();
      expect(gallery).toEqual([]);
    });

    it('should return parsed entries from storage', async () => {
      const storedEntry: GalleryEntry = {
        id: 'abc123',
        levelNumber: 2,
        imageFilename: 'dog.svg',
        imageName: 'Hund',
        paths: makePaths(),
        rating: 4,
        savedAt: new Date().toISOString(),
      };
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([storedEntry]));
      const gallery = await storageManager.getGallery();
      expect(gallery).toHaveLength(1);
      expect(gallery[0].imageName).toBe('Hund');
    });

    it('should return empty array and clear on corrupt JSON', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('not-valid-json{{{');
      const gallery = await storageManager.getGallery();
      expect(gallery).toEqual([]);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('saveToGallery', () => {
    it('should save a new entry with generated id and savedAt', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);
      await storageManager.saveToGallery(makeEntry());

      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBeDefined();
      expect(savedData[0].savedAt).toBeDefined();
      expect(savedData[0].imageName).toBe('Katze');
    });

    it('should add new entry at the beginning (newest first)', async () => {
      const existing: GalleryEntry = {
        id: 'old1',
        levelNumber: 1,
        imageFilename: 'old.svg',
        imageName: 'Alt',
        paths: makePaths(),
        rating: 2,
        savedAt: new Date(Date.now() - 10000).toISOString(),
      };
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([existing]));
      await storageManager.saveToGallery(makeEntry({ imageName: 'Neu' }));

      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData[0].imageName).toBe('Neu');
      expect(savedData[1].imageName).toBe('Alt');
    });

    it('should limit gallery to 50 entries', async () => {
      const existingEntries: GalleryEntry[] = Array.from({ length: 50 }, (_, i) => ({
        id: `entry${i}`,
        levelNumber: 1,
        imageFilename: 'img.svg',
        imageName: `Bild ${i}`,
        paths: makePaths(),
        rating: 3,
        savedAt: new Date().toISOString(),
      }));
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingEntries));
      await storageManager.saveToGallery(makeEntry({ imageName: 'Neu' }));

      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(50);
      expect(savedData[0].imageName).toBe('Neu');
    });
  });

  describe('deleteFromGallery', () => {
    it('should remove entry with matching id', async () => {
      const entries: GalleryEntry[] = [
        {
          id: 'keep1',
          levelNumber: 1,
          imageFilename: 'a.svg',
          imageName: 'Behalten',
          paths: makePaths(),
          rating: 3,
          savedAt: new Date().toISOString(),
        },
        {
          id: 'delete1',
          levelNumber: 2,
          imageFilename: 'b.svg',
          imageName: 'Löschen',
          paths: makePaths(),
          rating: 1,
          savedAt: new Date().toISOString(),
        },
      ];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(entries));
      await storageManager.deleteFromGallery('delete1');

      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('keep1');
    });

    it('should not fail if id does not exist', async () => {
      const entries: GalleryEntry[] = [
        {
          id: 'keep1',
          levelNumber: 1,
          imageFilename: 'a.svg',
          imageName: 'Behalten',
          paths: makePaths(),
          rating: 3,
          savedAt: new Date().toISOString(),
        },
      ];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(entries));
      await storageManager.deleteFromGallery('nonexistent');

      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
    });
  });
});
