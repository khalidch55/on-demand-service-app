import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyAvailability, addAvailability, deleteAvailability } from '../services/availabilityService';
import { colors, spacing, fonts } from '../constants/theme';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityScreen() {
  const queryClient = useQueryClient();
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: getMyAvailability,
  });

  const addMutation = useMutation({
    mutationFn: () => addAvailability(dayOfWeek, `${startTime}:00`, `${endTime}:00`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
    onError: (error: any) => Alert.alert('Error', error.response?.data?.message || 'Failed to add slot'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAvailability(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
  });

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Add Availability</Text>
        <View style={styles.dayRow}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, dayOfWeek === index && styles.dayChipActive]}
              onPress={() => setDayOfWeek(index)}
            >
              <Text style={[styles.dayText, dayOfWeek === index && styles.dayTextActive]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.timeRow}>
          <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="09:00" />
          <Text style={styles.to}>to</Text>
          <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="17:00" />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => addMutation.mutate()}>
          <Text style={styles.addBtnText}>Add Slot</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={slots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.slotCard}>
            <Text style={styles.slotText}>
              {DAYS[item.dayOfWeek]} · {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
            </Text>
            <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No availability slots yet</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { backgroundColor: colors.surface, margin: spacing.md, padding: spacing.md, borderRadius: 16 },
  title: { fontSize: fonts.size.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  dayRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md },
  dayChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { fontSize: fonts.size.xs, color: colors.text },
  dayTextActive: { color: 'white' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, backgroundColor: colors.background },
  to: { color: colors.textSecondary },
  addBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: '600' },
  list: { padding: spacing.md, paddingTop: 0 },
  slotCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm,
  },
  slotText: { color: colors.text, fontSize: fonts.size.md },
  deleteText: { color: colors.error, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.lg },
});
