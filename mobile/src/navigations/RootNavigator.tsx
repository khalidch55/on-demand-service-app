import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import ProviderNavigator from './ProviderNavigator';

export default function RootNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  if (!user) return <AuthNavigator />;
  if (user.role === 'provider') return <ProviderNavigator />;
  return <AppNavigator />;
}