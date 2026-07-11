import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookingStatus, processMockPayment } from '../services/bookingService';
import { Booking } from '../types';
import { colors, spacing, fonts } from '../constants/theme';
import { showAlert, showConfirm } from '../utils/alert';
import MockPaymentModal from './MockPaymentModal';

const statusColors: Record<string, string> = {
  pending: colors.warning,
  accepted: colors.primary,
  in_progress: '#3B82F6',
  awaiting_payment: '#8B5CF6',
  completed: colors.success,
  cancelled: colors.error,
};

const statusSteps = ['pending', 'accepted', 'in_progress', 'awaiting_payment', 'completed'];

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}

export default function BookingCard({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);
  const statusStyle = { backgroundColor: statusColors[booking.status] || colors.textSecondary };
  const amount = Number(booking.amount ?? booking.service?.price ?? 0);
  const stepIndex = statusSteps.indexOf(booking.status);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['myBookings'] });

  const cancelMutation = useMutation({
    mutationFn: () => updateBookingStatus(booking.id, 'cancelled'),
    onSuccess: () => {
      invalidate();
      showAlert('Cancelled', 'Booking has been cancelled.');
    },
    onError: (error: any) => showAlert('Error', error.response?.data?.message || 'Cancel failed'),
  });

  const payMutation = useMutation({
    mutationFn: (payment: Parameters<typeof processMockPayment>[1]) => processMockPayment(booking.id, payment),
    onSuccess: (data) => {
      setShowPayment(false);
      invalidate();
      showAlert('Payment Successful', `Service completed. Transaction: ${data.mockTransactionId}`);
    },
    onError: (error: any) => showAlert('Error', error.response?.data?.message || 'Payment failed'),
  });

  const handleCancel = () => {
    showConfirm('Cancel Booking', 'Are you sure you want to cancel this booking?', () => {
      cancelMutation.mutate();
    });
  };

  const canPay = booking.status === 'awaiting_payment' && booking.paymentStatus !== 'paid';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.serviceName}>{booking.service?.name || 'Unknown Service'}</Text>
        <View style={[styles.badge, statusStyle]}>
          <Text style={styles.badgeText}>{formatStatus(booking.status)}</Text>
        </View>
      </View>

      <View style={styles.steps}>
        {statusSteps.map((step, i) => (
          <View
            key={step}
            style={[
              styles.stepDot,
              i <= stepIndex && stepIndex >= 0 ? styles.stepDotActive : null,
            ]}
          />
        ))}
      </View>

      <Text style={styles.date}>{new Date(booking.dateTime).toLocaleString()}</Text>
      <Text style={styles.price}>Amount: ${amount.toFixed(2)}</Text>
      {booking.provider?.name ? (
        <Text style={styles.provider}>Provider: {booking.provider.name}</Text>
      ) : (
        <Text style={styles.provider}>Provider: Waiting for assignment</Text>
      )}
      {booking.notes ? <Text style={styles.notes}>{booking.notes}</Text> : null}

      {booking.status === 'accepted' && (
        <Text style={styles.hint}>Provider accepted — service will start soon.</Text>
      )}
      {booking.status === 'in_progress' && (
        <Text style={styles.hint}>Service in progress. Pay once provider marks it complete.</Text>
      )}
      {canPay && (
        <Text style={styles.payHint}>Provider finished the job. Complete payment to close this booking.</Text>
      )}

      {canPay && (
        <TouchableOpacity style={styles.payBtn} onPress={() => setShowPayment(true)}>
          <Text style={styles.payText}>Pay & Complete Booking</Text>
        </TouchableOpacity>
      )}

      {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
        <View style={styles.receipt}>
          <Text style={styles.paidLabel}>Completed & Paid</Text>
          <Text style={styles.txn}>Txn: {booking.mockTransactionId}</Text>
          {booking.paidAt && (
            <Text style={styles.txn}>{new Date(booking.paidAt).toLocaleString()}</Text>
          )}
        </View>
      )}

      {booking.status === 'pending' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}

      <MockPaymentModal
        visible={showPayment}
        amount={amount}
        loading={payMutation.isPending}
        onClose={() => setShowPayment(false)}
        onPay={(payment) => payMutation.mutate(payment)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md,
    marginBottom: spacing.sm, elevation: 1, shadowOpacity: 0.05, shadowRadius: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  steps: { flexDirection: 'row', gap: 6, marginBottom: spacing.sm },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  stepDotActive: { backgroundColor: colors.primary },
  serviceName: { fontSize: fonts.size.md, fontWeight: '600', color: colors.text, flex: 1 },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: 'white', fontSize: fonts.size.xs, fontWeight: '600', textTransform: 'capitalize' },
  date: { fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: 4 },
  price: { fontSize: fonts.size.sm, color: colors.text, fontWeight: '600', marginTop: 4 },
  provider: { fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: 4 },
  notes: { fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  hint: { fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: spacing.sm, fontStyle: 'italic' },
  payHint: { fontSize: fonts.size.sm, color: '#8B5CF6', marginTop: spacing.sm, fontWeight: '600' },
  payBtn: { marginTop: spacing.sm, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  payText: { color: 'white', fontWeight: '700', fontSize: fonts.size.md },
  receipt: { marginTop: spacing.sm, padding: spacing.sm, backgroundColor: colors.success + '15', borderRadius: 8 },
  paidLabel: { fontSize: fonts.size.sm, color: colors.success, fontWeight: '700' },
  txn: { fontSize: fonts.size.xs, color: colors.textSecondary, marginTop: 2 },
  cancelBtn: { marginTop: spacing.sm, alignSelf: 'flex-start' },
  cancelText: { color: colors.error, fontWeight: '600', fontSize: fonts.size.sm },
});
