'use client'

import { FormEvent, useMemo, useState } from 'react'

export type EmployeeFormData = {
  id?: string
  full_name: string
  email: string
  job_title: string
  department: string
  country: string
  salary: string
  currency: string
  employment_type: string
  hired_at: string
}

const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT']
const countryOptions = ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'India', 'Brazil', 'Singapore']

const defaultFormValues: EmployeeFormData = {
  full_name: '',
  email: '',
  job_title: '',
  department: '',
  country: 'United States',
  salary: '',
  currency: 'USD',
  employment_type: 'FULL_TIME',
  hired_at: new Date().toISOString().slice(0, 10),
}

type EmployeeFormProps = {
  initialData?: EmployeeFormData
  onSubmit: (payload: EmployeeFormData) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

export function EmployeeForm({ initialData, onSubmit, onCancel, submitLabel }: EmployeeFormProps) {
  const [formState, setFormState] = useState<EmployeeFormData>(initialData ?? defaultFormValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isAddMode = !initialData

  const validation = useMemo(() => {
    const result: Record<string, string> = {}

    if (!formState.full_name.trim()) result.full_name = 'Name is required.'
    if (!formState.email.trim()) result.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formState.email)) result.email = 'Email must be valid.'
    if (!formState.job_title.trim()) result.job_title = 'Job title is required.'
    if (!formState.department.trim()) result.department = 'Department is required.'
    if (!formState.country.trim()) result.country = 'Country is required.'
    if (!formState.salary.trim()) result.salary = 'Salary is required.'
    else if (Number(formState.salary) <= 0 || Number.isNaN(Number(formState.salary))) result.salary = 'Salary must be a positive number.'
    if (!formState.currency.trim() || !/^[A-Z]{3}$/.test(formState.currency)) result.currency = 'Currency must be a 3-letter code.'
    if (!formState.employment_type.trim()) result.employment_type = 'Employment type is required.'
    if (!formState.hired_at.trim()) result.hired_at = 'Hire date is required.'

    return result
  }, [formState])

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validation

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitError(null)
      return
    }

    setErrors({})
    setSubmitError(null)
    setSubmitting(true)
    try {
      await onSubmit(formState)
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Failed to save employee. Please try again.'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel form-panel">
      <div className="form-header">
        <h2>{isAddMode ? 'Add Employee' : 'Edit Employee'}</h2>
        <p>{isAddMode ? 'Create a new employee record.' : 'Update employee details.'}</p>
      </div>

      {submitError ? (
        <div className="form-error">
          <p>{submitError}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Name
            <input
              type="text"
              value={formState.full_name}
              onChange={(event) => handleChange('full_name', event.target.value)}
            />
            {errors.full_name ? <span className="field-error">{errors.full_name}</span> : null}
          </label>

          <label>
            Email
            <input
              type="email"
              value={formState.email}
              onChange={(event) => handleChange('email', event.target.value)}
            />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </label>

          <label>
            Job title
            <input
              type="text"
              value={formState.job_title}
              onChange={(event) => handleChange('job_title', event.target.value)}
            />
            {errors.job_title ? <span className="field-error">{errors.job_title}</span> : null}
          </label>

          <label>
            Department
            <input
              type="text"
              value={formState.department}
              onChange={(event) => handleChange('department', event.target.value)}
            />
            {errors.department ? <span className="field-error">{errors.department}</span> : null}
          </label>

          <label>
            Country
            <select value={formState.country} onChange={(event) => handleChange('country', event.target.value)}>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country ? <span className="field-error">{errors.country}</span> : null}
          </label>

          <label>
            Salary
            <input
              type="number"
              step="0.01"
              value={formState.salary}
              onChange={(event) => handleChange('salary', event.target.value)}
            />
            {errors.salary ? <span className="field-error">{errors.salary}</span> : null}
          </label>

          <label>
            Currency
            <input
              type="text"
              maxLength={3}
              value={formState.currency}
              onChange={(event) => handleChange('currency', event.target.value.toUpperCase())}
            />
            {errors.currency ? <span className="field-error">{errors.currency}</span> : null}
          </label>

          <label>
            Employment type
            <select value={formState.employment_type} onChange={(event) => handleChange('employment_type', event.target.value)}>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.employment_type ? <span className="field-error">{errors.employment_type}</span> : null}
          </label>

          <label>
            Hire date
            <input
              type="date"
              value={formState.hired_at}
              onChange={(event) => handleChange('hired_at', event.target.value)}
            />
            {errors.hired_at ? <span className="field-error">{errors.hired_at}</span> : null}
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? `${submitLabel}…` : submitLabel}
          </button>
        </div>

      </form>
    </section>
  )
}
