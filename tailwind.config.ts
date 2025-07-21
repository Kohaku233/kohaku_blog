import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography'
const config: Config = {
  plugins: [typography],
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			grid: 'grid 15s linear infinite'
  		},
  		keyframes: {
  			grid: {
  				'0%': {
  					transform: 'translateY(-50%)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					// 基础排版
  					'max-width': 'none',
  					'line-height': '1.75',
  					'color': 'hsl(var(--foreground))',
  					
  					// 标题样式
  					'h1, h2, h3, h4, h5, h6': {
  						'color': 'hsl(var(--foreground))',
  						'font-weight': '700',
  						'margin-top': '2rem',
  						'margin-bottom': '1rem',
  						'line-height': '1.25',
  					},
  					'h1': {
  						'font-size': '2.5rem',
  						'margin-top': '0',
  						'margin-bottom': '2rem',
  					},
  					'h2': {
  						'font-size': '2rem',
  						'margin-top': '3rem',
  						'border-bottom': '1px solid hsl(var(--border))',
  						'padding-bottom': '0.5rem',
  					},
  					'h3': {
  						'font-size': '1.5rem',
  						'margin-top': '2.5rem',
  					},
  					'h4': {
  						'font-size': '1.25rem',
  					},
  					
  					// 段落样式
  					'p': {
  						'margin-top': '1.25rem',
  						'margin-bottom': '1.25rem',
  						'line-height': '1.75',
  					},
  					
  					// 列表样式
  					'ul, ol': {
  						'margin-top': '1.25rem',
  						'margin-bottom': '1.25rem',
  						'padding-left': '1.5rem',
  					},
  					'li': {
  						'margin-top': '0.5rem',
  						'margin-bottom': '0.5rem',
  					},
  					'li > ul, li > ol': {
  						'margin-top': '0.5rem',
  						'margin-bottom': '0.5rem',
  					},
  					
  					// 链接样式
  					'a': {
  						'color': 'hsl(221 83% 53%)',
  						'text-decoration': 'underline',
  						'font-weight': '500',
  						'&:hover': {
  							'color': 'hsl(221 83% 45%)',
  						},
  					},
  					
  					// 引用块样式
  					'blockquote': {
  						'font-style': 'italic',
  						'border-left': '4px solid hsl(var(--border))',
  						'padding-left': '1.5rem',
  						'margin': '2rem 0',
  						'background': 'hsl(var(--muted))',
  						'padding': '1.5rem',
  						'border-radius': '0.5rem',
  					},
  					
  					// 代码样式
  					'code': {
  						'background': 'hsl(var(--muted))',
  						'padding': '0.25rem 0.375rem',
  						'border-radius': '0.25rem',
  						'font-size': '0.875em',
  						'font-weight': '500',
  						'color': 'hsl(var(--foreground))',
  					},
  					'pre': {
  						'background': 'hsl(220 13% 18%)',
  						'color': 'hsl(220 14% 71%)',
  						'overflow-x': 'auto',
  						'border-radius': '0.5rem',
  						'padding': '1.5rem',
  						'margin': '2rem 0',
  						'line-height': '1.7',
  					},
  					'pre code': {
  						'background': 'transparent !important',
  						'padding': '0',
  						'border-radius': '0',
  						'color': 'inherit',
  					},
  					
  					// 表格样式
  					'table': {
  						'width': '100%',
  						'border-collapse': 'collapse',
  						'margin': '2rem 0',
  						'font-size': '0.9rem',
  					},
  					'th, td': {
  						'border': '1px solid hsl(var(--border))',
  						'padding': '0.75rem 1rem',
  						'text-align': 'left',
  					},
  					'th': {
  						'background': 'hsl(var(--muted))',
  						'font-weight': '600',
  					},
  					'tbody tr:nth-child(even)': {
  						'background': 'hsl(var(--muted) / 0.3)',
  					},
  					
  					// 分隔线
  					'hr': {
  						'border': 'none',
  						'border-top': '1px solid hsl(var(--border))',
  						'margin': '3rem 0',
  					},
  					
  					// 图片样式
  					'img': {
  						'border-radius': '0.5rem',
  						'box-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  						'margin': '2rem auto',
  					},
  				},
  			},
  			lg: {
  				css: {
  					'font-size': '1.125rem',
  					'line-height': '1.8',
  					'h1': {
  						'font-size': '3rem',
  					},
  					'h2': {
  						'font-size': '2.25rem',
  					},
  					'h3': {
  						'font-size': '1.75rem',
  					},
  					'h4': {
  						'font-size': '1.375rem',
  					},
  				},
  			},
  		},
  	}
  },
};

export default config;
