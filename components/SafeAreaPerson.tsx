// components/ScreenWrapper.tsx
import { ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ← sin Provider

interface ScreenWrapperProps {
  children: React.ReactNode;
  paddingBottom?: number;
  contentStyle?: ViewStyle;
  scrollable?: boolean;
  className?: string;
}

export function ScreenWrapper({
  children,
  paddingBottom =0 ,
  contentStyle,
  scrollable = true,
  className = 'bg-slate-50',
}: ScreenWrapperProps) {
  return (
    <SafeAreaView edges={['top']} className={`flex-1 ${className}`}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom, ...contentStyle }}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}