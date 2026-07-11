import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '../services/bookingService';
import { Booking } from '../types';
import BookingCard from '../components/BookingCard';
import { spacing, colors, fonts } from '../constants/theme';

export default function BookingHistoryScreen() {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['myBookings'],
    queryFn: getMyBookings,
  });

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>Failed to load bookings</Text></View>;
  }
  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No bookings yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item: Booking) => item.id.toString()}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.error, fontSize: fonts.size.md },
  emptyText: { color: colors.textSecondary, fontSize: fonts.size.lg },
});