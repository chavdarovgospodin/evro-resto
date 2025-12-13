import { useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from 'react-error-boundary';
import { AppProvider, useApp } from '../src/context/AppContext';
import { ErrorFallback } from '../src/components/ErrorFallback';
import { Onboarding } from '../src/components/Onboarding';

function RootLayoutNav() {
  const { isLoading, isDark, showOnboarding, completeOnboarding } = useApp();
  const bgColor = isDark ? '#1F2937' : '#FFFFFF';

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: bgColor,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            contentStyle: {
              backgroundColor: bgColor,
            },
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
            gestureEnabled: true,
            gestureDirection: 'vertical',
            contentStyle: {
              backgroundColor: bgColor,
            },
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {showOnboarding && (
        <Onboarding
          onComplete={completeOnboarding}
          onSkip={completeOnboarding}
        />
      )}
    </View>
  );
}

export default function RootLayout() {
  const handleError = useCallback(
    (error: Error, info: { componentStack?: string | null }) => {
      // Тук може да се добави logging към external service (Sentry, etc.)
      console.error('App Error:', error);
      console.error('Component Stack:', info.componentStack);
    },
    []
  );

  const handleReset = useCallback(() => {
    // Reset app state if needed
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <SafeAreaProvider>
            <RootLayoutNav />
          </SafeAreaProvider>
        </AppProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
