import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createPalette' {
    interface TextSecondary {
        textSecondary: {
            primary: string;
            primaryDark: string;
            transparent: string;
        };
    }
  
    interface PaletteOptions {
        textSecondary?: {
            primary?: string;
            primaryDark?: string;
            transparent?: string;
        };
    }
}

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        textSecondary: any;
    }
  
    interface ThemeOptions {
        textSecondary?: any;
    }
}

const primaryColors = {
    primaryRed: '#ee5849',
    primaryGrey: '#473d3c',
    secondaryGrey: '#3f3f3f',
    lightGrey: '#faf9f9',
    lightRed: '#f59b93',
    darkRed: '#bb4439'
  };

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#f7b3ac',
            main: '#ee5849',
            dark: '#bb4439',
        },
        text: {
            primary: '#473d3c',
            secondary: '#3f3f3f',
            disabled: 'rgba(0, 0, 0, 0.40)',
        },
        action: {
            hover: '#bb4439'
        }
    },
    overrides: {
        MuiPaper: {
            root: {
                backgroundColor: '#fff'
            }
        },
        MuiAppBar: {
            root: {
                boxShadow: 'none',
            },
            colorDefault: {
                backgroundColor: 'transparent'
            }
        },
        MuiTypography: {
            h5: {
                fontWeight: 600,
                color: primaryColors.secondaryGrey
            },
        },
        MuiTabs: {
            root: {
                margin: '18px 0',
                boxShadow: 'inset 0 -1px 0 #c5c6c8',
                minHeight: '36px',
                position: 'relative',
            },
            fixed: {
                overflowX: 'auto'
            },
            scrollButtons: {
                flex: '0 0 40px'
            },
            indicator: {
                primary: {
                    backgroundColor: '#000'
                },
                secondary: {
                    backgroundColor: '#000'
                }
            }
        },
        MuiTab: {
            root: {
                color: 'rgba(0, 0, 0, 0.54)',
                minWidth: 50,
                textTransform: 'inherit',
                textDecoration: 'none',
                padding: '6px 16px',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '264',
                boxSizing: 'border-box',
                minHeight: 10 * 6,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                verticalAlign: 'middle',
                justifyContent: 'center',
                appearance: 'none',
                margin: 1,
                lineHeight: 1.3,
              
                '&$selected, &$selected:hover': {
                    color: primaryColors.secondaryGrey
                },
                '&:hover': {
                    color: '#000'
                }
            },
        },
        MuiTableCell: {
            root: {
                padding: '10px',
                borderBottom: `1px solid #f9f9fa`,
                '&:first-child': {
                },
                '&:last-child': {
                },
                '& .action-menu': {
                }
            },
            head: {
                fontWeight: 600,
            },
            body: {
                transition: 'color 225ms ease-in-out',
                '&:hover': {
                    color: '#000'
                },
                '&:focus': {
                    outline: '1px dotted #999'
                }
            }
        },
        MuiTableRow: {
            head: {
                backgroundColor: '#f9f9fa'
            },
            hover: {
              cursor: 'pointer',
              '& a': {
                    color: 'blue !important'
              },
              '& a.secondaryLink': {

                '&:hover': {

                }
              }
            },
          },
          MuiTableSortLabel: {
            root: {
                fontSize: '.9rem',
                lineHeight: '1.1rem',
                transition: 'color 225ms ease-in-out',
              '&:hover': {
                color: '#000'
              },
            }
        },
    }
});