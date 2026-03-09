import { StyleSheet } from 'react-native';

// Default width for SSR (will be overridden by actual window dimensions on client)
export const DEFAULT_CANVAS_WIDTH = 300;

export interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  type?: 'stroke' | 'fill'; // Optional: default = 'stroke'
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    padding: 16,
  },
  fallbackEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  fallbackErrorDetail: {
    marginTop: 12,
    fontSize: 11,
    color: '#C33',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#4ECDC4',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 140,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
