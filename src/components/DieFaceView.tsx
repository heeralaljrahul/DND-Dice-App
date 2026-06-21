import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { DieType, getSides } from '../models/DieType';
import { DieShape } from './DieShape';
import { useTheme } from '../theme/ThemeContext';

interface DieFaceViewProps {
  dieType: DieType;
  value: number; // For d100 this is the total, but we might want components
  components?: number[]; // [tens, units] for d100
  isRolling: boolean;
  size?: number;
}

export const DieFaceView: React.FC<DieFaceViewProps> = ({
  dieType,
  value,
  components,
  isRolling,
  size = 150,
}) => {
  const { colors } = useTheme();
  
  const isPercentile = dieType === 'd100';
  const sides = getSides(dieType);

  // Local state for the rapid number cycling
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [displayComponents, setDisplayComponents] = useState<number[] | undefined>(components);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reanimated values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRolling) {
      // 1. Start haptic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // 2. Start Reanimated bounce & spin
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withRepeat(withTiming(1.1, { duration: 100 }), 5, true)
      );
      
      // Rotate 720 degrees
      rotation.value = 0;
      rotation.value = withTiming(720, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      });

      // 3. Start rapid number cycling
      intervalRef.current = setInterval(() => {
        if (isPercentile) {
          const t = Math.floor(Math.random() * 10);
          const u = Math.floor(Math.random() * 10);
          setDisplayComponents([t, u]);
          setDisplayValue(t === 0 && u === 0 ? 100 : t * 10 + u);
        } else {
          setDisplayValue(Math.floor(Math.random() * sides) + 1);
        }
      }, 50);

    } else {
      // Stop rolling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Settle on actual value
      setDisplayValue(value);
      setDisplayComponents(components);

      // Final pop and haptic
      cancelAnimation(scale);
      scale.value = withSequence(
        withTiming(1.15, { duration: 100 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );

      // Check for natural 20 or 1
      if (dieType === 'd20') {
        if (value === 20) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (value === 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRolling, value, components, dieType, sides, isPercentile, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  // Calculate text colors (Crit highlight)
  let numberColor = colors.background;
  if (dieType === 'd20' && !isRolling) {
    if (value === 20) numberColor = colors.success;
    if (value === 1) numberColor = colors.danger;
  }

  const renderContent = () => {
    if (isPercentile && displayComponents) {
      const [tens, units] = displayComponents;
      const tensStr = tens === 0 ? '00' : `${tens * 10}`;
      const unitsStr = `${units}`;
      
      return (
        <View style={styles.percentileContainer}>
          <Text style={[styles.numberText, { color: numberColor, fontSize: size * 0.3 }]}>
            {displayValue}
          </Text>
          <View style={styles.percentileDiceRow}>
            <Text style={[styles.smallDieText, { color: numberColor, fontSize: size * 0.15 }]}>{tensStr}</Text>
            <Text style={[styles.smallDieText, { color: numberColor, fontSize: size * 0.15 }]}>{unitsStr}</Text>
          </View>
        </View>
      );
    }

    return (
      <Text style={[styles.numberText, { color: numberColor, fontSize: size * 0.4 }]}>
        {displayValue}
      </Text>
    );
  };

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <View style={styles.shapeContainer}>
        <DieShape dieType={dieType} size={size} color={colors.accent} />
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeContainer: {
    position: 'absolute',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  numberText: {
    fontWeight: 'bold',
    fontFamily: 'System', // Standard iOS system font, very clean
  },
  percentileContainer: {
    alignItems: 'center',
  },
  percentileDiceRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  smallDieText: {
    fontWeight: 'bold',
    fontFamily: 'System',
  }
});
