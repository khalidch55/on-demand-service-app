import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { updateProfile } from '../services/userService';
import apiClient from '../api/client';
import { User } from '../types';
import { colors, spacing, fonts } from '../constants/theme';
import { showAlert, showConfirm } from '../utils/alert';

const fetchProfile = async (): Promise<User> => {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
};

export default function ProfileScreen() {
  const { logout, refreshProfile } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? '');
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: () => updateProfile({ name, phone }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await refreshProfile();
      setEditing(false);
      showAlert('Success', 'Profile updated');
    },
    onError: (error: any) => showAlert('Error', error.response?.data?.message || 'Update failed'),
  });

  const handleLogout = () => {
    showConfirm('Logout', 'Are you sure you want to logout?', () => {
      void logout();
    }, {
      confirmText: 'Logout',
      cancelText: 'Cancel',
    });
  };

  if (isLoading || !user) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
      </View>

      {editing ? (
        <>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" />
          <TouchableOpacity style={styles.saveBtn} onPress={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Text style={styles.saveBtnText}>{saveMutation.isPending ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditing(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone ? <Text style={styles.detail}>{user.phone}</Text> : null}
          <Text style={styles.role}>{user.role}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.xl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  avatar: { marginBottom: spacing.md },
  name: { fontSize: fonts.size.xl, fontWeight: '700', color: colors.text, marginBottom: 4 },
  email: { fontSize: fonts.size.md, color: colors.textSecondary, marginBottom: 4 },
  detail: { fontSize: fonts.size.md, color: colors.textSecondary, marginBottom: 4 },
  role: { fontSize: fonts.size.sm, color: colors.primary, textTransform: 'capitalize', marginTop: 4 },
  input: {
    width: '100%', borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    padding: 12, marginBottom: spacing.sm, backgroundColor: colors.surface, color: colors.text,
  },
  editBtn: { marginTop: 20, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: colors.primary },
  editBtnText: { color: colors.primary, fontSize: fonts.size.md, fontWeight: '600' },
  saveBtn: { marginTop: 8, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: '600' },
  cancelText: { color: colors.textSecondary, marginTop: 12 },
  logoutButton: { marginTop: 32, backgroundColor: colors.error, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 40 },
  logoutText: { color: 'white', fontSize: fonts.size.lg, fontWeight: '600' },
});
