import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getServiceById } from '../services/serviceService';
import ServiceDetailContent from './ServiceDetailContent';
import { colors, fonts } from '../constants/theme';

type HomeStackParamList = {
  ServicesList: undefined;
  ServiceDetail: { serviceId: number };
};

type Props = NativeStackScreenProps<HomeStackParamList, 'ServiceDetail'>;

export default function ServiceDetailScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => getServiceById(serviceId),
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load service</Text>
      </View>
    );
  }

  return <ServiceDetailContent service={service} navigation={navigation} />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { color: colors.error, fontSize: fonts.size.md },
});
