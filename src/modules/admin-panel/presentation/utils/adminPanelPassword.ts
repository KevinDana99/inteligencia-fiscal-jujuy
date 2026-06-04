export function getPasswordStrength(value: string) {
  const checks = [
    value.length >= 8,
    /[a-z]/.test(value),
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value)
  ]

  return checks.filter(Boolean).length
}

export function getPasswordStrengthColor(passwordStrength: number) {
  if (passwordStrength <= 1) {
    return 'red'
  }

  if (passwordStrength === 2) {
    return 'orange'
  }

  if (passwordStrength === 3) {
    return 'yellow'
  }

  if (passwordStrength === 4) {
    return 'green'
  }

  return 'teal'
}
