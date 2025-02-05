interface ThemeColors {
  primary: string;
  background: string;
  cardBackground: string;
  border: string;
  error: string;
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  shadow: string;
  progress: {
    background: string;
    fill: string;
  };
}

export const lightColors: ThemeColors = {
  primary: '#2196F3',          // 메인 파란색
  background: '#F5F5F5',       // 배경색
  cardBackground: '#FFFFFF',   // 카드 배경색
  text: {
    primary: '#333333',        // 주요 텍스트
    secondary: '#666666',      // 보조 텍스트
    inverse: '#FFFFFF',        // 반전 텍스트 (버튼 등)
  },
  border: '#E0E0E0',          // 테두리
  shadow: '#000000',          // 그림자
  progress: {
    background: '#E0E0E0',    // 프로그레스 바 배경
    fill: '#2196F3',          // 프로그레스 바 채우기
  },
  error: '#FF4444',          // 라이트모드 에러 색상
};

export const darkColors: ThemeColors = {
  primary: '#64B5F6',          // 밝은 파란색
  background: '#121212',       // 다크 모드 배경
  cardBackground: '#1E1E1E',   // 다크 모드 카드 배경
  text: {
    primary: '#FFFFFF',        // 주요 텍스트
    secondary: '#B0B0B0',      // 보조 텍스트
    inverse: '#FFFFFF',        // 반전 텍스트
  },
  border: '#333333',          // 테두리
  shadow: '#000000',          // 그림자
  progress: {
    background: '#333333',    // 프로그레스 바 배경
    fill: '#64B5F6',          // 프로그레스 바 채우기
  },
  error: '#FF6B6B',          // 다크모드 에러 색상
};

export const getThemeColors = (isDark: boolean): ThemeColors => {
  if (isDark) {
    return darkColors;
  }

  return lightColors;
}; 