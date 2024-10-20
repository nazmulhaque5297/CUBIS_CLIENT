export enum Path {
  // General containers
  Home = '',
  NotFound = '404',

  // Auth
  SignIn = 'sign-in',
  ForgotPassword = 'forgot-password',
  ForgotPasswordEmailSent = 'forgot-password-email-sent',
  PasswordReset = 'password-reset',
  PasswordResetFailed = 'password-reset-failed',
  PasswordResetSucceeded = 'password-reset-succeeded',
  ChangePassword = 'change-password',

  // App base url
  Dashboard = 'dashboard',

  // Settings
  Settings = 'settings',

  // Modules
  HouseKeeping = 'housekeeping',
  Accounting = 'accounting',
  Booth = 'booth',



  // User
  Users = 'users',
  UsersOverview = 'overview',
  UsersProfile = ':username',
}
