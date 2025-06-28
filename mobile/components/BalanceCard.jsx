import { styles } from '../assets/styles/home.styles';
import React from 'react';
import { View, Text } from 'react-native';

function BalanceCard() {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Weekly Progress</Text>
      <Text style={styles.balanceAmount}>15 km Run</Text>

      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Time</Text>
          <Text style={styles.balanceStatAmount}>90 min</Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]}>
          <Text style={styles.balanceStatLabel}>Calories</Text>
          <Text style={styles.balanceStatAmount}>650 kcal</Text>
        </View>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Runs</Text>
          <Text style={styles.balanceStatAmount}>4</Text>
        </View>
      </View>
    </View>
  );

}

export default BalanceCard
