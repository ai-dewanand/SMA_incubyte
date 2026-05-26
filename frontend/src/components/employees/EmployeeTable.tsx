export type EmployeeRecord = {
  id: string
  full_name: string
  email: string
  job_title: string
  department: string
  country: string
  salary: string
}

export function EmployeeTable({ employees }: { employees: EmployeeRecord[] }) {
  return (
    <section className="panel">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job title</th>
            <th>Department</th>
            <th>Country</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.email}</td>
              <td>{employee.job_title}</td>
              <td>{employee.department}</td>
              <td>{employee.country}</td>
              <td>{employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
