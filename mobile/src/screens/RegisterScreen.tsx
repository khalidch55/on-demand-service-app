import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing, fonts } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Name, email and password are required');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, phone, role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        <Ionicons name="flash-outline" size={80} color={colors.primary} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            placeholder="Phone (optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.roleRow}>
          {(['customer', 'provider'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleChip, role === r && styles.roleChipActive]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r === 'customer' ? 'Customer' : 'Provider'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  logo: { alignSelf: 'center', marginBottom: spacing.lg },
  title: { fontSize: fonts.size.xxl, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { fontSize: fonts.size.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, marginBottom: spacing.md, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border, height: 50,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: fonts.size.md, color: colors.text },
  button: {
    backgroundColor: colors.primary, borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  buttonText: { color: 'white', fontSize: fonts.size.lg, fontWeight: '600' },
  error: { color: colors.error, fontSize: fonts.size.sm, marginTop: spacing.sm, textAlign: 'center' },
  linkContainer: { marginTop: spacing.lg, alignItems: 'center' },
  link: { color: colors.primary, fontSize: fonts.size.sm },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  roleChip: {
    flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
    borderColor: colors.border, alignItems: 'center', backgroundColor: colors.surface,
  },
  roleChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  roleText: { color: colors.textSecondary, fontWeight: '600' },
  roleTextActive: { color: colors.primary },
});