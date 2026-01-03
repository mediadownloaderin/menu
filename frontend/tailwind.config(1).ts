// tailwind.config.js
module.exports = {
  // ... other configurations
  theme: {
    extend: {
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.3)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
    },
  },
  // ...
}