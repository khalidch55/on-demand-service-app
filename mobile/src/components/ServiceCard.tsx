import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../types';
import { colors, spacing, fonts } from '../constants/theme';

export default function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={32} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.category}>{service.category?.name ?? 'Service'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${Number(service.price).toFixed(2)}</Text>
          <Text style={styles.duration}> · {service.durationMinutes} min</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  iconContainer: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  name: { fontSize: fonts.size.md, fontWeight: '600', color: colors.text, marginBottom: 2 },
  category: { fontSize: fonts.size.sm, color: colors.textSecondary, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: fonts.size.lg, fontWeight: '700', color: colors.primary },
  duration: { fontSize: fonts.size.sm, color: colors.textSecondary },
});
