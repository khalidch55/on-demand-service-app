import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../services/bookingService';
import { Service } from '../types';
import { colors, spacing, fonts } from '../constants/theme';
import { showAlert } from '../utils/alert';

interface Props {
  service: Service;
  navigation: { navigate: (screen: string) => void; getParent?: () => { navigate: (screen: string) => void } | undefined };
}

export default function ServiceDetailContent({ service, navigation }: Props) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [notes, setNotes] = useState('');

  const goToBookings = () => {
    navigation.getParent?.()?.navigate('Bookings');
  };

  const bookingMutation = useMutation({
    mutationFn: () => createBooking(service.id, date.toISOString(), notes),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      showAlert('Success', 'Booking created!', goToBookings);
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Booking failed');
    },
  });

  const onChangeDate = (_event: unknown, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.category}>{service.category?.name}</Text>
        <Text style={styles.price}>${Number(service.price).toFixed(2)}</Text>
        {service.description ? <Text style={styles.description}>{service.description}</Text> : null}
        <Text style={styles.duration}>{service.durationMinutes} minutes</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date & Time</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => { setMode('date'); setShow(true); }}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => { setMode('time'); setShow(true); }}>
          <Text style={styles.dateText}>
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special instructions..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={false}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity
        style={[styles.bookButton, bookingMutation.isPending && { opacity: 0.7 }]}
        onPress={() => bookingMutation.mutate()}
        disabled={bookingMutation.isPending}
      >
        {bookingMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md },
  name: { fontSize: fonts.size.xl, fontWeight: '700', color: colors.text, marginBottom: 4 },
  category: { fontSize: fonts.size.md, color: colors.textSecondary, marginBottom: 8 },
  price: { fontSize: fonts.size.xxl, fontWeight: '700', color: colors.primary },
  description: { fontSize: fonts.size.md, color: colors.textSecondary, marginTop: spacing.sm },
  duration: { fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: spacing.xs },
  section: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontSize: fonts.size.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  dateButton: {
    backgroundColor: colors.background, borderRadius: 12, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  dateText: { fontSize: fonts.size.md, color: colors.text, fontWeight: '500' },
  notesInput: {
    backgroundColor: colors.background, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, minHeight: 80, textAlignVertical: 'top', color: colors.text,
  },
  bookButton: {
    backgroundColor: colors.primary, borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', marginTop: spacing.md,
  },
  bookButtonText: { color: 'white', fontSize: fonts.size.lg, fontWeight: '600' },
});
