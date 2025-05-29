// Monochrome theme configuration for CodeGame.ai mobile app
export const theme = {
    colors: {
        // Primary colors
        black: '#000000',
        white: '#FFFFFF',

        // Grayscale palette
        gray900: '#111111',
        gray800: '#1a1a1a',
        gray700: '#2d2d2d',
        gray600: '#404040',
        gray500: '#525252',
        gray400: '#737373',
        gray300: '#a3a3a3',
        gray200: '#d4d4d4',
        gray100: '#e5e5e5',
        gray50: '#f5f5f5',

        // Semantic colors using grayscale
        background: '#FFFFFF',
        surface: '#F5F5F5',
        primary: '#000000',
        secondary: '#525252',
        accent: '#1a1a1a',

        // Text colors
        textPrimary: '#000000',
        textSecondary: '#525252',
        textDisabled: '#a3a3a3',
        textInverse: '#FFFFFF',

        // Border colors
        border: '#e5e5e5',
        borderDark: '#d4d4d4',

        // Status colors (using grayscale variations)
        success: '#2d2d2d',
        warning: '#525252',
        error: '#1a1a1a',
        info: '#737373',

        // Interactive states
        pressed: '#e5e5e5',
        hover: '#f5f5f5',
        focus: '#d4d4d4',
        disabled: '#a3a3a3',

        // QR Scanner specific
        scannerOverlay: 'rgba(0, 0, 0, 0.6)',
        scannerFrame: '#FFFFFF',

        // Puzzle specific
        puzzlePiece: '#f5f5f5',
        puzzleBorder: '#000000',
        puzzleSolved: '#2d2d2d',
    },

    typography: {
        fontFamily: {
            regular: 'System',
            bold: 'System-Bold',
            light: 'System-Light',
        },
        fontSize: {
            xs: 12,
            sm: 14,
            base: 16,
            lg: 18,
            xl: 20,
            '2xl': 24,
            '3xl': 30,
            '4xl': 36,
        },
        fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            loose: 1.8,
        },
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
    },

    borderRadius: {
        none: 0,
        sm: 4,
        base: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },

    shadows: {
        sm: {
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
        },
    },

    opacity: {
        disabled: 0.4,
        pressed: 0.7,
        overlay: 0.8,
    },
};

// Utility functions for theme usage
export const getTextColor = (variant = 'primary') => {
    switch (variant) {
        case 'primary':
            return theme.colors.textPrimary;
        case 'secondary':
            return theme.colors.textSecondary;
        case 'disabled':
            return theme.colors.textDisabled;
        case 'inverse':
            return theme.colors.textInverse;
        default:
            return theme.colors.textPrimary;
    }
};

export const getBackgroundColor = (variant = 'background') => {
    switch (variant) {
        case 'background':
            return theme.colors.background;
        case 'surface':
            return theme.colors.surface;
        case 'primary':
            return theme.colors.primary;
        case 'secondary':
            return theme.colors.secondary;
        default:
            return theme.colors.background;
    }
};

export const getShadow = (size = 'md') => {
    return theme.shadows[size] || theme.shadows.md;
};

export default theme; 