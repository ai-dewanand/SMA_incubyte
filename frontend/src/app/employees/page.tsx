import { EmployeeTable } from '../../components/employees/EmployeeTable'

const sampleEmployees = [
  {
    id: '1',
    full_name: 'Ava Hernandez',
    email: 'ava.hernandez@example.com',
    job_title: 'Software Engineer',
    department: 'Engineering',
    country: 'United States',
    salary: '$125,000',
  },
  {
    id: '2',
    full_name: 'Noah Patel',
    email: 'noah.patel@example.com',
    job_title: 'Product Manager',
    department: 'Product',
    country: 'Canada',
    salary: '$132,500',
  },
  {
    id: '3',
    full_name: 'Zoe Kim',
    email: 'zoe.kim@example.com',
    job_title: 'Data Scientist',
    department: 'Data',
    country: 'United Kingdom',
    salary: '$118,000',
  },
]

export default function EmployeesPage() {
  return (
    <main>
      <section className="page-header">
        <h1>Employee Directory</h1>
        <p>Browse active team members and key salary details.</p>
      </section>

      <EmployeeTable employees={sampleEmployees} />
    </main>
  )
}
