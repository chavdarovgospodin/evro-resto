import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { triggerHapticLight, triggerHapticMedium } from '../utils/haptics';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const { isDark, t } = useApp();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const pages = [
    {
      title: t('tutorial.welcomeTitle'),
      subtitle: t('tutorial.welcomeSubtitle'),
      icon: '💰',
      buttonText: t('tutorial.next'),
    },
    {
      title: t('tutorial.howItWorksTitle'),
      steps: [t('tutorial.step1'), t('tutorial.step2'), t('tutorial.step3')],
      buttonText: t('tutorial.next'),
    },
    {
      title: t('tutorial.specialFeaturesTitle'),
      features: [
        t('tutorial.feature1'),
        t('tutorial.feature2'),
        t('tutorial.feature3'),
        t('tutorial.feature4'),
      ],
      buttonText: t('tutorial.start'),
    },
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const page = Math.round(offsetX / SCREEN_WIDTH);
        if (page !== currentPage) {
          setCurrentPage(page);
          triggerHapticLight();
        }
      },
    }
  );

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * SCREEN_WIDTH,
        animated: true,
      });
      triggerHapticMedium();
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    triggerHapticMedium();
    onComplete();
  };

  const handleSkip = () => {
    triggerHapticLight();
    onSkip();
  };

  const renderPage = (page: (typeof pages)[0], index: number) => {
    const isDarkMode = isDark;
    const bgColor = isDarkMode
      ? 'rgba(31, 41, 55, 0.98)'
      : 'rgba(255, 255, 255, 0.98)';
    const textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
    const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';

    return (
      <View
        key={index}
        style={[styles.page, { width: SCREEN_WIDTH, backgroundColor: bgColor }]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Skip Button */}
          <View style={[styles.skipButtonContainer, { top: insets.top + 10 }]}>
            <TouchableOpacity
              style={[
                styles.skipButton,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={[styles.skipText, { color: textColor }]}>
                {t('tutorial.skip')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Icon/Animation for first page */}
            {index === 0 && (
              <View style={styles.iconContainer}>
                <Text style={styles.largeIcon}>🇪🇺</Text>
              </View>
            )}

            {/* Title */}
            <Text style={[styles.title, { color: textColor }]}>
              {page.title}
            </Text>

            {/* Subtitle for first page */}
            {page.subtitle && (
              <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                {page.subtitle}
              </Text>
            )}

            {/* Steps for second page */}
            {page.steps && (
              <View style={styles.stepsContainer}>
                {page.steps.map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.stepItem}>
                    <Text style={[styles.stepText, { color: textColor }]}>
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Features for third page */}
            {page.features && (
              <View style={styles.featuresContainer}>
                {page.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={styles.featureItem}>
                    <Text style={[styles.featureText, { color: textColor }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonGradient]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{page.buttonText}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {pages.map((page, index) => renderPage(page, index))}
      </ScrollView>

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor:
                    currentPage === index ? '#9333ea' : '#9CA3AF',
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButtonContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 20,
  },
  largeIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 8,
  },
  stepsContainer: {
    width: '100%',
    marginTop: 40,
    gap: 24,
  },
  stepItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginTop: 40,
    gap: 16,
  },
  featureItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  buttonGradient: {
    backgroundColor: '#9333ea',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
