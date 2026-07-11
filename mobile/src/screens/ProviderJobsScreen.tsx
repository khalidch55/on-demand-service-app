import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPendingBookings, getProviderBookings, updateBookingStatus, rejectBooking, completeService,
} from '../services/bookingService';
import { Booking } from '../types';
import { colors, spacing, fonts } from '../constants/theme';
import { showAlert } from '../utils/alert';

function JobCard({
  booking, onAccept, onReject, onStart, onComplete, showActions,
}: {
  booking: Booking;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.serviceName}>{booking.service?.name}</Text>
      <Text style={styles.meta}>Customer: {booking.customer?.name ?? '—'}</Text>
      <Text style={styles.meta}>{new Date(booking.dateTime).toLocaleString()}</Text>
      <Text style={styles.meta}>Amount: ${Number(booking.amount ?? booking.service?.price ?? 0).toFixed(2)}</Text>
      <Text style={styles.status}>{booking.status.replace(/_/g, ' ')}</Text>

      {booking.status === 'awaiting_payment' && (
        <Text style={styles.awaiting}>Waiting for customer payment</Text>
      )}

      {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
        <Text style={styles.completed}>Paid & completed · {booking.mockTransactionId}</Text>
      )}

      <View style={styles.actions}>
        {showActions && onAccept && onReject && (
          <>
            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
        {booking.status === 'accepted' && onStart && (
          <TouchableOpacity style={styles.primaryBtn} onPress={onStart}>
            <Text style={styles.btnText}>Start Job</Text>
          </TouchableOpacity>
        )}
        {booking.status === 'in_progress' && onComplete && (
          <TouchableOpacity style={styles.successBtn} onPress={onComplete}>
            <Text style={styles.btnText}>Complete Service</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ProviderJobsScreen() {
  const queryClient = useQueryClient();

  const { data: pending = [], isLoading: loadingPending } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: getPendingBookings,
  });

  const { data: assigned = [], isLoading: loadingAssigned } = useQuery({
    queryKey: ['providerBookings'],
    queryFn: getProviderBookings,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pendingBookings'] });
    queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateBookingStatus(id, status),
    onSuccess: invalidate,
    onError: (error: any) => showAlert('Error', error.response?.data?.message || 'Action failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectBooking(id),
    onSuccess: () => {
      invalidate();
      showAlert('Rejected', 'Booking removed from your requests.');
    },
    onError: (error: any) => showAlert('Error', error.response?.data?.message || 'Reject failed'),
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => completeService(id),
    onSuccess: () => {
      invalidate();
      showAlert('Service Complete', 'Customer can now pay to complete the booking.');
    },
    onError: (error: any) => showAlert('Error', error.response?.data?.message || 'Action failed'),
  });

  if (loadingPending || loadingAssigned) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>New Requests ({pending.length})</Text>
            {pending.length === 0 ? <Text style={styles.empty}>No pending requests</Text> : null}
          </>
        }
        data={pending}
        keyExtractor={(item: Booking) => `pending-${item.id}`}
        renderItem={({ item }) => (
          <JobCard
            booking={item}
            showActions
            onAccept={() => statusMutation.mutate({ id: item.id, status: 'accepted' })}
            onReject={() => rejectMutation.mutate(item.id)}
          />
        )}
        ListFooterComponent={
          <View>
            <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              My Jobs ({assigned.length})
            </Text>
            {assigned.length === 0 ? <Text style={styles.empty}>No assigned jobs</Text> : null}
            {assigned.map((item: Booking) => (
              <JobCard
                key={item.id}
                booking={item}
                onStart={() => statusMutation.mutate({ id: item.id, status: 'in_progress' })}
                onComplete={() => completeMutation.mutate(item.id)}
              />
            ))}
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: fonts.size.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  empty: { color: colors.textSecondary, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  serviceName: { fontSize: fonts.size.md, fontWeight: '600', color: colors.text },
  meta: { fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: 4 },
  status: { fontSize: fonts.size.sm, color: colors.primary, marginTop: 4, textTransform: 'capitalize' },
  awaiting: { fontSize: fonts.size.sm, color: '#8B5CF6', marginTop: 4, fontWeight: '600' },
  completed: { fontSize: fonts.size.sm, color: colors.success, marginTop: 4, fontWeight: '600' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.sm },
  acceptBtn: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  rejectBtn: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: colors.error },
  rejectText: { color: colors.error, fontWeight: '600' },
  primaryBtn: { backgroundColor: '#3B82F6', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  successBtn: { backgroundColor: colors.success, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  btnText: { color: 'white', fontWeight: '600' },
});
