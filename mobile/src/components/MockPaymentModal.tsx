import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { colors, spacing, fonts } from '../constants/theme';
import { MockPaymentInput } from '../types';

interface Props {
  visible: boolean;
  amount: number;
  loading?: boolean;
  onClose: () => void;
  onPay: (payment: MockPaymentInput) => void;
}

export default function MockPaymentModal({ visible, amount, loading, onClose, onPay }: Props) {
  const [cardNumber, setCardNumber] = useState('4242424242424242');
  const [cardHolder, setCardHolder] = useState('Test User');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  const handlePay = () => {
    onPay({ cardNumber, cardHolder, expiry, cvv });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Mock Payment</Text>
          <Text style={styles.subtitle}>Amount due: ${amount.toFixed(2)}</Text>
          <Text style={styles.hint}>Use test card 4242 4242 4242 4242 — no real charge.</Text>

          <TextInput style={styles.input} value={cardNumber} onChangeText={setCardNumber} placeholder="Card number" keyboardType="number-pad" />
          <TextInput style={styles.input} value={cardHolder} onChangeText={setCardHolder} placeholder="Card holder" />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.half]} value={expiry} onChangeText={setExpiry} placeholder="MM/YY" />
            <TextInput style={[styles.input, styles.half]} value={cvv} onChangeText={setCvv} placeholder="CVV" keyboardType="number-pad" secureTextEntry />
          </View>

          <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.payText}>Pay ${amount.toFixed(2)}</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg },
  title: { fontSize: fonts.size.xl, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: fonts.size.lg, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  hint: { fontSize: fonts.size.sm, color: colors.textSecondary, marginBottom: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md,
    marginBottom: spacing.sm, backgroundColor: colors.background, color: colors.text,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  payBtn: {
    backgroundColor: colors.primary, borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm,
  },
  payText: { color: 'white', fontSize: fonts.size.lg, fontWeight: '600' },
  cancelBtn: { alignItems: 'center', padding: spacing.md },
  cancelText: { color: colors.textSecondary },
});
