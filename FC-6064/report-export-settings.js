import { Component } from 'base-component';
// #------------------------------------------------# //
// #---- Component (cmp-report-export-settings) ----# //

// props is the directive's isolate scope object
// http://onehungrymind.com/angularjs-sticky-notes-pt-2-isolated-scope
const props = {
	templateId: '=',
	type: '=',
	reportRoute: '@',
};

class ReportExportSettings extends Component {
	/*@ngInject*/
	controller($rootScope, $scope, $state, $location, ssModalSvc, ssValidationHlp, ssToastHlp, exportTemplateApi) {
		const regex = /^[\w\- ]+$/gi; // allow alphanumeric/underscores (\w), dashes (\-), spaces ( )
		const routeVm = $scope.routeVm = $scope.$root.utils.findInParentScope('routeVm', $scope);

		const templates = $rootScope.vm.exportTemplates;

		const customerSupport = {
			subject: 'Request for Nightly Exports',
			description: 'I would like to receive nightly exports of my district\'s data from Frontline Central',
		};

		let moveTarget = null;

		$scope.validator = {
			name: ssValidationHlp.string({ required: true, maxLength: 100, re: regex }),
			description: ssValidationHlp.string({ required: false, maxLength: 250, re: regex }),
			alias: ssValidationHlp.string({ maxLength: 100, re: regex }),
			selected: () => {
				return vm.template.exportFields.some(f => f.visible) ? true : 'Your export does not contain any records. Select at least one field to be able to save the template.';
			},
		};

		// filter to remove selected values from data rule dropdown
		$scope.filterSelectedDataRule = function(selectedDataRule) {
			return function(datarule) {
				return !selectedDataRule.includes(datarule);
			}
		}

		// get class name for +Add Data Rule
		$scope.getAddDataRuleClass = (selectedDataRulesLength, filterTypeLength) => {
			if (selectedDataRulesLength === filterTypeLength) {
				return 'data-rule-disabled';
			}
			return 'data-rule-add';
			
		}

		// view model for tracking state
		const vm = $scope.vm = {
			templateData: templates,

			isNew: $scope.templateId === 'create',

			canCreateTemplates: $rootScope.isPermitted.exportTemplates.create,

			csSupportUrl: `https://central-help.frontlineeducation.com/hc/en-us/requests/new?subject=${customerSupport.subject}&description=${customerSupport.description}`,

			editMode: false,

			loading: true,

			tempDisableDragAndDrop: true, // a temporary variable to disable the drag and drop until the performance issues can be looked into

			options: {
				delimiters: [
					{ name: 'Tab', value: '\t' },
					{ name: 'Slash [ / ]', value: '/' },
					{ name: 'Pipe [ | ]', value: '|' },
					{ name: 'Comma [ , ]', value: ',' },
					{ name: 'Semicolon [ ; ]', value: ';' },
				],
				exportSettings: [
					{ name: 'All current records', value: 'all' },
					{ name: 'Only new/edited records in the past 24 hours', value: 'delta' }
				],
			},
			// Key/Value for Fields Filters
			fieldFormat: {
				ValueMappingFilter: 'Value Mapping',
				PadWithCharacterFilter: 'Minimum Length, Pad Character',
				ReplaceValueWhenEmptyFilter: 'Blank Value',
				SsnFormatFilter: 'Field Format',
				DateFormatFilter: 'Field Format',
				PhoneFormatFilter: 'Field Format',
				StateFormatFilter: 'Field Format',
				BooleanFormatFilter: 'Field Format'
			},

		};

		if (routeVm.featureFlags.fc_new_record_export_option) {
			vm.options.exportSettings.push({ name: 'Only new records in the past 24 hours', value: 'new' });
		}

		load();


		// behavior that needs to be bound to the view
		const go = $scope.go = {
			// for showing On/Off based on the bool value of nightlyExport
			isNightlyExportEnabled(nightlyExportValue) {
				return nightlyExportValue ? "On" : "Off";
			},
			// for getting the tooltip text based on Nightly export
			getNightlyExportTooltip(nightlyExportValue) {
				return nightlyExportValue ? "Nightly export is enabled" : "Nightly export is disabled";
			},
			// for toggling Nightly export through Radio button
			toggleNightlyExports(checked) {
				vm.template.isNightlyExportEnabled = checked;
			},
			// for selecting the template and re-routing on the specific template setting
			setSelectedTemplate(templateId) {
				vm.isNew = false;
				vm.template = vm.templateData.filter(data => data.id === templateId)[0];
				if (vm.template) {
					// fill the template fields with the system fields' names
					try {
						vm.template.exportFields.forEach(f => f.systemName = $scope.type.systemFields.find(sf => sf.id === f.systemFieldId).name);
					} catch (err) { }
				} else {
					vm.isNew = true;
				}
				vm.selectAll = vm.template.exportFields.filter(f => f.visible).length === vm.template.exportFields.length;
			},
			/**
			 * Cancel edits and reroute to the export template page
			 */
			cancel() {
				vm.isNew = true;
				vm.editMode = false;
			},
			// For cancelling the edit of template
			cancelEdit() {
				if (vm.newTemplate) {
					vm.isNew = true;
				}
				vm.editMode = false;
			},
			/**
			 * Edit template
			 */
			edit(isNew) {
				vm.editMode = true;
				vm.isNew = false;
				if (isNew) {
					vm.newTemplate = true;
					load(true);
				} else {
					vm.newTemplate = false;
				}
			},
			/**
			 * Remove template
			 */
			remove() {
				const modalConfig = {
					title: '',
					content: `Are you sure you want to delete export template ${vm.template.name}?`,
					primaryText: 'Delete',
					secondaryText: 'Cancel',
					size: 'medium'
				};
				ssModalSvc.showDestructive(modalConfig).then(() => {
					exportTemplateApi.deleteTemplate(vm.template.id).then(() => {
						ssToastHlp.success('Your template has been removed and will no longer be used in the nightly exports.', 'Template Removed Successfully');
						// redirecting to default grid view
						$state.go($state.current, { templateId: "create" }, { reload: true });
					});
				});
			},

			/**
			 * Save template
			 */
			save() {
				vm.saving = true;

				exportTemplateApi.saveTemplate(processTemplateData(vm.template)).then(res => {
					if (res == null) { vm.saving = false; return; }
					ssToastHlp.success('Your changes will be applied to the next nightly export.', 'Template Saved Successfully');
					$state.reload();
				});
			},

			/**
			 * Field moved
			 */
			movedField(index, field) {
				vm.template.exportFields[moveTarget] = field;
				vm.template.exportFields.splice(index, 1);
			},

			/**
			 * Field was dropped
			 */
			dropField(event, index, item) {
				moveTarget = index;
				return {};
			},

			/**
			 * Get the selected export setting or 'all'
			 */
			getSelectExportSetting(val) {
				return vm.options.exportSettings.find(s => s.value === val).name;
			},

			getSelectedText() {
				if (vm.template == null || vm.template.exportFields == null || vm.template.exportFields.length === 0) { return 'none'; }
				let count = vm.template.exportFields.filter(f => f.visible).length;
				if (count === 0) {
					vm.selectAll = false;
					return 'none';
				} else if (count === vm.template.exportFields.length) {
					vm.selectAll = true;
					return 'all';
				}
				vm.selectAll = true;
				return 'some';
			},

			selectAll() {
				const isAll = go.getSelectedText() === 'all';
				vm.template.exportFields.forEach(f => f.visible = !isAll);
				vm.selectAll = !isAll;
			},

			moveUp(field, currentIndex) {
				vm.template.exportFields.splice(currentIndex, 1);
				vm.template.exportFields.splice(currentIndex - 1, 0, field);
			},

			moveDown(field, currentIndex) {
				vm.template.exportFields.splice(currentIndex, 1);
				vm.template.exportFields.splice(currentIndex + 1, 0, field);
			},
			// Removing Data Rule from system field
			deleteDataRule(field, dataRule) {
				const removeItemIndex = field.selectedDataRules.indexOf(dataRule);
				field.selectedDataRules.splice(removeItemIndex,1);
			},
			// Adding Data Rule to system feild
			addDataRule(field) {
				if (field.selectedOption) {
					field.selectedDataRules.push(field.selectedOption)
					field.selectedOption = "";
					field.isDataRuleVisible = false;
				}
			}
		};

		function processTemplateData(templateData) {
			  const exportFields = templateData.exportFields.map(field => {
				const tempExportValueFilters = [];
				if (field.selectedDataRules.length) { 
					 field.selectedDataRules.forEach(rule => {
						 tempExportValueFilters.push({ type: rule })
					});
				}

				if (tempExportValueFilters.length) {
					field.exportValueFilters = tempExportValueFilters;
				}
				return field;
			});

			templateData.exportFields = exportFields;
			return templateData;
		}

		/**
		 *
		 */
		function load(isCreateNewTemplate) {
			vm.loading = false;
			if (vm.isNew || isCreateNewTemplate) {
				vm.selectAll = true;
				vm.template = {
					name: '',
					description: '',
					isNightlyExportEnabled: false,
					delimiter: ',',
					exportSetting: 'all',
					includeColumnHeaders: true,
					exportFields: formatExportFields($scope.type.systemFields),
					exportTypeId: $scope.type.id,
				};
				if (routeVm.featureFlags.fc_oct_2020_phone_email_type_restriction) {
					vm.template.exportFields = vm.template.exportFields.filter(f => !f.deprecated);
				}
			}
		}

		function formatExportFields(exportFields) {
			return exportFields.map(field => {
				return {
					systemFieldId: field.id,
					systemName: field.name,
					visible: true,
					alias: null,
					deprecated: field.deprecated,
					filterType: field.filterType,
					selectedDataRules: [],
					selectedOption: '',
					isDataRuleVisible: false,
				}
			})
		}
	}
}

// #-- END Component (cmp-report-export-settings) --# //
// #------------------------------------------------# //

angular.module('ec-employee-components').directive('cmpReportExportSettings', () => new ReportExportSettings(props, 'report-export-settings'));
// TODO: check if below workaround can be replaced by introducing onChange in [super-select-list] without breaking its existing functionality
// Workaround for capturing onchange event of dropdown(data rule) as by default [super-select-list] does not support omchange event
angular.module('ec-employee-components').directive('onModelChange', function ($parse) {
	return {
		restrict: "A",
		require: "?ngModel",
		link: function (scope, elem, attrs, ctrl) {
			scope.$watch(attrs['ngModel'], function (newValue, oldValue) {
				if (typeof (newValue) === "undefined" || newValue == oldValue) {
					return;
				}
				var changeExpr = $parse(attrs['onModelChange']);
				if (changeExpr) {
					changeExpr(scope);
				}
			});
		}
	};
});