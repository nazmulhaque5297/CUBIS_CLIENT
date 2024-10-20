export const HouseKeepingModuleMenu = [
  {
    name: 'Code Setup',
    route: '/housekeeping',
    
    sub: [
      {
        name: 'Code Maintenance - System',
        route: '/route',
        sub: [
          {
            name: 'Profession Code Maintenance',
            route: '/housekeeping/profession-code-maintenance',
          },
          {
            name: 'Nationality Code Maintenance',
            route: '/housekeeping/nationality-code-maintenance',
          }
        ]
      },
      {
        name: 'Code Maintenance - CS - General',
        route: '/route',
        sub: [
          {
            name: 'Account Status Maintenance',
            route: '/housekeeping/account-status-maintenance',
          },
          {
            name: 'Transaction Type Maintenance',
            route: '/housekeeping/transaction-type-maintenance',
          },
          {
            name: 'Nature Code Maintenance',
            route: '/housekeeping/nature-code-maintenance',
          }
        ]
      },
      {
        name: 'Code Maintenance - CS - Loan',
        route: '/route',
        sub: [
          {
            name: 'Loan Security Code Maintenance',
            route: '/housekeeping/loan-security-code-maintenance',
          },
          {
            name: 'Loan Purpose Code Maintenance',
            route: '/housekeeping/loan-purpose-code-maintenance',
          }   
        ]
      }
    ]
  },
  {
    name: 'menu 2',
    route: '/route',
    icon: 'ti-home',
    sub: [
      {
        name: 'sun menu 1',
        route: '/route',
        sub: [
          {
            name: 'sun menu 1',
            route: '/route',
          }
        ]
      }
    ]
  },
]

export const AccountingModuleMenu = [
  {
    name: 'menu 1',
    route: '/route',
    sub: [
      {
        name: 'sun menu 1',
        route: '/route',
      }
    ]
  }
]

