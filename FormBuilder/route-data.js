'use strict';

registerRouteData('ec-forms', [{
    stateName: 'formBuilder.builder',
    url: '/builder?deactivate',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'create') || permissionSvc.isPermittedAction('formTemplates', 'edit');
    }
}, {
    stateName: 'formBuilder',
    url: '/form-builder/{formId:[0-9A-Za-z-]+}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'create') || permissionSvc.isPermittedAction('formTemplates', 'edit') || permissionSvc.isPermittedAction('formInstances', 'send');
    }
}, {
    stateName: 'formBuilder.overlayBuilder',
    url: '/overlay-builder',
    $permissions: function $permissions(permissionSvc) {
        return !!permissionSvc.permittedActions.activeUser.idmAdministrator || !!permissionSvc.permittedActions.formTemplates.buildOverlay;
    }
}, {
    stateName: 'formBuilder.preview',
    url: '/preview?returnTo&showPDFoverlay',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'view') || permissionSvc.isPermittedAction('formTemplates', 'edit' || permissionSvc.isPermittedAction('formTemplates', 'create'));
    }
}, {
    stateName: 'formBuilder.settings',
    url: '/settings',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'create') || permissionSvc.isPermittedAction('formTemplates', 'edit');
    }
}, {
    stateName: 'formInstance',
    url: '/form-instance/{formInstanceId:[0-9A-Za-z-]+}?from&returnUrl&target'
}, {
    stateName: 'formTemplates',
    url: '/form-templates',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'create') || permissionSvc.isPermittedAction('formTemplates', 'edit') || permissionSvc.isPermittedAction('formTemplates', 'send') || permissionSvc.isPermittedAction('formTemplates', 'archive') || permissionSvc.isPermittedAction('packets', 'create') || permissionSvc.isPermittedAction('packets', 'edit') || permissionSvc.isPermittedAction('packets', 'send') || permissionSvc.isPermittedAction('packets', 'archive');
    }
}, {
    stateName: 'formTracking',
    url: '/form-tracking',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formInstances', 'track');
    }
}, {
    stateName: 'formTracking.templateSummaryDetails',
    url: '/template-summary-details?{templateId:[0-9A-Za-z-]+}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formInstances', 'track');
    }
}, {
    stateName: 'formTracking.templateSummary',
    url: '/template-summary',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formInstances', 'track');
    }
}, {
    stateName: 'formTracking.viewBySubject',
    url: '/view-by-subject',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formInstances', 'track');
    }
}, {
    stateName: 'myFormsFormInstance',
    url: '/form-instance/{formInstanceId:[0-9A-Za-z-]+}?from&returnUrl'
}, {
    stateName: 'inbox',
    url: '/inbox?activeTab',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('activeUser', 'userKey');
    }
}, {
    stateName: 'index',
    url: '/',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'create') || permissionSvc.isPermittedAction('formTemplates', 'edit') || permissionSvc.isPermittedAction('formTemplates', 'send') || permissionSvc.isPermittedAction('formTemplates', 'archive') || permissionSvc.isPermittedAction('packets', 'create') || permissionSvc.isPermittedAction('packets', 'edit') || permissionSvc.isPermittedAction('packets', 'send') || permissionSvc.isPermittedAction('packets', 'archive');
    }
}, {
    stateName: 'my-forms',
    url: '/my-forms?activeTab',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('activeUser', 'userKey');
    }
}, {
    stateName: 'packetBuilder.Builder',
    url: '/builder',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('packets', 'create') || permissionSvc.isPermittedAction('packets', 'edit');
    }
}, {
    stateName: 'packetBuilder',
    url: '/packet-builder/{packetId:[0-9A-Za-z-]+}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('packets', 'create') || permissionSvc.isPermittedAction('packets', 'edit') || permissionSvc.isPermittedAction('packetInstances', 'send');
    }
}, {
    stateName: 'packetBuilder.Settings',
    url: '/packet-builder/settings',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('packets', 'create') || permissionSvc.isPermittedAction('packets', 'edit');
    }
}, {
    stateName: 'send',
    url: '/send/{type:[A-Za-z]+}/{id:[0-9A-Za-z-]+}',
    $permissions: function $permissions(permissionSvc) {
        return permissionSvc.isPermittedAction('formTemplates', 'send') || permissionSvc.isPermittedAction('packets', 'send');
    }
}]);
