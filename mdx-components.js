import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme

export function useMDXComponents(components) {
  return {
    ...getThemeComponents(),
    ...components
  }
}
