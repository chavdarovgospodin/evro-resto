import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="warning-outline" size={64} color="#EF4444" />
        <Text style={styles.title}>Нещо се обърка</Text>
        <Text style={styles.message}>
          Възникна неочаквана грешка. Моля, опитайте отново.
        </Text>
        {__DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={resetErrorBoundary}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Опитай отново</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 20,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorDetails: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontFamily: 'monospace',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

