import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';

import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';

import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/timer/Timer';

const STATUS = {
  COMPLETE: 1,
  CANCEL: 2,
};

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  useEffect(() => {
    loadFocusHistory();
  }, []);

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  const addFocusHistorySubjectWithStatus = (subject, status) => {
    setFocusHistory([...focusHistory, { key: String(focusHistory.length + 1), subject, status }]);
  };

  const onTimerEnd = () => {
    addFocusHistorySubjectWithStatus(focusSubject, STATUS.COMPLETE);
    setFocusSubject(null);
  };

  const clearSubject = () => {
    addFocusHistorySubjectWithStatus(focusSubject, STATUS.CANCEL);
    setFocusSubject(null);
  };

  const onClear = () => {
    setFocusHistory([]);
  };

  const saveFocusHistory = async () => {
    try {
        await AsyncStorage.setItem(
          'focusHistory',
          JSON.stringify(focusHistory)
        );
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');

      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={onTimerEnd}
          clearSubject={clearSubject}
        />
      ) : (
        <View style={{flex: 1 }}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.darkBlue,
  },
});
