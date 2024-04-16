import avatarPersonnel from './assets/avatar-personnel.svg'

function buildOrganizationTree(data) {
  const managerMap = new Map()
  const employeeMap = new Map()

  // Build manager and employee maps
  data.organization.departments.forEach(department => {
    department.employees.forEach(employee => {
      const employeeTree = {
        person: {
          avatar: avatarPersonnel,
          department: employee.department,
          name: employee.name,
          title: employee.isManager ? 'Manager' : 'Employee',
          totalReports: 0,
          salary: employee.salary,
          office: employee.office,
          isManager: employee.isManager,
          skills: employee.skills,
        },
        hasChild: false,
        hasParent: true,
        children: [],
      }

      if (employee.isManager) {
        managerMap.set(employee.name, employeeTree)
      } else {
        employeeMap.set(employee.name, employeeTree)
      }
    })
  })

  // Build the organization tree
  const root = {
    person: {
      avatar: avatarPersonnel,
      department: '',
      name: 'Organization',
      title: 'Root',
      totalReports: managerMap.size,
      salary: null,
      office: null,
      isManager: true,
      skills: [],
    },
    hasChild: true,
    hasParent: false,
    children: [],
  }

  managerMap.forEach(managerTree => {
    root.children.push(managerTree)
  })

  employeeMap.forEach(employeeTree => {
    const managerName = employeeTree.person.department
    const managerTree = managerMap.get(managerName)
    if (managerTree) {
      managerTree.children.push(employeeTree)
      managerTree.hasChild = true
      managerTree.person.totalReports++
    }
  })

  return root
}

// Assuming you have the JSON data stored in a variable named `data`
const organizationTree = buildOrganizationTree(data)

export { organizationTree }
