import { useColorScheme } from 'react-native';
import { Colors } from './index';

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

export function useIsDark() {
  return useColorScheme() === 'dark';
}
