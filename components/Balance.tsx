import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface BalanceProps {
  className?: string;
}

export default function Balance({ className = "" }: BalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key exists:', !!supabaseKey);
      
      if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL" || 
          !supabaseKey || supabaseKey === "YOUR_SUPABASE_ANON_KEY") {
        setError('Database not configured');
        setLoading(false);
        return;
      }

      setDbConnected(true);
      loadUserBalance();
    } catch (error) {
      console.error('Database connection check failed:', error);
      setError('Database connection failed');
      setLoading(false);
    }
  };

  const loadUserBalance = async () => {
    if (!dbConnected) return;

    try {
      setLoading(true);
      setError(null);

      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('Auth error or no user:', authError);
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('User authenticated:', user.id);

      // Get account_id from accounts table
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (accountError || !accountData) {
        console.log('Account error:', accountError);
        setError('Account not found');
        setLoading(false);
        return;
      }

      console.log('Account found:', accountData.id);

      // Get user's upro_gold balance from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('upro_gold')
        .eq('account_id', accountData.id)
        .single();

      if (userError || !userData) {
        console.log('User data error:', userError);
        setError('User data not found');
        setLoading(false);
        return;
      }

      console.log('User balance loaded:', userData.upro_gold);
      setBalance(userData.upro_gold);
    } catch (error) {
      console.error('Error loading user balance:', error);
      setError('Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  // Always render something to ensure component is visible
  return (
    <View className={`flex-row items-center ${className}`}>
      <Ionicons name="cash-outline" size={20} color="#3b82f6" />
      {loading ? (
        <ActivityIndicator size="small" color="#3b82f6" className="ml-2" />
      ) : error ? (
        <Text className="text-red-500 font-medium ml-2">{error}</Text>
      ) : (
        <Text className="text-lg font-semibold text-gray-800 ml-2">
          ${balance?.toFixed(2) || '0.00'}
        </Text>
      )}
    </View>
  );
} 