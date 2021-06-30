import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

const minutesToMills = (min) => min * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes, isPaused, onProgress, onEnd }) => {
  const interval = React.useRef(null);
  const tmp = React.useRef(0);

  const [millis, setMillis] = useState(minutesToMills(minutes));

  useEffect(() => {
    setMillis(minutesToMills(minutes));
  }, [minutes]);

  useEffect(() => {
    onProgress(tmp.current / minutesToMills(minutes));

    if (millis === 0) {
      onEnd();
    }
  }, [millis]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }

    interval.current = setInterval(countDown, 1000);

    return () => {
      clearInterval(interval.current);
      tmp.current = 0;
    };
  }, [isPaused]);

  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);

        return time;
      }

      const timeLeft = time - 1000;
      tmp.current = tmp.current + 1000;

      return timeLeft;
    });
  };

  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
    textAlign: 'center',
  },
});
