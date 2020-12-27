'use strict';

registerRouteData('ec-employee', [{
    stateName: 'employeeRecord.credentials',
    url: '/credentials',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'employeeRecord.emergency',
    url: '/emergency{action:.*}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'edit') || permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'employeeRecord',
    url: '/record/{employeeId:[0-9A-Za-z-]+}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'employeeRecord.employment',
    url: '/employment',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'edit') || permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'employeeRecord.medical',
    url: '/medical',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'edit') || permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'employeeRecord.personal',
    url: '/personal{action:.*}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'edit') || permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'employeeRecord.personnel',
    url: '/personnel',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'edit') || permissionSvc.isPermittedAction('employees', 'view');
    }
}, {
    stateName: 'index',
    url: '/',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('bundle', 'viewothers');
    }
}, {
    stateName: 'myProfile',
    url: '/my-profile',
    $permissions: function $permissions(permissionSvc) {
        return !permissionSvc.isPermittedAction('bundle', 'viewothers');
    }
}, {
    stateName: 'reports.assignments',
    url: '/assignments',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('assignmentReports', 'view');
    }
}, {
    stateName: 'reports.assignments.report',
    url: '/report'
}, {
    stateName: 'reports.assignments.settings',
    url: '/settings/:templateId',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('exportTemplates', 'view');
    }
}, {
    stateName: 'reports.credentials',
    url: '/credentials',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employeecredentials', 'viewreports');
    }
}, {
    stateName: 'reports.demographic',
    url: '/demographic',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('employees', 'viewreports');
    }
}, {
    stateName: 'reports.demographic.report',
    url: '/report'
}, {
    stateName: 'reports.demographic.settings',
    url: '/settings/:templateId',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('exportTemplates', 'view');
    }
}, {
    stateName: 'reports',
    url: '/reports'
}]);
