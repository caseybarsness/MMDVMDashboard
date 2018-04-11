var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../coalesce.dependencies.d.ts" />
// Coalesce.Utilities
// Turn off AJAX Caching
$.ajaxSetup({ cache: false });
var Coalesce;
(function (Coalesce) {
    // Create a sub namespace.
    var Utilities;
    (function (Utilities) {
        var busyOverlayTimeout = 0;
        var busyDepth = 0;
        var _isBusyEnabled = true;
        function getClassName(object) {
            if (typeof object !== 'object')
                return null;
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(object.constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        }
        Utilities.getClassName = getClassName;
        ;
        // Turn on or off the busy indicator as a whole
        function isBusyEnabled(value) {
            if (!value) {
                clearTimeout(busyOverlayTimeout);
                busyOverlayTimeout = 0;
                $('#busy-overlay').fadeOut(100);
            }
            _isBusyEnabled = value;
        }
        Utilities.isBusyEnabled = isBusyEnabled;
        ;
        function hideBusy() {
            if (_isBusyEnabled) {
                busyDepth--;
                if (busyDepth === 0) {
                    clearTimeout(busyOverlayTimeout);
                    busyOverlayTimeout = 0;
                    $('#busy-overlay').fadeOut(100);
                }
            }
        }
        Utilities.hideBusy = hideBusy;
        ;
        function showBusy() {
            // Wait for 200 MS before showing the busy indicator.
            if (_isBusyEnabled) {
                busyDepth++;
                if (busyOverlayTimeout === 0) {
                    busyOverlayTimeout = setTimeout(showBusyNow, 200);
                }
            }
        }
        Utilities.showBusy = showBusy;
        ;
        function showBusyNow() {
            $('#busy-overlay').fadeIn(100);
            //clearTimeout(busyOverlayFailureTimeout);
            //busyOverlayFailureTimeout = setTimeout(busyFailed, busyOverlayFailureTimeoutInSeconds * 1000);
        }
        // Load a Web API JSON object as a script. This returns the object that the URL returns.
        // It runs synchronously.
        function loadAsScript(url) {
            var result;
            $.ajax(url, {
                type: "GET",
                async: false
            }).done(function (data) {
                result = data;
            });
            return result;
        }
        Utilities.loadAsScript = loadAsScript;
        ;
        // Get a URL parameter by name.
        function GetUrlParameter(sParam) {
            var sPageUrl = window.location.search.substring(1);
            var sUrlVariables = sPageUrl.split('&');
            for (var i = 0; i < sUrlVariables.length; i++) {
                var sParameterName = sUrlVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return decodeURIComponent(sParameterName[1]);
                }
            }
            if (sParam === "id" || sParam === "Id" || sParam === "ID") {
                // The id was used as the last part of the actual URL.
                var paths = window.location.pathname.split('/');
                var lastPath = paths[paths.length - 1];
                if ($.isNumeric(lastPath)) {
                    return decodeURIComponent(lastPath);
                }
            }
            return null;
        }
        Utilities.GetUrlParameter = GetUrlParameter;
        function SetUrlParameter(url, paramName, paramValue) {
            paramValue = encodeURIComponent(paramValue);
            var hash = location.hash;
            url = url.replace(hash, '');
            if (url.indexOf(paramName + "=") >= 0) {
                var prefix = url.substring(0, url.indexOf(paramName));
                var suffix = url.substring(url.indexOf(paramName));
                suffix = suffix.substring(suffix.indexOf("=") + 1);
                suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
                url = prefix + paramName + "=" + paramValue + suffix;
            }
            else {
                if (url.indexOf("?") < 0)
                    url += "?" + paramName + "=" + paramValue;
                else
                    url += "&" + paramName + "=" + paramValue;
            }
            return url + hash;
        }
        Utilities.SetUrlParameter = SetUrlParameter;
        function capitalizeFirstLetter(string) {
            if (string)
                return string.charAt(0).toUpperCase() + string.slice(1);
            else
                return string;
        }
        Utilities.capitalizeFirstLetter = capitalizeFirstLetter;
        function lowerFirstLetter(string) {
            if (string)
                return string.charAt(0).toLowerCase() + string.slice(1);
            else
                return string;
        }
        Utilities.lowerFirstLetter = lowerFirstLetter;
        function warning(question, callback, myThis) {
            return function () {
                if (confirm(question)) {
                    callback.bind(myThis || this)();
                }
            };
        }
        Utilities.warning = warning;
        // Saves the values of inputs into the DOM element.
        // This is used to serialize the DOM for storage with the values.
        function saveValuesInDom() {
            $('input:text').each(function (i, item) {
                $(item).attr('value', $(item).val());
            });
            $('textarea').each(function (i, item) {
                $(item).html($(item).val());
            });
            $('input:checkbox').each(function (i, item) {
                if (item.checked) {
                    $(item).attr('checked', 'checked');
                }
                else {
                    $(item).removeAttr('checked');
                }
            });
        }
        Utilities.saveValuesInDom = saveValuesInDom;
    })(Utilities = Coalesce.Utilities || (Coalesce.Utilities = {}));
    var ModalHelpers;
    (function (ModalHelpers) {
        function setupPlainModal(content) {
            content = '\
                <div id="modal-dialog" class="modal fade">\
                  <div class="modal-dialog">\
                    <div class="modal-content">' +
                content + '\
                    </div><!-- /.modal-content -->\
                  </div><!-- /.modal-dialog -->\
                </div><!-- /.modal -->\
            ';
            // Remove the old one.
            $('#modal-dialog').remove();
            // Add this to the DOM
            $('body').append(content);
        }
        ModalHelpers.setupPlainModal = setupPlainModal;
        function setupModal(title, content, hideSave, hideClose) {
            content = '\
                <div class="modal-header">\
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                  <h3 class="modal-title">' +
                title + '\
                  </h3>\
                </div>\
                <div class="modal-body">' +
                content + '\
                </div>\
                <div class="modal-footer">' +
                (hideClose ? '' : '\
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                    ') +
                (hideSave ? '' : '\
                  <button type="button" class="btn btn-primary">Save</button>\
                    ') + '\
                </div>\
            ';
            setupPlainModal(content);
        }
        ModalHelpers.setupModal = setupModal;
    })(ModalHelpers = Coalesce.ModalHelpers || (Coalesce.ModalHelpers = {}));
})(Coalesce || (Coalesce = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
var EnumValue = (function () {
    function EnumValue() {
    }
    return EnumValue;
}());
var Coalesce;
(function (Coalesce) {
    ;
    var CoalesceConfiguration = (function () {
        function CoalesceConfiguration(parentConfig) {
            var _this = this;
            this.prop = function (name) {
                var _this = this;
                var k = "_" + name;
                var raw = this[k] = ko.observable(null);
                var computed;
                computed = ko.computed({
                    deferEvaluation: true,
                    read: function () {
                        var rawValue = raw();
                        if (rawValue !== null)
                            return rawValue;
                        if (_this.parentConfig && _this.parentConfig[name]) {
                            return _this.parentConfig[name]();
                        }
                        return null;
                    },
                    write: raw
                });
                computed.raw = raw;
                return computed;
            };
            /** The relative url where the API may be found. */
            this.baseApiUrl = this.prop("baseApiUrl");
            /** The relative url where the generated views may be found. */
            this.baseViewUrl = this.prop("baseViewUrl");
            /** Whether or not the callback specified for onFailure will be called or not. */
            this.showFailureAlerts = this.prop("showFailureAlerts");
            /** A callback to be called when a failure response is received from the server. */
            this.onFailure = this.prop("onFailure");
            /** A callback to be called when an AJAX request begins. */
            this.onStartBusy = this.prop("onStartBusy");
            /** A callback to be called when an AJAX request completes. */
            this.onFinishBusy = this.prop("onFinishBusy");
            /**
                Gets the underlying observable that stores the object's explicit configuration value.
            */
            this.raw = function (name) {
                return _this["_" + name];
            };
            this.parentConfig = parentConfig;
        }
        return CoalesceConfiguration;
    }());
    var ViewModelConfiguration = (function (_super) {
        __extends(ViewModelConfiguration, _super);
        function ViewModelConfiguration() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** Time to wait after a change is seen before auto-saving (if autoSaveEnabled is true). Acts as a debouncing timer for multiple simultaneous changes. */
            _this.saveTimeoutMs = _this.prop("saveTimeoutMs");
            /** Determines whether changes to a model will be automatically saved after saveTimeoutMs milliseconds have elapsed. */
            _this.autoSaveEnabled = _this.prop("autoSaveEnabled");
            /** Determines whether or not changes to many-to-many collection properties will automatically trigger a save call to the server or not. */
            _this.autoSaveCollectionsEnabled = _this.prop("autoSaveCollectionsEnabled");
            /** Whether to invoke onStartBusy and onFinishBusy during saves. */
            _this.showBusyWhenSaving = _this.prop("showBusyWhenSaving");
            /** Whether or not to reload the ViewModel with the state of the object received from the server after a call to .save(). */
            _this.loadResponseFromSaves = _this.prop("loadResponseFromSaves");
            /**
                Whether or not to validate the model after loading it from a DTO from the server.
                Disabling this can improve performance in some cases.
            */
            _this.validateOnLoadFromDto = _this.prop("validateOnLoadFromDto");
            /**
                Whether or not validation on a ViewModel should be setup in its constructor,
                or if validation must be set up manually by calling viewModel.setupValidation().
                Turning this off can improve performance in read-only scenarios.
            */
            _this.setupValidationAutomatically = _this.prop("setupValidationAutomatically");
            /**
                An optional callback to be called when an object is loaded from a response from the server.
                Callback will be called after all properties on the ViewModel have been set from the server response.
            */
            _this.onLoadFromDto = _this.prop("onLoadFromDto");
            /**
                The dataSource (either an instance or a type) that will be used as the initial
                dataSource when a new object of this type is created.
                Not valid for global configuration; recommended to be used on class-level configuration.
                E.g. ViewModels.MyModel.coalesceConfig.initialDataSource(MyModel.dataSources.MyDataSource);
            */
            _this.initialDataSource = _this.prop("initialDataSource");
            return _this;
        }
        return ViewModelConfiguration;
    }(CoalesceConfiguration));
    Coalesce.ViewModelConfiguration = ViewModelConfiguration;
    var ListViewModelConfiguration = (function (_super) {
        __extends(ListViewModelConfiguration, _super);
        function ListViewModelConfiguration() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ListViewModelConfiguration;
    }(CoalesceConfiguration));
    Coalesce.ListViewModelConfiguration = ListViewModelConfiguration;
    var ServiceClientConfiguration = (function (_super) {
        __extends(ServiceClientConfiguration, _super);
        function ServiceClientConfiguration() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ServiceClientConfiguration;
    }(CoalesceConfiguration));
    Coalesce.ServiceClientConfiguration = ServiceClientConfiguration;
    var RootConfig = (function (_super) {
        __extends(RootConfig, _super);
        function RootConfig() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.viewModel = new ViewModelConfiguration(_this);
            _this.listViewModel = new ListViewModelConfiguration(_this);
            _this.serviceClient = new ServiceClientConfiguration(_this);
            return _this;
        }
        return RootConfig;
    }(CoalesceConfiguration));
    var invalidPropFunc = function () { if (arguments.length)
        throw "property is not valid at this level"; return null; };
    var invalidProp = invalidPropFunc;
    invalidProp.raw = invalidProp;
    Coalesce.GlobalConfiguration = new RootConfig();
    Coalesce.GlobalConfiguration.baseApiUrl("/api");
    Coalesce.GlobalConfiguration.baseViewUrl("");
    Coalesce.GlobalConfiguration.showFailureAlerts(true);
    Coalesce.GlobalConfiguration.onFailure(function (obj, message) { return alert(message); });
    Coalesce.GlobalConfiguration.onStartBusy(function (obj) { return Coalesce.Utilities.showBusy(); });
    Coalesce.GlobalConfiguration.onFinishBusy(function (obj) { return Coalesce.Utilities.hideBusy(); });
    Coalesce.GlobalConfiguration.viewModel.saveTimeoutMs(500);
    Coalesce.GlobalConfiguration.viewModel.autoSaveEnabled(true);
    Coalesce.GlobalConfiguration.viewModel.autoSaveCollectionsEnabled(true);
    Coalesce.GlobalConfiguration.viewModel.showBusyWhenSaving(false);
    Coalesce.GlobalConfiguration.viewModel.loadResponseFromSaves(true);
    Coalesce.GlobalConfiguration.viewModel.validateOnLoadFromDto(true);
    Coalesce.GlobalConfiguration.viewModel.setupValidationAutomatically(true);
    Coalesce.GlobalConfiguration.viewModel.initialDataSource = invalidProp;
    ko.validation.init({
        grouping: {
            deep: false,
            live: true,
            observable: true
        }
    });
    var ClientMethod = (function () {
        function ClientMethod(parent) {
            this.parent = parent;
            /** HTTP method to be used when calling the API endpoint. */
            this.verb = "POST";
            /** Result of method strongly typed in a observable. */
            this.result = ko.observable(null);
            /** Raw result object of method simply wrapped in an observable. */
            this.rawResult = ko.observable(null);
            /** True while the method is being called */
            this.isLoading = ko.observable(false);
            /** Error response when method has failed. */
            this.message = ko.observable(null);
            /** True if last invocation of method was successful. */
            this.wasSuccessful = ko.observable(null);
        }
        ClientMethod.prototype.invokeWithData = function (postData, callback, reload) {
            var _this = this;
            this.isLoading(true);
            this.message('');
            this.wasSuccessful(null);
            return $.ajax({
                method: this.verb,
                url: this.parent.coalesceConfig.baseApiUrl() + this.parent.apiController + '/' + this.name,
                data: postData,
                xhrFields: { withCredentials: true }
            })
                .done(function (data) {
                // This is here because it was migrated from the old client method calls.
                // Whether or not this should be done remains to be see, but it was kept to reduce
                // the number of breaking changes being made.
                if (_this.parent instanceof BaseViewModel)
                    _this.parent.isDirty(false);
                _this.rawResult(data.object);
                _this.message('');
                _this.wasSuccessful(true);
                _this.loadResponse(data.object, callback, reload);
            })
                .fail(function (xhr) {
                var errorMsg = "Unknown Error";
                if (xhr.responseJSON && xhr.responseJSON.message)
                    errorMsg = xhr.responseJSON.message;
                _this.wasSuccessful(false);
                _this.message(errorMsg);
                if (_this.parent.coalesceConfig.showFailureAlerts()) {
                    _this.parent.coalesceConfig.onFailure()(_this.parent, "Could not call method " + _this.name + ": " + errorMsg);
                }
            })
                .always(function () {
                _this.isLoading(false);
            });
        };
        return ClientMethod;
    }());
    Coalesce.ClientMethod = ClientMethod;
    var DataSource = (function () {
        function DataSource() {
            var _this = this;
            this.saveToDto = function () { return {}; };
            // This is computed so we can subscribe to when the request to the server changes,
            // and then reload objects/lists accordingly.
            this.getQueryString = ko.computed(function () {
                var query = "dataSource=" + _this._name;
                //&${$.param({ dataSource: this.saveToDto() }).replace(/dataSource%5B(.*?)%5D/g, 'dataSource.$1')}
                var dto = _this.saveToDto();
                for (var key in dto) {
                    if (dto[key] !== null && dto[key] !== undefined) {
                        query += "&dataSource." + key + "=" + encodeURIComponent(dto[key]);
                    }
                }
                return query;
            }, null, { deferEvaluation: true });
            /**
                Subscribe the given list to changes in the data source's parameters,
                triggering a reload upon changed parameter values.
            */
            this.subscribe = function (list) {
                _this.getQueryString.subscribe(function () {
                    if (list.isLoaded()) {
                        list.delayedLoad(300);
                    }
                });
            };
            this._name = Coalesce.Utilities.getClassName(this);
        }
        return DataSource;
    }());
    Coalesce.DataSource = DataSource;
    var ServiceClient = (function () {
        function ServiceClient() {
        }
        return ServiceClient;
    }());
    Coalesce.ServiceClient = ServiceClient;
    var BaseViewModel = (function () {
        function BaseViewModel(parent) {
            var _this = this;
            /**
                Properties which determine how this object behaves.
            */
            this.coalesceConfig = null;
            /** Stack for number of times loading has been called. */
            this.loadingCount = 0;
            /** Stores the return value of setInterval for automatic save delays. */
            this.saveTimeout = 0;
            /** Callbacks to call after a save. */
            this.saveCallbacks = [];
            /**
                String that will be passed to the server when loading and saving that allows for data trimming via C# Attributes.
            */
            this.includes = "";
            /** Parent of this object, if this object was loaded as part of a hierarchy. */
            this.parent = null;
            /** Parent of this object, if this object was loaded as part of list of objects. */
            this.parentCollection = null;
            /**
                Primary Key of the object.
                @deprecated Use the strongly-typed property of the key for this model whenever possible. This property will be removed once Coalesce supports composite keys.
            */
            this.myId = 0;
            /** Dirty Flag. Set when a value on the model changes. Reset when the model is saved or reloaded. */
            this.isDirty = ko.observable(false);
            /** Contains the error message from the last failed call to the server. */
            this.errorMessage = ko.observable(null);
            /** Flag to use to determine if this item is shown. Provided for convenience. */
            this.isVisible = ko.observable(false);
            /** Flag to use to determine if this item is expanded. Provided for convenience. */
            this.isExpanded = ko.observable(false);
            /** Flag to use to determine if this item is selected. Provided for convenience. */
            this.isSelected = ko.observable(false);
            /** Flag to use to determine if this item is checked. Provided for convenience. */
            this.isChecked = ko.observable(false);
            /** Flag to use to determine if this item is being edited. Provided for convenience. */
            this.isEditing = ko.observable(false);
            /** Toggles the isExpanded flag. Use with a click binding for a button. */
            this.toggleIsExpanded = function () { return _this.isExpanded(!_this.isExpanded()); };
            /** Toggles the isEditing flag. Use with a click binding for a button. */
            this.toggleIsEditing = function () { return _this.isEditing(!_this.isEditing()); };
            /** Toggles the isSelected flag. Use with a click binding for a button. */
            this.toggleIsSelected = function () { return _this.isSelected(!_this.isSelected()); };
            /**
                Sets isSelected(true) on this object and clears on the rest of the items in the parent collection.
                @returns true to bubble additional click events.
            */
            this.selectSingle = function () {
                if (_this.parentCollection()) {
                    $.each(_this.parentCollection(), function (i, obj) {
                        obj.isSelected(false);
                    });
                }
                _this.isSelected(true);
                return true; // Allow other click events
            };
            /** List of errors found during validation. Any errors present will prevent saving. */
            this.errors = null;
            /** List of warnings found during validation. Saving is still allowed with warnings present. */
            this.warnings = null;
            /** True if the object is currently saving. */
            this.isSaving = ko.observable(false);
            /** Internal count of child objects that are saving. */
            this.savingChildCount = ko.observable(0);
            /**
                Returns true if there are no client-side validation issues.
                Saves will be prevented if this returns false.
            */
            this.isValid = function () { return _this.errors == null || _this.errors().length == 0; };
            /**
                Triggers any validation messages to be shown, and returns a bool that indicates if there are any validation errors.
            */
            this.validate = function () {
                if (_this.errors) {
                    _this.errors.showAllMessages();
                    _this.warnings.showAllMessages();
                }
                return _this.isValid();
            };
            /** True if the object is loading. */
            this.isLoading = ko.observable(false);
            /**  True once the data has been loaded. */
            this.isLoaded = ko.observable(false);
            /** Returns true if the current object, or any of its children, are saving. */
            this.isThisOrChildSaving = ko.computed(function () {
                if (_this.isSaving())
                    return true;
                if (_this.savingChildCount() > 0)
                    return true;
                return false;
            });
            // Handle children that are saving.
            // Internally used member to count the number of saving children.
            this.onSavingChildChange = function (isSaving) {
                if (isSaving)
                    _this.savingChildCount(_this.savingChildCount() + 1);
                else
                    _this.savingChildCount(_this.savingChildCount() - 1);
                if (_this.parent instanceof BaseViewModel) {
                    _this.parent.onSavingChildChange(isSaving);
                }
            };
            /**
                Saves the object to the server and then calls a callback.
                Returns false if there are validation errors.
            */
            this.save = function (callback) {
                if (!_this.isLoading()) {
                    if (_this.validate()) {
                        if (_this.coalesceConfig.showBusyWhenSaving())
                            _this.coalesceConfig.onStartBusy()(_this);
                        _this.isSaving(true);
                        var url = "" + _this.coalesceConfig.baseApiUrl() + _this.apiController + "/Save?includes=" + _this.includes + "&" + _this.dataSource.getQueryString();
                        return $.ajax({ method: "POST", url: url, data: _this.saveToDto(), xhrFields: { withCredentials: true } })
                            .done(function (data) {
                            _this.isDirty(false);
                            _this.errorMessage(null);
                            if (_this.coalesceConfig.loadResponseFromSaves()) {
                                _this.loadFromDto(data.object, true);
                            }
                            // The object is now saved. Call any callback.
                            for (var i in _this.saveCallbacks) {
                                _this.saveCallbacks[i](_this);
                            }
                        })
                            .fail(function (xhr) {
                            var errorMsg = "Unknown Error";
                            if (xhr.responseJSON && xhr.responseJSON.message)
                                errorMsg = xhr.responseJSON.message;
                            _this.errorMessage(errorMsg);
                            // If an object was returned, load that object.
                            if (xhr.responseJSON && xhr.responseJSON.object) {
                                _this.loadFromDto(xhr.responseJSON.object, true);
                            }
                            if (_this.coalesceConfig.showFailureAlerts())
                                _this.coalesceConfig.onFailure()(_this, "Could not save the item: " + errorMsg);
                        })
                            .always(function () {
                            _this.isSaving(false);
                            if (typeof (callback) == "function") {
                                callback(_this);
                            }
                            if (_this.coalesceConfig.showBusyWhenSaving())
                                _this.coalesceConfig.onFinishBusy()(_this);
                        });
                    }
                    else {
                        // If validation fails, we still want to try and load any child objects which may have just been set.
                        // Normally, we get these from the result of the save.
                        _this.loadChildren();
                        return false;
                    }
                }
            };
            /** Loads the object from the server based on the id specified. If no id is specified, the current id is used if one is set. */
            this.load = function (id, callback) {
                if (!id) {
                    id = _this[_this.primaryKeyName]();
                }
                if (id) {
                    _this.isLoading(true);
                    _this.coalesceConfig.onStartBusy()(_this);
                    var url = "" + _this.coalesceConfig.baseApiUrl() + _this.apiController + "/Get/" + id + "?includes=" + _this.includes + "&" + _this.dataSource.getQueryString();
                    return $.ajax({ method: "GET", url: url, xhrFields: { withCredentials: true } })
                        .done(function (data) {
                        _this.errorMessage(null);
                        _this.loadFromDto(data.object, true);
                        _this.isLoaded(true);
                        if (typeof (callback) == "function")
                            callback(_this);
                    })
                        .fail(function (xhr) {
                        _this.isLoaded(false);
                        var errorMsg = "Could not load " + _this.modelName + " with ID = " + id;
                        if (xhr.responseJSON && xhr.responseJSON.message)
                            errorMsg = xhr.responseJSON.message;
                        _this.errorMessage(errorMsg);
                        if (_this.coalesceConfig.showFailureAlerts())
                            _this.coalesceConfig.onFailure()(_this, errorMsg);
                    })
                        .always(function () {
                        _this.coalesceConfig.onFinishBusy()(_this);
                        _this.isLoading(false);
                    });
                }
            };
            /** Deletes the object without any prompt for confirmation. */
            this.deleteItem = function (callback) {
                var currentId = _this[_this.primaryKeyName]();
                if (currentId) {
                    return $.ajax({ method: "POST", url: _this.coalesceConfig.baseApiUrl() + _this.apiController + "/Delete/" + currentId, xhrFields: { withCredentials: true } })
                        .done(function (data) {
                        _this.errorMessage(null);
                        // Remove it from the parent collection
                        if (_this.parentCollection && _this.parent) {
                            _this.parent.isLoading(true);
                            _this.parentCollection.splice(_this.parentCollection().indexOf(_this), 1);
                            _this.parent.isLoading(false);
                        }
                    })
                        .fail(function (xhr) {
                        var errorMsg = "Could not delete the item";
                        if (xhr.responseJSON && xhr.responseJSON.message)
                            errorMsg = xhr.responseJSON.message;
                        _this.errorMessage(errorMsg);
                        if (_this.coalesceConfig.showFailureAlerts())
                            _this.coalesceConfig.onFailure()(_this, errorMsg);
                    })
                        .always(function () {
                        if (typeof (callback) == "function") {
                            callback(_this);
                        }
                    });
                }
                else {
                    // No ID has been assigned yet, just remove it.
                    if (_this.parentCollection && _this.parent) {
                        _this.parent.isLoading(true);
                        _this.parentCollection.splice(_this.parentCollection().indexOf(_this), 1);
                        _this.parent.isLoading(false);
                    }
                    if (typeof (callback) == "function") {
                        callback(_this);
                    }
                }
            };
            /**
                Deletes the object if a prompt for confirmation is answered affirmatively.
            */
            this.deleteItemWithConfirmation = function (callback, message) {
                if (typeof message != 'string') {
                    message = "Delete this item?";
                }
                if (confirm(message)) {
                    return _this.deleteItem(callback);
                }
            };
            /** Saves a many-to-many collection change. This is done automatically and doesn't need to be called. */
            this.saveCollection = function (operation, existingItems, constructor, localIdProp, foreignIdProp, foreignId) {
                var currentId = _this[_this.primaryKeyName]();
                if (operation == 'added') {
                    var newItem = new constructor();
                    newItem.parent = _this;
                    newItem.parentCollection = existingItems;
                    newItem.coalesceConfig.autoSaveEnabled(false);
                    newItem[localIdProp](currentId);
                    newItem[foreignIdProp](foreignId);
                    return newItem.save(function () {
                        // Restore default autosave behavior.
                        newItem.coalesceConfig.autoSaveEnabled(null);
                        existingItems.push(newItem);
                    });
                }
                else if (operation == 'deleted') {
                    var matchedItems = existingItems().filter(function (i) { return i[localIdProp]() === currentId && i[foreignIdProp]() === foreignId; });
                    if (matchedItems.length == 0) {
                        throw "Couldn't find a " + constructor.toString() + " object to delete with " + localIdProp + "=" + currentId + " & " + foreignIdProp + "=" + foreignId + ".";
                    }
                    else {
                        // If we matched more than one item, we're just going to operate on the first one.
                        var matcheditem = matchedItems[0];
                        return matcheditem.deleteItem();
                    }
                }
            };
            /** Saves a many to many collection if coalesceConfig.autoSaveCollectionsEnabled is true. */
            this.autoSaveCollection = function (operation, existingItems, constructor, localIdProp, foreignIdProp, foreignId) {
                if (!_this.isLoading() && _this.coalesceConfig.autoSaveCollectionsEnabled()) {
                    // TODO: Eventually Batch saves for many-to-many collections.
                    if (operation != 'added' && operation != 'deleted')
                        return;
                    _this.saveCollection(operation, existingItems, constructor, localIdProp, foreignIdProp, foreignId);
                }
            };
            /**
                Register a callback to be called when a save is done.
                @returns true if the callback was registered. false if the callback was already registered.
            */
            this.onSave = function (callback) {
                if (typeof (callback) == "function" && !_this.saveCallbacks.filter(function (c) { return c == callback; }).length) {
                    _this.saveCallbacks.push(callback);
                    return true;
                }
                return false;
            };
            /** Saves the object is coalesceConfig.autoSaveEnabled is true. */
            this.autoSave = function () {
                if (!_this.isLoading()) {
                    _this.isDirty(true);
                    if (_this.coalesceConfig.autoSaveEnabled()) {
                        // Batch saves.
                        if (_this.saveTimeout)
                            clearTimeout(_this.saveTimeout);
                        _this.saveTimeout = setTimeout(function () {
                            _this.saveTimeout = 0;
                            // If we have a save in progress, wait...
                            if (_this.isSaving()) {
                                _this.autoSave();
                            }
                            else if (_this.coalesceConfig.autoSaveEnabled()) {
                                _this.save();
                            }
                        }, _this.coalesceConfig.saveTimeoutMs());
                    }
                }
            };
            /**
                Displays an editor for the object in a modal dialog.
            */
            this.showEditor = function (callback) {
                // Close any existing modal
                $('#modal-dialog').modal('hide');
                // Get new modal content
                _this.coalesceConfig.onStartBusy()(_this);
                return $.ajax({
                    method: "GET",
                    url: _this.coalesceConfig.baseViewUrl() + _this.viewController + '/EditorHtml',
                    data: { simple: true },
                    xhrFields: { withCredentials: true }
                })
                    .done(function (data) {
                    // Add to DOM
                    Coalesce.ModalHelpers.setupModal('Edit ' + _this.modelDisplayName, data, true, false);
                    // Data bind
                    var lastValue = _this.coalesceConfig.autoSaveEnabled.raw();
                    _this.coalesceConfig.autoSaveEnabled(false);
                    ko.applyBindings(_this, document.getElementById("modal-dialog"));
                    _this.coalesceConfig.autoSaveEnabled(lastValue);
                    // Show the dialog
                    $('#modal-dialog').modal('show');
                    // Make the callback when the form closes.
                    $("#modal-dialog").on("hidden.bs.modal", function () {
                        if (typeof (callback) == "function")
                            callback(_this);
                    });
                })
                    .always(function () {
                    _this.coalesceConfig.onFinishBusy()(_this);
                });
            };
            /**
                Common base-class level initialization that depends on all constructors being ran
                (and therefore cannot be performed directly in the base constructor).
            */
            this.baseInitialize = function () {
                var dataSource = _this.coalesceConfig.initialDataSource.peek();
                if (dataSource === null) {
                    _this.dataSource = new _this.dataSources.Default();
                }
                else {
                    if (dataSource instanceof Coalesce.DataSource) {
                        _this.dataSource = dataSource;
                    }
                    else {
                        _this.dataSource = new dataSource();
                    }
                }
                if (_this.coalesceConfig.setupValidationAutomatically.peek()) {
                    _this.setupValidation();
                }
            };
            this.parent = parent;
            // Handles setting the parent savingChildChange
            this.isSaving.subscribe(function (newValue) {
                if (_this.parent instanceof BaseViewModel) {
                    _this.parent.onSavingChildChange(newValue);
                }
            });
        }
        Object.defineProperty(BaseViewModel.prototype, "showBusyWhenSaving", {
            /**
                If true, the busy indicator is shown when loading.
                @deprecated Use coalesceConfig.showBusyWhenSaving instead.
            */
            get: function () { return this.coalesceConfig.showBusyWhenSaving(); },
            set: function (value) { this.coalesceConfig.showBusyWhenSaving(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseViewModel.prototype, "showFailureAlerts", {
            /**
                Whether or not alerts should be shown when loading fails.
                @deprecated Use coalesceConfig.showFailureAlerts instead.
            */
            get: function () { return this.coalesceConfig.showFailureAlerts(); },
            set: function (value) { this.coalesceConfig.showFailureAlerts(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseViewModel.prototype, "isSavingAutomatically", {
            /**
                If this is true, all changes will be saved automatically.
                @deprecated Use coalesceConfig.autoSaveEnabled instead.
            */
            get: function () { return this.coalesceConfig.autoSaveEnabled(); },
            set: function (value) { this.coalesceConfig.autoSaveEnabled(value); },
            enumerable: true,
            configurable: true
        });
        return BaseViewModel;
    }());
    Coalesce.BaseViewModel = BaseViewModel;
    var BaseListViewModel = (function () {
        function BaseListViewModel() {
            var _this = this;
            /**
                Properties which determine how this object behaves.
            */
            this.coalesceConfig = null;
            /**
                Query string to append to the API call when loading the list of items.
            */
            this.queryString = "";
            /**
                Object that contains property-level filters to be passed along to API calls.
            */
            this.filter = null;
            /** String that is used to control loading and serialization on the server. */
            this.includes = "";
            /** The collection of items that have been loaded from the server. */
            this.items = ko.observableArray([]);
            /**
                Load the list using current parameters for paging, searching, etc
                Result is placed into the items property.
            */
            this.load = function (callback) {
                _this.coalesceConfig.onStartBusy()(_this);
                _this.isLoading(true);
                var url = _this.coalesceConfig.baseApiUrl() + _this.apiController + "/List?" + _this.queryParams('list');
                return $.ajax({
                    method: "GET",
                    url: url,
                    xhrFields: { withCredentials: true }
                })
                    .done(function (data) {
                    Coalesce.KnockoutUtilities.RebuildArray(_this.items, data.list, _this.modelKeyName, _this.itemClass, _this, true);
                    $.each(_this.items(), function (_, model) {
                        model.includes = _this.includes;
                    });
                    _this.count(data.list.length);
                    _this.totalCount(data.totalCount);
                    _this.pageCount(data.pageCount);
                    _this.page(data.page);
                    _this.message(data.message);
                    _this.isLoaded(true);
                    if (typeof (callback) == "function")
                        callback(_this);
                })
                    .fail(function (xhr) {
                    var errorMsg = "Unknown Error";
                    if (xhr.responseJSON && xhr.responseJSON.message)
                        errorMsg = xhr.responseJSON.message;
                    _this.message(errorMsg);
                    _this.isLoaded(false);
                    if (_this.coalesceConfig.showFailureAlerts())
                        _this.coalesceConfig.onFailure()(_this, "Could not get list of " + _this.modelName + " items: " + errorMsg);
                })
                    .always(function () {
                    _this.coalesceConfig.onFinishBusy()(_this);
                    _this.isLoading(false);
                });
            };
            /** Returns a query string built from the list's various properties, appropriate to the kind of parameters requested. */
            this.queryParams = function (kind, pageSize) {
                var query = _this.dataSource.getQueryString();
                var param = function (name, value) {
                    if (value === null || value === undefined || value === "") {
                        return;
                    }
                    query += "&" + name + "=" + encodeURIComponent(value);
                };
                param("includes", _this.includes);
                if (kind == 'dataSource')
                    return query;
                if (_this.queryString)
                    query += "&" + _this.queryString;
                param("search", _this.search());
                if (_this.filter) {
                    for (var key in _this.filter) {
                        param("filter." + key, _this.filter[key]);
                    }
                }
                if (kind == 'filter')
                    return query;
                if (kind != 'list')
                    throw "unhandled kind " + kind;
                param("page", _this.page());
                param("pageSize", pageSize || _this.pageSize());
                param("orderBy", _this.orderBy());
                param("orderByDescending", _this.orderByDescending());
                return query;
            };
            /** Adds a new item to the collection. */
            this.addNewItem = function () {
                var item = _this.createItem();
                _this.items.push(item);
                return item;
            };
            /** Deletes an item. */
            this.deleteItem = function (item) {
                return item.deleteItem();
            };
            /** True if the list is loading. */
            this.isLoading = ko.observable(false);
            /** True once the list has been loaded. */
            this.isLoaded = ko.observable(false);
            /** Gets the count of items without getting all the items. Result is placed into the count property. */
            this.getCount = function (callback) {
                _this.coalesceConfig.onStartBusy()(_this);
                return $.ajax({
                    method: "GET",
                    url: _this.coalesceConfig.baseApiUrl() + _this.apiController + "/Count?" + _this.queryParams('filter'),
                    xhrFields: { withCredentials: true }
                })
                    .done(function (data) {
                    _this.count(data);
                    if (typeof (callback) == "function")
                        callback();
                })
                    .fail(function () {
                    if (_this.coalesceConfig.showFailureAlerts())
                        _this.coalesceConfig.onFailure()(_this, "Could not get count of " + _this.modelName + " items.");
                })
                    .always(function () {
                    _this.coalesceConfig.onFinishBusy()(_this);
                });
            };
            /** The result of getCount() or the total on this page. */
            this.count = ko.observable(null);
            /** Total count of items, even ones that are not on the page. */
            this.totalCount = ko.observable(null);
            /** Total page count */
            this.pageCount = ko.observable(null);
            /** Page number. This can be set to get a new page. */
            this.page = ko.observable(1);
            /** Number of items on a page. */
            this.pageSize = ko.observable(10);
            /** If a load failed, this is a message about why it failed. */
            this.message = ko.observable(null);
            /** Search criteria for the list. This can be exposed as a text box for searching. */
            this.search = ko.observable("");
            /** True if there is another page after the current page. */
            this.nextPageEnabled = ko.computed(function () { return _this.page() < _this.pageCount(); });
            /** True if there is another page before the current page. */
            this.previousPageEnabled = ko.computed(function () { return _this.page() > 1; });
            /** Change to the next page */
            this.nextPage = function () {
                if (_this.nextPageEnabled()) {
                    _this.page(_this.page() + 1);
                }
            };
            /** Change to the previous page */
            this.previousPage = function () {
                if (_this.previousPageEnabled()) {
                    _this.page(_this.page() - 1);
                }
            };
            /** Name of a field by which this list will be loaded in ascending order */
            this.orderBy = ko.observable("");
            /** Name of a field by which this list will be loaded in descending order */
            this.orderByDescending = ko.observable("");
            /** Toggles sorting between ascending, descending, and no order on the specified field. */
            this.orderByToggle = function (field) {
                if (_this.orderBy() == field && !_this.orderByDescending()) {
                    _this.orderBy('');
                    _this.orderByDescending(field);
                }
                else if (!_this.orderBy() && _this.orderByDescending() == field) {
                    _this.orderBy('');
                    _this.orderByDescending('');
                }
                else {
                    _this.orderBy(field);
                    _this.orderByDescending('');
                }
            };
            /** Returns URL to download a CSV for the current list with all items. */
            this.downloadAllCsvUrl = ko.computed(function () {
                var url = _this.coalesceConfig.baseApiUrl() + _this.apiController + "/CsvDownload?" + _this.queryParams('list', 10000);
                return url;
            }, null, { deferEvaluation: true });
            /** Prompts to the user for a file to upload as a CSV. */
            this.csvUploadUi = function (callback) {
                // Remove the form if it exists.
                $('#csv-upload').remove();
                // Add the form to the page to take the input
                $('body')
                    .append('<form id="csv-upload" display="none"></form>');
                $('#csv-upload')
                    .attr("action", _this.coalesceConfig.baseApiUrl() + _this.apiController + "/CsvUpload").attr("method", "post")
                    .append('<input type="file" style="visibility: hidden;" name="file"/>');
                // Set up the click callback.
                $('#csv-upload input[type=file]').change(function () {
                    // Get the files
                    var fileInput = $('#csv-upload input[type=file]')[0];
                    var file = fileInput.files[0];
                    if (file) {
                        var formData = new FormData();
                        formData.append('file', file);
                        _this.coalesceConfig.onStartBusy()(_this);
                        _this.isLoading(true);
                        $.ajax({
                            url: _this.coalesceConfig.baseApiUrl() + _this.apiController + "/CsvUpload",
                            data: formData,
                            processData: false,
                            contentType: false,
                            type: 'POST'
                        })
                            .done(function (data) {
                            _this.isLoading(false);
                            if (typeof (callback) == "function")
                                callback();
                        })
                            .fail(function (data) {
                            if (_this.coalesceConfig.showFailureAlerts())
                                _this.coalesceConfig.onFailure()(_this, "CSV Upload Failed");
                        })
                            .always(function () {
                            _this.load();
                            _this.coalesceConfig.onFinishBusy()(_this);
                        });
                    }
                    // Remove the form
                    $('#csv-upload').remove();
                });
                // Click on the input box
                $('#csv-upload input[type=file]').click();
            };
            this.loadTimeout = 0;
            /** reloads the list after a slight delay (100ms default) to ensure that all changes are made. */
            this.delayedLoad = function (milliseconds) {
                if (_this.loadTimeout) {
                    clearTimeout(_this.loadTimeout);
                }
                _this.loadTimeout = setTimeout(function () {
                    _this.loadTimeout = 0;
                    _this.load();
                }, milliseconds || 100);
            };
            this.pageSize.subscribe(function () {
                if (_this.isLoaded()) {
                    _this.load();
                }
            });
            this.page.subscribe(function () {
                // Page is set while we're loading results - ignore changes while isLoading() == true
                if (_this.isLoaded() && !_this.isLoading()) {
                    _this.delayedLoad(300);
                }
            });
            this.search.subscribe(function () { if (_this.isLoaded())
                _this.delayedLoad(300); });
            this.orderBy.subscribe(function () { if (_this.isLoaded())
                _this.delayedLoad(); });
            this.orderByDescending.subscribe(function () { if (_this.isLoaded())
                _this.delayedLoad(); });
        }
        Object.defineProperty(BaseListViewModel.prototype, "showFailureAlerts", {
            /**
                Whether or not alerts should be shown when loading fails.
                @deprecated Use coalesceConfig.showFailureAlerts instead.
            */
            get: function () { return this.coalesceConfig.showFailureAlerts(); },
            set: function (value) { this.coalesceConfig.showFailureAlerts(value); },
            enumerable: true,
            configurable: true
        });
        return BaseListViewModel;
    }());
    Coalesce.BaseListViewModel = BaseListViewModel;
})(Coalesce || (Coalesce = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
var Coalesce;
/// <reference path="../coalesce.dependencies.d.ts" />
(function (Coalesce) {
    var KnockoutUtilities;
    (function (KnockoutUtilities) {
        function BuildLookup(array, idField) {
            var lookup = {};
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                var key = ko.unwrap(item[idField]);
                // If an item is missing a value for a key, we can't look it up.
                // This is OK, because keyless items will never match an incoming item anyway.
                if (key != null)
                    lookup[key.toString()] = item;
            }
            return lookup;
        }
        function GetMatchingItem(originalContent, incomingItem, incomingItemIndex, originalLookup, idField, equalityComparer) {
            if (originalLookup === void 0) { originalLookup = null; }
            if (idField === void 0) { idField = null; }
            if (equalityComparer === void 0) { equalityComparer = null; }
            var matchingItem;
            if (idField) {
                var key_1 = ko.unwrap(incomingItem[idField]);
                if (originalLookup) {
                    matchingItem = originalLookup[key_1.toString()];
                }
                else {
                    var matchingItems = originalContent.filter(function (item) { return equalityComparer(item, key_1); });
                    if (matchingItems.length > 1) {
                        // We have a problem because keys are duplicated.
                        throw "Found duplicate items by key (name:" + idField + ") when rebuilding array.";
                    }
                    else {
                        matchingItem = matchingItems.length > 0 ? matchingItems[0] : null;
                    }
                }
            }
            else {
                matchingItem = originalContent[incomingItemIndex];
            }
            return matchingItem;
        }
        // Function to marge two arrays based on data from the server
        function RebuildArray(existingArray, incomingArray, idField, viewModelClass, parent, allowCollectionDeletes, equalityComparer) {
            if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
            if (equalityComparer === void 0) { equalityComparer = null; }
            var originalContent = existingArray() || [];
            // We're going to build a new array from scratch.
            // If we spliced and pushed the existing array one row at a time as needed,
            // it performs much more slowly, and also rebuilds the DOM in realtime as that happens.
            // This is because each push/splice triggers all subscribers to update.
            // If there are expensive subscriptions (not just the DOM - custom application code as well),
            // then performance drops off the edge of a cliff into a firey abyss.
            // Knockout is smart enough when we update the value of existingArray with newArray
            // to figure out exactly what changed, and will only rebuild the DOM as needed,
            // instead of rebuilding the entire thing: http://stackoverflow.com/a/18050443.
            // However, there will ALWAYS be one single notification to subscribers, even if we didn't actually change the array.
            // If arrays are being rebuilt frequently, this "false" subscriber notification could be detrimental to performance.
            // To prevent this from happening, at the bottom of this function we perform an array comparison before updating the final observable.
            var newContent = [];
            // If no specific equality comparison has been requested,
            // use a hash table for O(1) lookups on a single key to prevent O(n^2) from nested for-loops.
            if (equalityComparer == null && idField) {
                var originalLookup = BuildLookup(originalContent, idField);
            }
            // Can't do for (var i in array) because IE sees new methods added on to the prototype as keys
            for (var i = 0; i < incomingArray.length; i++) {
                var inItem = incomingArray[i];
                var matchingItem = GetMatchingItem(originalContent, inItem, i, originalLookup, idField, equalityComparer);
                if (matchingItem == null) {
                    // This is a brand new item that we don't already have an object for.
                    // We need to construct a new object and stick it in our newArray.
                    var newItem = new viewModelClass();
                    newItem.loadFromDto(inItem);
                    newItem.parent = parent;
                    newItem.parentCollection = existingArray;
                    newContent.push(newItem);
                }
                else {
                    // We already have an object for this item.
                    // Stick the existing object into our new array, and then reload it from the DTO.
                    newContent.push(matchingItem);
                    // Only reload the item if it is not dirty. If it is dirty, there are user-made changes
                    // that aren't yet saved that we shouldn't be overwriting.
                    if (!(matchingItem instanceof Coalesce.BaseViewModel) || !matchingItem.isDirty()) {
                        matchingItem.loadFromDto(inItem);
                    }
                    if (!allowCollectionDeletes) {
                        // This item is already in the collection, and we're not allowing not-found items to be deleted from the collection.
                        // We're going to do a pass of everything that was in the original collection at this end of this method,
                        // where we'll add everything from the original collection to the new collection.
                        // We need to remove the current item from the original collection so it doesn't get added again when we do that.
                        originalContent.splice(originalContent.indexOf(matchingItem), 1);
                    }
                }
            }
            // If we are not allowing deletes.
            if (!allowCollectionDeletes) {
                // If we aren't allowing deletes, we need to add all items from the original collection
                // to the new collection that we haven't already added. At this point, originalContent contains that set.
                // Note that this used to only re-insert items that are dirty,
                // but that didn't make any sense, and there was no comment that said why it was done that way.
                // So, we're just going to add in everything from originalContent.
                newContent.unshift.apply(newContent, originalContent);
            }
            if (newContent.length == originalContent.length &&
                ko.utils.compareArrays(newContent, originalContent).every(function (c) { return c.status == "retained"; })) {
                // Everything is the same (by doing a shallow equality check of the array - objects are checked by reference).
                // Shallow equality check by reference is perfectly in line with the spec for ObservableArray.
                // Do nothing.
            }
            else {
                // Something is different. Update the observable.
                // See the comments at the top of this method for why we do this conditionally.
                // Basically, its because this call ALWAYS notifies subscribers, but we can be more intelligent about it.
                existingArray(newContent);
            }
        }
        KnockoutUtilities.RebuildArray = RebuildArray;
        function RebuildArrayInPlace(existingArray, incomingArray, idField, equalityComparer) {
            if (equalityComparer === void 0) { equalityComparer = null; }
            var incomingArrayUnwrapped = ko.unwrap(incomingArray);
            var originalContent = existingArray().slice();
            // If no specific equality comparison has been requested,
            // use a hash table for O(1) lookups on a single key to prevent O(n^2) from nested for-loops.
            if (equalityComparer == null && idField) {
                var originalLookup = BuildLookup(originalContent, idField);
            }
            for (var i_1 = 0; i_1 < incomingArrayUnwrapped.length; i_1++) {
                var inItem = incomingArrayUnwrapped[i_1];
                var matchingItem = GetMatchingItem(originalContent, inItem, i_1, originalLookup, idField, equalityComparer);
                if (matchingItem == null) {
                    // Add this to the observable collection
                    existingArray.push(inItem);
                }
                else {
                    // Remove this one from the copy so we don't remove it later.
                    originalContent.splice(originalContent.indexOf(matchingItem), 1);
                }
            }
            // Remove any items that we didn't find in the incoming array.
            for (var i in originalContent) {
                existingArray.splice(existingArray.indexOf(originalContent[i]), 1);
            }
        }
        KnockoutUtilities.RebuildArrayInPlace = RebuildArrayInPlace;
    })(KnockoutUtilities = Coalesce.KnockoutUtilities || (Coalesce.KnockoutUtilities = {}));
})(Coalesce || (Coalesce = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Select2 binding for an object that uses an AJAX call for valid values. 
ko.bindingHandlers.select2Ajax = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var url = allBindings.get('url');
        var textField = Coalesce.Utilities.lowerFirstLetter(allBindings.get('textField'));
        var idField = Coalesce.Utilities.lowerFirstLetter(allBindings.get('idField'));
        var selectionFormat = allBindings.has("selectionFormat") ? allBindings.get("selectionFormat") : '{0}';
        var format = allBindings.has("format") ? allBindings.get("format") : '{0}';
        var setObject = allBindings.has("setObject") ? allBindings.get("setObject") : false;
        var itemViewModel = allBindings.get('itemViewModel');
        var object = allBindings.has('object') ? allBindings.get('object') : null;
        var selectOnClose = allBindings.has("selectOnClose") ? allBindings.get("selectOnClose") : false;
        var openOnFocus = allBindings.has("openOnFocus") ? allBindings.get("openOnFocus") : false; // This doesn't work in IE (GE: 2016-09-27)
        var allowClear = allBindings.has("allowClear") ? allBindings.get("allowClear") : true;
        var placeholder = $(element).attr('placeholder') || "select";
        var pageSize = allBindings.get('pageSize') || 25;
        if (!url)
            throw "select2Ajax requires additional binding 'url'";
        if (!textField)
            throw "select2Ajax requires additional binding 'textField'";
        if (!idField)
            throw "select2Ajax requires additional binding 'idField'";
        if (setObject && !itemViewModel)
            throw "select2Ajax with 'setObject' requires additional binding 'itemViewModel'."
                + " This should be a reference to the class of object being selected - e.g.ViewModels.Person.";
        // Create the Select2
        $(element)
            .select2({
            ajax: {
                url: url,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    var data = {
                        search: params.term,
                        page: params.page,
                        pageSize: pageSize,
                    };
                    if (!setObject) {
                        // If we're NOT going to populate the object observable with the results from our API call,
                        // then its safe to only get the two fields that we need to populate the dropdown.
                        // If we ARE going to set the object (setObject == true), then we should be requesting the entire object from the server.
                        // There may be scenarios where you may want to set the object but still only want the two fields.
                        // In this case, just specify ".../list?fields=field1,field2" as part of the url in the binding.
                        data.fields = idField + "," + textField;
                    }
                    ;
                    if (!allBindings.has('cache') || allBindings.get('cache'))
                        data["_"] = new Date().getTime();
                    return data;
                },
                processResults: function (data, params) {
                    // Transform our objects into what select2 wants (it needs objects with a key "id").
                    // We throw the raw object from the API on there as well so we can use it when handling a selection.
                    var results = data.list.map(function (item) {
                        return {
                            id: item[idField],
                            text: item[textField],
                            _apiObject: item,
                        };
                    });
                    // This doesn't seem to have ever worked. Params doesn't have a property named 'page'.
                    // Leaving it commented out to maintain that there was some intention to do this, 
                    // but we seem to have gotten by just fine with out it up until now.
                    //if (allowClear && params.page == 1) {
                    //    // Add a blank item
                    //    var blank = {
                    //        id: 0, // This should probably not be 0, since 0 is a totally valid primary key.
                    //        text: 'No Selection',
                    //    };
                    //    results.unshift(blank);
                    //}
                    return {
                        results: results,
                        pagination: {
                            more: data.page < data.pageCount
                        }
                    };
                },
                cache: (allBindings.has('cache') ? allBindings.get('cache') : false).toString(),
            },
            placeholder: placeholder,
            allowClear: allowClear,
            selectOnClose: selectOnClose,
            templateResult: function (item) {
                return format.replace('{0}', typeof item.text == "string" ? item.text :
                    typeof item == "string" ? item : "");
            },
            templateSelection: function (item) {
                return format.replace('{0}', typeof item.text == "string" ? item.text :
                    typeof item == "string" ? item : "");
            },
        })
            .on("change", function (e) {
            // Code to update knockout
            var value = $(element).val();
            // Loose equality is intentional - select2 always provides a string value when asked, 
            // but our observable is probably an integer number.
            if (valueAccessor()() != value && (valueAccessor()() || value)) {
                // Just like we do in the .loadFromDto method in the generated ViewModels,
                // we load the object property first BEFORE we load the primary key.
                if (object) {
                    // Set the object if such functionality is enabled
                    if (setObject) {
                        var selectedData = $(element).select2("data");
                        if (selectedData && selectedData.length > 0) {
                            var result = selectedData[0]._apiObject;
                            var oldObject = object();
                            if (oldObject instanceof itemViewModel) {
                                oldObject.loadFromDto(result);
                            }
                            else {
                                object(new itemViewModel(result));
                            }
                        }
                        else {
                            object(null);
                        }
                    }
                    else {
                        // Clear the object because we don't know anything about it.
                        // It might be reloaded when the parent object is saved.
                        object(null);
                    }
                }
                // Set the ID.
                if (value) {
                    valueAccessor()(value);
                }
                else {
                    valueAccessor()(null);
                }
            }
        });
        if (openOnFocus) {
            $.data(element).select2.on("focus", function () {
                $(element).select2("open");
            });
        }
        // Add the validation message
        ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        // The validation message needs to go after the new select2 dropdown, not before it.
        $(element).next(".validationMessage").insertAfter($(element).nextAll(".select2").first());
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // See if the value exists. If not, we haven't loaded it from the server yet.
        var clearOnNull = allBindings.get("clearOnNull") || false;
        var value = valueAccessor()();
        var select2Value = $(element).val();
        var setObject = allBindings.has("setObject") ? allBindings.get("setObject") : false;
        var textField = Coalesce.Utilities.lowerFirstLetter(allBindings.get('textField'));
        var idField = Coalesce.Utilities.lowerFirstLetter(allBindings.get('idField'));
        var object = allBindings.get('object');
        // See if something has changed
        var option;
        var triggerSelect2Change = false;
        if (value) {
            var options = $(element).find('option[value="' + value.toString().replace(/"/g, '\\"') + '"]');
            if (options.length > 0)
                option = options[0];
        }
        else {
            var options = $(element).find('option[value="' + value + '"]');
            if (options.length > 0)
                option = options[0];
        }
        if (!option) {
            option = new Option();
            option.value = value;
            option.selected = true;
            option.defaultSelected = true;
            $(element).append(option);
            triggerSelect2Change = true;
        }
        if (value === null && clearOnNull) {
            $(element).val("").trigger("change");
        }
        else {
            // Add it based on the object.
            var objectUnwrapped = ko.unwrap(object);
            if (value && objectUnwrapped) {
                // Get the raw key value from the object that we think represents the selected key.
                var id = ko.unwrap(objectUnwrapped[idField]);
                var text = ko.unwrap(objectUnwrapped[textField]);
                // Check id == value here to make sure we're creating an option for the correct object.
                // If the observable holding the ID changes but the object doesn't, then these won't match,
                // and we would risk displaying the wrong data if we didn't check for this.
                if (text && id && id == value) {
                    option.text = text;
                    triggerSelect2Change = true;
                }
            }
        }
        // Set the element based on the value in the model.
        if (triggerSelect2Change) {
            // When a change is triggered in select2, it doesn't update its internal option object
            // to reflect the text of the HTMLOptionElement. So, we have to manually update it,
            // taking care to only change it if the IDs match.
            var select2Option = $(element).select2("data")[0];
            if (select2Option && select2Option.id == option.value) {
                select2Option.text = option.text;
            }
            $(element).val(value).trigger('change');
        }
    }
};
// Multi-select Select2 binding that uses an AJAX call for the list of valid values.
ko.bindingHandlers.select2AjaxMultiple = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var url = allBindings.get('url');
        var itemViewModel = allBindings.get('itemViewModel');
        // 'idFieldName' was the old name, kept for backwards compat. 'idField' is the new name.
        var idField = Coalesce.Utilities.lowerFirstLetter(allBindings.get('idFieldName') || allBindings.get('idField'));
        var textField = Coalesce.Utilities.lowerFirstLetter(allBindings.get('textFieldName') || allBindings.get('textField'));
        if (!url)
            throw "select2AjaxMultiple requires additional binding 'url'";
        if (!itemViewModel)
            throw "select2AjaxMultiple requires additional binding 'itemViewModel'."
                + " This should be the class of the foreign end of the relationship - e.g.ViewModels.Case.";
        if (!idField)
            throw "select2AjaxMultiple requires additional binding 'idField'";
        if (!textField)
            throw "select2AjaxMultiple requires additional binding 'textField'";
        var selectionFormat = allBindings.has("selectionFormat") ? allBindings.get("selectionFormat") : '{0}';
        var format = allBindings.has("format") ? allBindings.get("format") : '{0}';
        var selectOnClose = allBindings.has("selectOnClose") ? allBindings.get("selectOnClose") : false;
        var openOnFocus = allBindings.has("openOnFocus") ? allBindings.get("openOnFocus") : false;
        var allowClear = allBindings.get('allowClear') || true;
        var placeholder = $(element).attr('placeholder') || "select";
        var updating = false;
        var pageSize = allBindings.get('pageSize') || 25;
        // Create the Select2
        $(element)
            .select2({
            ajax: {
                url: url,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    var data = {
                        search: params.term,
                        page: params.page
                    };
                    if (!allBindings.has('cache') || allBindings.get('cache'))
                        data["_"] = new Date().getTime();
                    return data;
                },
                processResults: function (data, params) {
                    // Transform our objects into what select2 wants (it needs objects with a key "id").
                    // We throw the raw object from the API on there as well so we can use it when handling a selection.
                    var results = data.list.map(function (item) {
                        return {
                            id: item[idField],
                            text: item[textField],
                            _apiObject: item,
                        };
                    });
                    return {
                        results: results,
                        pagination: {
                            more: data.page < data.pageCount
                        }
                    };
                },
                cache: (allBindings.has('cache') ? allBindings.get('cache') : false).toString(),
            },
            //escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            //minimumInputLength: 1,
            placeholder: placeholder,
            selectOnClose: selectOnClose,
            allowClear: allowClear,
            templateResult: function (item) {
                if (item.Classes) {
                    // This has a class use the formatting
                    var optionElement = $('<span class="' + item.Classes + '">' +
                        format.replace('{0}', (typeof item.text == "string" ? item.text : item))
                        + '</span>');
                    return optionElement;
                }
                return format.replace('{0}', (typeof item.text == "string" ? item.text : item));
            },
            templateSelection: function (item) {
                //if (e.Classes) {
                //    // This has a class use the formatting
                //    var optionElement = $('<span class="' + e.Classes + '">' +
                //        format.replace('{0}', (e[textFieldName] || e.text || e))
                //        + '</span>');
                //    return optionElement;
                //}
                return selectionFormat.replace('{0}', (item.text || item));
            },
        })
            .on("change", function (e) {
            if ($(element).data("select2-ajax-updating"))
                return;
            $(element).data("select2-ajax-updating", true);
            // Code to update knockout
            var selectedItems = $(element).select2("data");
            var values = valueAccessor();
            if (values() && selectedItems && values().length != selectedItems.length) {
                // Add the items to the observable array.
                // Warning: this code is O(n^2), but n should always be very reasonably small (if its > 50, you shouldn't be using a control like this.)
                if (selectedItems.length > values().length) {
                    // Item was added.
                    for (var i = 0; i < selectedItems.length; i++) {
                        var selectedItem = selectedItems[i];
                        var found = false;
                        for (var j = 0; j < values().length; j++) {
                            var value = values()[j];
                            found = found || (value.myId == selectedItem.id);
                        }
                        if (!found) {
                            // This is the missing one.
                            values.push(new itemViewModel(selectedItem._apiObject));
                        }
                    }
                }
                else if (selectedItems.length < values().length) {
                    // Item was removed
                    for (var i = 0; i < values().length; i++) {
                        var value = values()[i];
                        var found = false;
                        for (var j = 0; j < selectedItems.length; j++) {
                            var selectedItem = selectedItems[j];
                            found = found || (value.myId == selectedItem.id);
                        }
                        if (!found) {
                            // This is the missing one. Remove it.
                            values.splice(i, 1);
                            // Also remove the corresponding option element, if there is one.
                            // See the wall of text in the update handler of this binding below for an explanation why.
                            $(element).find("option").filter(function (_, e) { return e.getAttribute("value") == value.myId; }).remove();
                        }
                    }
                }
                else {
                    // Nothing changed.
                }
            }
            $(element).data("select2-ajax-updating", false);
        });
        if (openOnFocus) {
            $.data(element).select2.on("focus", function () {
                $(element).select2("open");
            });
        }
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Make sure that we read the valueAccessor BEFORE we return out of this function.
        // Otherwise, the dependency detection will not be set up correctly.
        // See https://stackoverflow.com/a/23880007/2465631;
        var value = valueAccessor()();
        if ($(element).data("select2-ajax-updating"))
            return;
        $(element).data("select2-ajax-updating", true);
        var idFieldName = Coalesce.Utilities.lowerFirstLetter(allBindings.get('idFieldName') || allBindings.get('idField'));
        var textFieldName = Coalesce.Utilities.lowerFirstLetter(allBindings.get('textFieldName') || allBindings.get('textField'));
        // See if the value exists. If not, we haven't loaded it from the server yet.
        var select2Value = $(element).val();
        if (!select2Value)
            select2Value = [];
        var selectedIds = [];
        // Convert the field names to js variables.
        textFieldName = textFieldName.charAt(0).toLowerCase() + textFieldName.slice(1);
        idFieldName = idFieldName.charAt(0).toLowerCase() + idFieldName.slice(1);
        // Remove all of the temporary option elements that we had to create.
        // These option elements are created so that select2 can display items that are
        // part of the collection of selected objects, but were not added to the list via select2 -
        // they came either with the initial data load, or were manually added to the undelying collection programatically.
        // We have to remove these options because if we don't,
        // and the user decides to remove an option from the selection box and then re-select that same item,
        // select2 won't use the "options" object from its ajax call (which contains our _apiObject property) -
        // it will use a fake object that it made that contains only and 'id' and 'text' property.
        $(element).find("option").remove();
        for (var i in value) {
            var item = value[i];
            var text = item[textFieldName]();
            var id = item[idFieldName]();
            var option = new Option(text, id, true, true);
            $(element).append(option);
            selectedIds.push(id);
        }
        $(element).val(selectedIds).trigger('change');
        $(element).data("select2-ajax-updating", false);
    }
};
// Select2 binding for a string value to show a list of other values
ko.bindingHandlers.select2AjaxText = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var url = allBindings.get('url');
        var selectOnClose = allBindings.has("selectOnClose") ? allBindings.get("selectOnClose") : false;
        var openOnFocus = allBindings.has("openOnFocus") ? allBindings.get("openOnFocus") : false; // This doesn't work in IE (GE: 2016-09-27)
        var allowClear = allBindings.get('allowClear') || true;
        var placeholder = $(element).attr('placeholder') || "select";
        var myParams;
        // Create the Select2
        $(element)
            .select2({
            ajax: {
                url: url,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    myParams = params;
                    var data = {
                        search: params.term,
                        page: params.page
                    };
                    if (!allBindings.has('cache') || allBindings.get('cache'))
                        data["_"] = new Date().getTime();
                    return data;
                },
                processResults: function (data, page) {
                    var result = [];
                    if (allowClear && !myParams.term) {
                        // Add a blank item
                        var blank = {
                            id: 0,
                            text: 'No Selection'
                        };
                        result.unshift(blank);
                    }
                    var perfectMatch = false;
                    var items;
                    if (Array.isArray(data)) {
                        // Raw endpoint that serves an array response.
                        items = data;
                    }
                    else if (typeof data !== "object") {
                        throw "Couldn't figure out how to access the text results - response wasn't an object for call to " + url;
                    }
                    else if (Array.isArray(data.object)) {
                        // Endpoint that serves an ItemResult<IEnumerable<string>>
                        // For example, a custom model method or static method.
                        items = data.object;
                    }
                    else if (Array.isArray(data.list)) {
                        // Endpoint that serves a ListResult<string>
                        items = data.list;
                    }
                    else {
                        throw "Couldn't figure out how to access the text results for call to " + url;
                    }
                    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                        var item = items_1[_i];
                        if (item == myParams.term) {
                            perfectMatch = true;
                            result.push({ id: item, text: item, selected: true });
                        }
                        else {
                            result.push({ id: item, text: item });
                        }
                    }
                    if (!perfectMatch && myParams.term) {
                        result.push({ id: myParams.term, text: myParams.term, selected: true });
                    }
                    return { results: result };
                },
                cache: (allBindings.has('cache') ? allBindings.get('cache') : false).toString(),
            },
            //escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            //minimumInputLength: 1,
            placeholder: placeholder,
            allowClear: allowClear,
            selectOnClose: selectOnClose
        })
            .on("change", function (e) {
            // Code to update knockout
            var value = $(element).val();
            if (valueAccessor()() !== value) {
                if (value) {
                    valueAccessor()(value);
                }
                else {
                    valueAccessor()(null);
                }
            }
        });
        if (openOnFocus) {
            $.data(element).select2.on("focus", function () {
                $(element).select2("open");
            });
        }
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // See if the value exists. If not, we haven't loaded it from the server yet.
        var value = valueAccessor()();
        var options;
        if (value) {
            options = $(element).find('option[value="' + value.toString().replace(/"/g, '\\"') + '"]');
        }
        else {
            options = $(element).find('option[value="' + value + '"]');
        }
        // The option doesn't exist.
        if (options.length == 0) {
            // Add it based on the object.
            var option = new Option(value, value, true, true);
            $(element).append(option);
        }
        // Set the element based on the value in the model.
        $(element).val(valueAccessor()()).trigger('change');
    }
};
// Simple Select2 binding used with an options list that is in HTML 
ko.bindingHandlers.select2 = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var selectOnClose = allBindings.has("selectOnClose") ? allBindings.get("selectOnClose") : false;
        var openOnFocus = allBindings.has("openOnFocus") ? allBindings.get("openOnFocus") : false; // This doesn't work in IE (GE: 2016-09-27)
        var allowClear = allBindings.get('allowClear') || true;
        var placeholder = $(element).attr('placeholder') || "select";
        // Create the Select2
        $(element)
            .select2({
            placeholder: placeholder,
            allowClear: allowClear,
            selectOnClose: selectOnClose,
        })
            .on("change", function (e) {
            // Code to update knockout
            var value = $(element).val();
            if (valueAccessor()() != value) {
                if (value) {
                    valueAccessor()(value);
                }
                else {
                    valueAccessor()(null);
                }
            }
        });
        if (openOnFocus) {
            $.data(element).select2.on("focus", function () {
                $(element).select2("open");
            });
        }
        // Add the validation message
        ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        // The validation message needs to go after the new select2 dropdown, not before it.
        $(element).next(".validationMessage").insertAfter($(element).nextAll(".select2").first());
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Set the element based on the value in the model.
        $(element).val(valueAccessor()()).trigger('change');
    }
};
ko.bindingHandlers.datePicker = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // See if we should use the parent element 
        var theElement = $(element).parent(".input-group.date") || $(element);
        var getValue = function () {
            var newValue = theElement.data("DateTimePicker").date();
            if (!newValue) {
                return null;
            }
            var preserveDate = allBindings.get('preserveDate') || false;
            var preserveTime = allBindings.get('preserveTime') || false;
            var unwrappedValue = valueAccessor()();
            if (!preserveDate && !preserveTime) {
                newValue = newValue;
            }
            else if (preserveTime) {
                // This is a date entry, keep the time. 
                var unwrappedTime = moment.duration(unwrappedValue.format('HH:mm:ss'));
                newValue = moment(newValue.format("YYYY/MM/DD"), "YYYY/MM/DD").add(unwrappedTime);
            }
            else if (preserveDate) {
                // This is a time entry, keep the date.
                var newTime = moment.duration(newValue.format('HH:mm:ss'));
                newValue = moment(unwrappedValue.format('YYYY/MM/DD'), "YYYY/MM/DD").add(newTime);
            }
            return newValue;
        };
        var updateValue = function () {
            var newValue = getValue();
            // Set the value if it has changed.
            var currentObservable = valueAccessor()();
            if (!currentObservable || !newValue || !newValue.isSame(currentObservable)) {
                valueAccessor()(newValue);
            }
        };
        theElement.datetimepicker({
            format: allBindings.get('format') || "M/D/YY h:mm a",
            stepping: allBindings.get('stepping') || 1,
            sideBySide: allBindings.get('sideBySide') || false,
            timeZone: allBindings.get('timeZone') || "",
            keyBinds: allBindings.get('keyBinds') || { left: null, right: null, delete: null },
        })
            .on("dp.change", function (e) {
            if (allBindings.get('updateImmediate')) {
                updateValue();
            }
        })
            .on("dp.hide", updateValue)
            .on('click', function (e) { return e.stopPropagation(); })
            .on('dblclick', function (e) { return e.stopPropagation(); });
        $(element)
            .on("blur", updateValue);
        // Add the validation message
        ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        // The validation message needs to go after the input group with the button.
        $(element).next(".validationMessage").insertAfter($(theElement));
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Set the element based on the value in the model.
        var theElement = $(element).parent(".input-group.date") || $(element);
        if (valueAccessor()())
            theElement.data("DateTimePicker").date(valueAccessor()());
        else
            theElement.data("DateTimePicker").date(null);
    }
};
ko.bindingHandlers.saveImmediately = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (!viewModel.coalesceConfig || !viewModel.coalesceConfig.autoSaveEnabled) {
            console.error("saveImmediately binding was used in a context where $data is not a Coalesce.BaseViewModel");
            return;
        }
        // Set up to save immediately when the cursor enters and return to a regular state when it leaves.
        var oldTimeoutValue;
        $(element).on("focus", function () {
            oldTimeoutValue = viewModel.coalesceConfig.saveTimeoutMs.raw();
            viewModel.coalesceConfig.saveTimeoutMs(0);
        });
        $(element).on("blur", function () {
            viewModel.coalesceConfig.saveTimeoutMs(oldTimeoutValue);
        });
    }
};
// Delays the save until the cursor leaves the field even if there is a value change.
ko.bindingHandlers.delaySave = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (!viewModel.coalesceConfig || !viewModel.coalesceConfig.autoSaveEnabled) {
            console.error("delaySave binding was used in a context where $data is not a Coalesce.BaseViewModel");
            return;
        }
        var existingAutoSaveValueRaw;
        // Set up to not save immediately when the cursor enters and return to a regular state when it leaves.
        $(element).on("focus", function () {
            existingAutoSaveValueRaw = viewModel.coalesceConfig.autoSaveEnabled.raw();
            viewModel.coalesceConfig.autoSaveEnabled(false);
        });
        // Turn it back to previous state when the cursor leaves.
        $(element).on("blur", function () {
            viewModel.coalesceConfig.autoSaveEnabled(existingAutoSaveValueRaw);
            // If there were changes, perform an autosave now (autoSave() won't save if autosave is disabled.)
            if (viewModel.isDirty()) {
                viewModel.autoSave();
            }
        });
    }
};
// Binding for Bootstrap ToolTips
// Format: tooltip: {title:note}  (where note is the observable with the value you want)
// Format: tooltip: {title:note, placement: 'bottom', animation: false}  (where note is the observable with the value you want)
// Format: tooltip: note          (where note is the observable with the value you want)
ko.bindingHandlers.tooltip = {
    init: function (element) {
        var $element = $(element);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if ($element.data('bs.tooltip')) {
                $element.tooltip('destroy');
            }
        });
    },
    update: function (element, valueAccessor) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());
        var options = {};
        if (value === null || typeof value !== 'object') {
            options = value;
        }
        else {
            ko.utils.objectForEach(value, function (propertyName, propertyValue) {
                options[propertyName] = ko.unwrap(propertyValue);
            });
        }
        if (typeof options !== 'object') {
            options = { title: value };
        }
        var tooltipData = $element.data('bs.tooltip');
        if (!tooltipData) {
            $element.tooltip(options);
        }
        else {
            ko.utils.extend(tooltipData.options, options);
        }
    }
};
ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};
ko.bindingHandlers.slideVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).slideDown() : $(element).slideUp();
    }
};
ko.bindingHandlers.booleanValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var observable = valueAccessor(), interceptor = ko.computed({
            read: function () {
                return observable().toString();
            },
            write: function (newValue) {
                observable(newValue === "true");
            }
        });
        ko.applyBindingsToNode(element, { value: interceptor });
    }
};
ko.bindingHandlers.formatNumberText = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var phone = ko.utils.unwrapObservable(valueAccessor());
        var formatPhone = function () {
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        };
        ko.bindingHandlers.text.update(element, formatPhone, allBindings, viewModel, bindingContext);
    }
};
// http://xion.io/post/code/knockout-let-binding.html
ko.bindingHandlers['let'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var innerContext = bindingContext.extend(valueAccessor);
        ko.applyBindingsToDescendants(innerContext, element);
        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings['let'] = true;
// Used from graMMDashpcharles 
// https://github.com/graMMDashpcharles/moment-knockout/
(function () {
    ko.bindingHandlers.moment = {
        defaults: {
            invalid: '',
            format: 'MM/DD/YYYY'
        },
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var allBindings = allBindingsAccessor();
            // register change event
            ko.utils.registerEventHandler(element, 'change', function () {
                var observable = valueAccessor();
                var val = moment($(element).val());
                observable(val);
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(), allBindings = allBindingsAccessor(), valueUnwrapped = ko.utils.unwrapObservable(value);
            // Date formats: http://momentjs.com/docs/#/displaying/format/
            var pattern = allBindings.format || ko.bindingHandlers.moment.defaults.format;
            var invalidString = allBindings.invalid == undefined ? ko.bindingHandlers.moment.defaults.invalid : allBindings.invalid;
            var dateMoment = moment(valueUnwrapped);
            // format string for input box
            var output = dateMoment.isValid() ?
                dateMoment.format(pattern) :
                invalidString;
            if ($(element).is("input") === true) {
                $(element).val(output);
            }
            else {
                $(element).text(output);
            }
        }
    };
    ko.bindingHandlers.momentFromNow = {
        defaults: {
            invalid: '',
        },
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var allBindings = allBindingsAccessor();
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                clearInterval(element.koFromNowTimer);
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(), allBindings = allBindingsAccessor(), valueUnwrapped = ko.utils.unwrapObservable(value);
            // Date formats: http://momentjs.com/docs/#/displaying/format/
            var invalidString = allBindings.invalid == undefined ? ko.bindingHandlers.moment.defaults.invalid : allBindings.invalid;
            var shorten = allBindings.shorten == undefined ? false : allBindings.shorten;
            var dateMoment = moment(valueUnwrapped);
            var fmt = function () {
                var output = dateMoment.isValid() ?
                    dateMoment.fromNow() :
                    invalidString;
                if (shorten) {
                    output = output.replace("minutes", "mins");
                    output = output.replace("a few seconds", "a moment");
                }
                return output;
            };
            $(element).text(fmt());
            clearInterval(element.koFromNowTimer);
            element.koFromNowTimer = setInterval(function () {
                $(element).text(fmt());
            }, 1000);
        }
    };
}());
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: ApplicationUser
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: ApplicationUser
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var ApplicationUser = (function (_super) {
        __extends(ApplicationUser, _super);
        function ApplicationUser(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "ApplicationUser";
            _this.primaryKeyName = "applicationUserId";
            _this.modelDisplayName = "Application User";
            _this.apiController = "/ApplicationUser";
            _this.viewController = "/ApplicationUser";
            /** Behavioral configuration for the current ApplicationUser instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(ApplicationUser.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.ApplicationUserDataSources;
            _this.applicationUserId = ko.observable(null);
            _this.name = ko.observable(null);
            _this.id = ko.observable(null);
            _this.userName = ko.observable(null);
            _this.normalizedUserName = ko.observable(null);
            _this.email = ko.observable(null);
            _this.normalizedEmail = ko.observable(null);
            _this.emailConfirmed = ko.observable(null);
            _this.passwordHash = ko.observable(null);
            _this.securityStamp = ko.observable(null);
            _this.concurrencyStamp = ko.observable(null);
            _this.phoneNumber = ko.observable(null);
            _this.phoneNumberConfirmed = ko.observable(null);
            _this.twoFactorEnabled = ko.observable(null);
            _this.lockoutEnd = ko.observable(null);
            _this.lockoutEnabled = ko.observable(null);
            _this.accessFailedCount = ko.observable(null);
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.applicationUserId;
                _this.applicationUserId(data.applicationUserId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                // The rest of the objects are loaded now.
                _this.name(data.name);
                _this.userName(data.userName);
                _this.normalizedUserName(data.normalizedUserName);
                _this.email(data.email);
                _this.normalizedEmail(data.normalizedEmail);
                _this.emailConfirmed(data.emailConfirmed);
                _this.passwordHash(data.passwordHash);
                _this.securityStamp(data.securityStamp);
                _this.concurrencyStamp(data.concurrencyStamp);
                _this.phoneNumber(data.phoneNumber);
                _this.phoneNumberConfirmed(data.phoneNumberConfirmed);
                _this.twoFactorEnabled(data.twoFactorEnabled);
                if (data.lockoutEnd == null)
                    _this.lockoutEnd(null);
                else if (_this.lockoutEnd() == null || _this.lockoutEnd().valueOf() != new Date(data.lockoutEnd).getTime()) {
                    _this.lockoutEnd(moment(new Date(data.lockoutEnd)));
                }
                _this.lockoutEnabled(data.lockoutEnabled);
                _this.accessFailedCount(data.accessFailedCount);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.applicationUserId = _this.applicationUserId();
                dto.name = _this.name();
                dto.userName = _this.userName();
                dto.normalizedUserName = _this.normalizedUserName();
                dto.email = _this.email();
                dto.normalizedEmail = _this.normalizedEmail();
                dto.emailConfirmed = _this.emailConfirmed();
                dto.passwordHash = _this.passwordHash();
                dto.securityStamp = _this.securityStamp();
                dto.concurrencyStamp = _this.concurrencyStamp();
                dto.phoneNumber = _this.phoneNumber();
                dto.phoneNumberConfirmed = _this.phoneNumberConfirmed();
                dto.twoFactorEnabled = _this.twoFactorEnabled();
                if (!_this.lockoutEnd())
                    dto.lockoutEnd = null;
                else
                    dto.lockoutEnd = _this.lockoutEnd().format('YYYY-MM-DDTHH:mm:ssZZ');
                dto.lockoutEnabled = _this.lockoutEnabled();
                dto.accessFailedCount = _this.accessFailedCount();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([
                    _this.lockoutEnd.extend({ moment: { unix: true } }),
                ]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.applicationUserId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            // This stuff needs to be done after everything else is set up.
            self.name.subscribe(self.autoSave);
            self.userName.subscribe(self.autoSave);
            self.normalizedUserName.subscribe(self.autoSave);
            self.email.subscribe(self.autoSave);
            self.normalizedEmail.subscribe(self.autoSave);
            self.emailConfirmed.subscribe(self.autoSave);
            self.passwordHash.subscribe(self.autoSave);
            self.securityStamp.subscribe(self.autoSave);
            self.concurrencyStamp.subscribe(self.autoSave);
            self.phoneNumber.subscribe(self.autoSave);
            self.phoneNumberConfirmed.subscribe(self.autoSave);
            self.twoFactorEnabled.subscribe(self.autoSave);
            self.lockoutEnd.subscribe(self.autoSave);
            self.lockoutEnabled.subscribe(self.autoSave);
            self.accessFailedCount.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return ApplicationUser;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of ApplicationUser. Can be overidden on each instance via instance.coalesceConfig. */
    ApplicationUser.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.ApplicationUser = ApplicationUser;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: ApplicationUser
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: ApplicationUser
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var ApplicationUserDataSources;
    (function (ApplicationUserDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        ApplicationUserDataSources.Default = Default;
    })(ApplicationUserDataSources = ListViewModels.ApplicationUserDataSources || (ListViewModels.ApplicationUserDataSources = {}));
    var ApplicationUserList = (function (_super) {
        __extends(ApplicationUserList, _super);
        function ApplicationUserList() {
            var _this = _super.call(this) || this;
            _this.modelName = "ApplicationUser";
            _this.apiController = "/ApplicationUser";
            _this.modelKeyName = "applicationUserId";
            _this.itemClass = ViewModels.ApplicationUser;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ApplicationUserDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(ApplicationUserList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.ApplicationUser(newItem, parent); };
            return _this;
        }
        return ApplicationUserList;
    }(Coalesce.BaseListViewModel));
    ApplicationUserList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.ApplicationUserList = ApplicationUserList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: CallSign
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: CallSign
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var CallSign = (function (_super) {
        __extends(CallSign, _super);
        function CallSign(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "CallSign";
            _this.primaryKeyName = "callSignId";
            _this.modelDisplayName = "Call Sign";
            _this.apiController = "/CallSign";
            _this.viewController = "/CallSign";
            /** Behavioral configuration for the current CallSign instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(CallSign.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.CallSignDataSources;
            _this.callSignId = ko.observable(null);
            _this.text = ko.observable(null);
            _this.logEntries = ko.observableArray([]);
            _this.voiceTransmissions = ko.observableArray([]);
            _this.streams = ko.observableArray([]);
            _this.logCount = ko.observable(null);
            _this.streamCount = ko.observable(null);
            _this.transmissionCount = ko.observable(null);
            /** Add object to logEntries */
            _this.addToLogEntries = function (autoSave) {
                var newItem = new ViewModels.LogEntry();
                if (typeof (autoSave) == 'boolean') {
                    newItem.coalesceConfig.autoSaveEnabled(autoSave);
                }
                newItem.parent = _this;
                newItem.parentCollection = _this.logEntries;
                newItem.isExpanded(true);
                newItem.callSignId(_this.callSignId());
                _this.logEntries.push(newItem);
                return newItem;
            };
            /** Add object to voiceTransmissions */
            _this.addToVoiceTransmissions = function (autoSave) {
                var newItem = new ViewModels.VoiceTransmission();
                if (typeof (autoSave) == 'boolean') {
                    newItem.coalesceConfig.autoSaveEnabled(autoSave);
                }
                newItem.parent = _this;
                newItem.parentCollection = _this.voiceTransmissions;
                newItem.isExpanded(true);
                newItem.callSignId(_this.callSignId());
                _this.voiceTransmissions.push(newItem);
                return newItem;
            };
            /** Add object to streams */
            _this.addToStreams = function (autoSave) {
                var newItem = new ViewModels.Stream();
                if (typeof (autoSave) == 'boolean') {
                    newItem.coalesceConfig.autoSaveEnabled(autoSave);
                }
                newItem.parent = _this;
                newItem.parentCollection = _this.streams;
                newItem.isExpanded(true);
                newItem.callSignId(_this.callSignId());
                _this.streams.push(newItem);
                return newItem;
            };
            /** Url for a table view of all members of collection LogEntries for the current object. */
            _this.logEntriesListUrl = ko.computed(function () { return _this.coalesceConfig.baseViewUrl() + '/LogEntry/Table?filter.callSignId=' + _this.callSignId(); }, null, { deferEvaluation: true });
            /** Url for a table view of all members of collection VoiceTransmissions for the current object. */
            _this.voiceTransmissionsListUrl = ko.computed(function () { return _this.coalesceConfig.baseViewUrl() + '/VoiceTransmission/Table?filter.callSignId=' + _this.callSignId(); }, null, { deferEvaluation: true });
            /** Url for a table view of all members of collection Streams for the current object. */
            _this.streamsListUrl = ko.computed(function () { return _this.coalesceConfig.baseViewUrl() + '/Stream/Table?filter.callSignId=' + _this.callSignId(); }, null, { deferEvaluation: true });
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.callSignId;
                _this.callSignId(data.callSignId);
                // Load the lists of other objects
                if (data.logEntries != null) {
                    // Merge the incoming array
                    Coalesce.KnockoutUtilities.RebuildArray(_this.logEntries, data.logEntries, 'logEntryId', ViewModels.LogEntry, _this, allowCollectionDeletes);
                }
                if (data.voiceTransmissions != null) {
                    // Merge the incoming array
                    Coalesce.KnockoutUtilities.RebuildArray(_this.voiceTransmissions, data.voiceTransmissions, 'voiceTransmissionId', ViewModels.VoiceTransmission, _this, allowCollectionDeletes);
                }
                if (data.streams != null) {
                    // Merge the incoming array
                    Coalesce.KnockoutUtilities.RebuildArray(_this.streams, data.streams, 'streamId', ViewModels.Stream, _this, allowCollectionDeletes);
                }
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                // The rest of the objects are loaded now.
                _this.text(data.text);
                _this.logCount(data.logCount);
                _this.streamCount(data.streamCount);
                _this.transmissionCount(data.transmissionCount);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.callSignId = _this.callSignId();
                dto.text = _this.text();
                dto.logCount = _this.logCount();
                dto.streamCount = _this.streamCount();
                dto.transmissionCount = _this.transmissionCount();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.callSignId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            // List Object model for LogEntries. Allows for loading subsets of data.
            var _logEntriesList = null;
            self.logEntriesList = function (loadImmediate) {
                if (loadImmediate === void 0) { loadImmediate = true; }
                if (!_logEntriesList) {
                    _logEntriesList = new ListViewModels.LogEntryList();
                    if (loadImmediate)
                        loadLogEntriesList();
                    self.callSignId.subscribe(loadLogEntriesList);
                }
                return _logEntriesList;
            };
            function loadLogEntriesList() {
                if (self.callSignId()) {
                    _logEntriesList.queryString = "filter.CallSignId=" + self.callSignId();
                    _logEntriesList.load();
                }
            }
            // List Object model for VoiceTransmissions. Allows for loading subsets of data.
            var _voiceTransmissionsList = null;
            self.voiceTransmissionsList = function (loadImmediate) {
                if (loadImmediate === void 0) { loadImmediate = true; }
                if (!_voiceTransmissionsList) {
                    _voiceTransmissionsList = new ListViewModels.VoiceTransmissionList();
                    if (loadImmediate)
                        loadVoiceTransmissionsList();
                    self.callSignId.subscribe(loadVoiceTransmissionsList);
                }
                return _voiceTransmissionsList;
            };
            function loadVoiceTransmissionsList() {
                if (self.callSignId()) {
                    _voiceTransmissionsList.queryString = "filter.CallSignId=" + self.callSignId();
                    _voiceTransmissionsList.load();
                }
            }
            // List Object model for Streams. Allows for loading subsets of data.
            var _streamsList = null;
            self.streamsList = function (loadImmediate) {
                if (loadImmediate === void 0) { loadImmediate = true; }
                if (!_streamsList) {
                    _streamsList = new ListViewModels.StreamList();
                    if (loadImmediate)
                        loadStreamsList();
                    self.callSignId.subscribe(loadStreamsList);
                }
                return _streamsList;
            };
            function loadStreamsList() {
                if (self.callSignId()) {
                    _streamsList.queryString = "filter.CallSignId=" + self.callSignId();
                    _streamsList.load();
                }
            }
            // This stuff needs to be done after everything else is set up.
            self.text.subscribe(self.autoSave);
            self.logCount.subscribe(self.autoSave);
            self.streamCount.subscribe(self.autoSave);
            self.transmissionCount.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return CallSign;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of CallSign. Can be overidden on each instance via instance.coalesceConfig. */
    CallSign.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.CallSign = CallSign;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: CallSign
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: CallSign
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var CallSignDataSources;
    (function (CallSignDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        CallSignDataSources.Default = Default;
        var CallSignsWithoutChildren = (function (_super) {
            __extends(CallSignsWithoutChildren, _super);
            function CallSignsWithoutChildren() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CallSignsWithoutChildren;
        }(Coalesce.DataSource));
        CallSignDataSources.CallSignsWithoutChildren = CallSignsWithoutChildren;
    })(CallSignDataSources = ListViewModels.CallSignDataSources || (ListViewModels.CallSignDataSources = {}));
    var CallSignList = (function (_super) {
        __extends(CallSignList, _super);
        function CallSignList() {
            var _this = _super.call(this) || this;
            _this.modelName = "CallSign";
            _this.apiController = "/CallSign";
            _this.modelKeyName = "callSignId";
            _this.itemClass = ViewModels.CallSign;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = CallSignDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(CallSignList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.CallSign(newItem, parent); };
            return _this;
        }
        return CallSignList;
    }(Coalesce.BaseListViewModel));
    CallSignList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.CallSignList = CallSignList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: IpLog
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: IpLog
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var IpLog = (function (_super) {
        __extends(IpLog, _super);
        function IpLog(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "IpLog";
            _this.primaryKeyName = "ipLogId";
            _this.modelDisplayName = "Ip Log";
            _this.apiController = "/IpLog";
            _this.viewController = "/IpLog";
            /** Behavioral configuration for the current IpLog instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(IpLog.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.IpLogDataSources;
            _this.ipLogId = ko.observable(null);
            _this.radioIdLogId = ko.observable(null);
            _this.radioIdLog = ko.observable(null);
            _this.logDateTime = ko.observable(moment());
            _this.ipAddress = ko.observable(null);
            _this.lat = ko.observable(null);
            _this.long = ko.observable(null);
            _this.callSignString = ko.observable(null);
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.ipLogId;
                _this.ipLogId(data.ipLogId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                if (!data.radioIdLog) {
                    if (data.radioIdLogId != _this.radioIdLogId()) {
                        _this.radioIdLog(null);
                    }
                }
                else {
                    if (!_this.radioIdLog()) {
                        _this.radioIdLog(new ViewModels.RadioIdLog(data.radioIdLog, _this));
                    }
                    else {
                        _this.radioIdLog().loadFromDto(data.radioIdLog);
                    }
                    if (_this.parent instanceof ViewModels.RadioIdLog && _this.parent !== _this.radioIdLog() && _this.parent.radioIdLogId() == _this.radioIdLog().radioIdLogId()) {
                        _this.parent.loadFromDto(data.radioIdLog, null, false);
                    }
                }
                // The rest of the objects are loaded now.
                _this.radioIdLogId(data.radioIdLogId);
                if (data.logDateTime == null)
                    _this.logDateTime(null);
                else if (_this.logDateTime() == null || _this.logDateTime().valueOf() != new Date(data.logDateTime).getTime()) {
                    _this.logDateTime(moment(new Date(data.logDateTime)));
                }
                _this.ipAddress(data.ipAddress);
                _this.lat(data.lat);
                _this.long(data.long);
                _this.callSignString(data.callSignString);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.ipLogId = _this.ipLogId();
                dto.radioIdLogId = _this.radioIdLogId();
                if (!dto.radioIdLogId && _this.radioIdLog()) {
                    dto.radioIdLogId = _this.radioIdLog().radioIdLogId();
                }
                if (!_this.logDateTime())
                    dto.logDateTime = null;
                else
                    dto.logDateTime = _this.logDateTime().format('YYYY-MM-DDTHH:mm:ss');
                dto.ipAddress = _this.ipAddress();
                dto.lat = _this.lat();
                dto.long = _this.long();
                dto.callSignString = _this.callSignString();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                // See if this.radioIdLog needs to be loaded.
                if (_this.radioIdLog() == null && _this.radioIdLogId() != null) {
                    loadingCount++;
                    var radioIdLogObj = new ViewModels.RadioIdLog();
                    radioIdLogObj.load(_this.radioIdLogId(), function () {
                        loadingCount--;
                        _this.radioIdLog(radioIdLogObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([
                    _this.radioIdLogId.extend({ required: { params: true, message: "Radio Id Log is required." } }),
                    _this.logDateTime.extend({ moment: { unix: true } }),
                ]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.ipLogId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            self.radioIdLogText = ko.pureComputed(function () {
                if (self.radioIdLog() && self.radioIdLog().radioIdLogId()) {
                    return self.radioIdLog().radioIdLogId().toString();
                }
                else {
                    return "None";
                }
            });
            self.showRadioIdLogEditor = function (callback) {
                if (!self.radioIdLog()) {
                    self.radioIdLog(new ViewModels.RadioIdLog());
                }
                self.radioIdLog().showEditor(callback);
            };
            // This stuff needs to be done after everything else is set up.
            self.radioIdLogId.subscribe(self.autoSave);
            self.radioIdLog.subscribe(self.autoSave);
            self.logDateTime.subscribe(self.autoSave);
            self.ipAddress.subscribe(self.autoSave);
            self.lat.subscribe(self.autoSave);
            self.long.subscribe(self.autoSave);
            self.callSignString.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return IpLog;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of IpLog. Can be overidden on each instance via instance.coalesceConfig. */
    IpLog.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.IpLog = IpLog;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: IpLog
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: IpLog
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var IpLogDataSources;
    (function (IpLogDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        IpLogDataSources.Default = Default;
        var MappableIps = (function (_super) {
            __extends(MappableIps, _super);
            function MappableIps() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MappableIps;
        }(Coalesce.DataSource));
        IpLogDataSources.MappableIps = MappableIps;
    })(IpLogDataSources = ListViewModels.IpLogDataSources || (ListViewModels.IpLogDataSources = {}));
    var IpLogList = (function (_super) {
        __extends(IpLogList, _super);
        function IpLogList() {
            var _this = _super.call(this) || this;
            _this.modelName = "IpLog";
            _this.apiController = "/IpLog";
            _this.modelKeyName = "ipLogId";
            _this.itemClass = ViewModels.IpLog;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = IpLogDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(IpLogList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.IpLog(newItem, parent); };
            return _this;
        }
        return IpLogList;
    }(Coalesce.BaseListViewModel));
    IpLogList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.IpLogList = IpLogList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: LogEntry
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: LogEntry
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var LogEntry = (function (_super) {
        __extends(LogEntry, _super);
        function LogEntry(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "LogEntry";
            _this.primaryKeyName = "logEntryId";
            _this.modelDisplayName = "Log Entry";
            _this.apiController = "/LogEntry";
            _this.viewController = "/LogEntry";
            /** Behavioral configuration for the current LogEntry instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(LogEntry.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.LogEntryDataSources;
            _this.logEntryId = ko.observable(null);
            _this.callSignId = ko.observable(null);
            _this.callSign = ko.observable(null);
            _this.entryDateTime = ko.observable(moment());
            _this.entry = ko.observable(null);
            _this.serverId = ko.observable(null);
            _this.server = ko.observable(null);
            _this.logEntryType = ko.observable(null);
            /** Text value for enumeration LogEntryType */
            _this.logEntryTypeText = ko.pureComputed(function () {
                for (var i = 0; i < _this.logEntryTypeValues.length; i++) {
                    if (_this.logEntryTypeValues[i].id == _this.logEntryType()) {
                        return _this.logEntryTypeValues[i].value;
                    }
                }
            });
            /** Array of all possible names & values of enum logEntryType */
            _this.logEntryTypeValues = [
                { id: 1, value: 'Repeater Config Start' },
                { id: 2, value: 'Client Closing Down' },
                { id: 3, value: 'A M B E Stream' },
                { id: 4, value: 'Voice Transmission Start' },
                { id: 5, value: 'Voice Transmission End' },
            ];
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.logEntryId;
                _this.logEntryId(data.logEntryId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                if (!data.callSign) {
                    if (data.callSignId != _this.callSignId()) {
                        _this.callSign(null);
                    }
                }
                else {
                    if (!_this.callSign()) {
                        _this.callSign(new ViewModels.CallSign(data.callSign, _this));
                    }
                    else {
                        _this.callSign().loadFromDto(data.callSign);
                    }
                    if (_this.parent instanceof ViewModels.CallSign && _this.parent !== _this.callSign() && _this.parent.callSignId() == _this.callSign().callSignId()) {
                        _this.parent.loadFromDto(data.callSign, null, false);
                    }
                }
                if (!data.server) {
                    if (data.serverId != _this.serverId()) {
                        _this.server(null);
                    }
                }
                else {
                    if (!_this.server()) {
                        _this.server(new ViewModels.Server(data.server, _this));
                    }
                    else {
                        _this.server().loadFromDto(data.server);
                    }
                    if (_this.parent instanceof ViewModels.Server && _this.parent !== _this.server() && _this.parent.serverId() == _this.server().serverId()) {
                        _this.parent.loadFromDto(data.server, null, false);
                    }
                }
                // The rest of the objects are loaded now.
                _this.callSignId(data.callSignId);
                if (data.entryDateTime == null)
                    _this.entryDateTime(null);
                else if (_this.entryDateTime() == null || _this.entryDateTime().valueOf() != new Date(data.entryDateTime).getTime()) {
                    _this.entryDateTime(moment(new Date(data.entryDateTime)));
                }
                _this.entry(data.entry);
                _this.serverId(data.serverId);
                _this.logEntryType(data.logEntryType);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.logEntryId = _this.logEntryId();
                dto.callSignId = _this.callSignId();
                if (!dto.callSignId && _this.callSign()) {
                    dto.callSignId = _this.callSign().callSignId();
                }
                if (!_this.entryDateTime())
                    dto.entryDateTime = null;
                else
                    dto.entryDateTime = _this.entryDateTime().format('YYYY-MM-DDTHH:mm:ss');
                dto.entry = _this.entry();
                dto.serverId = _this.serverId();
                if (!dto.serverId && _this.server()) {
                    dto.serverId = _this.server().serverId();
                }
                dto.logEntryType = _this.logEntryType();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                // See if this.callSign needs to be loaded.
                if (_this.callSign() == null && _this.callSignId() != null) {
                    loadingCount++;
                    var callSignObj = new ViewModels.CallSign();
                    callSignObj.load(_this.callSignId(), function () {
                        loadingCount--;
                        _this.callSign(callSignObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                // See if this.server needs to be loaded.
                if (_this.server() == null && _this.serverId() != null) {
                    loadingCount++;
                    var serverObj = new ViewModels.Server();
                    serverObj.load(_this.serverId(), function () {
                        loadingCount--;
                        _this.server(serverObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([
                    _this.callSignId.extend({ required: { params: true, message: "Call Sign is required." } }),
                    _this.entryDateTime.extend({ moment: { unix: true } }),
                    _this.serverId.extend({ required: { params: true, message: "Server is required." } }),
                ]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.logEntryId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            self.callSignText = ko.pureComputed(function () {
                if (self.callSign() && self.callSign().text()) {
                    return self.callSign().text().toString();
                }
                else {
                    return "None";
                }
            });
            self.serverText = ko.pureComputed(function () {
                if (self.server() && self.server().displayName()) {
                    return self.server().displayName().toString();
                }
                else {
                    return "None";
                }
            });
            self.showCallSignEditor = function (callback) {
                if (!self.callSign()) {
                    self.callSign(new ViewModels.CallSign());
                }
                self.callSign().showEditor(callback);
            };
            self.showServerEditor = function (callback) {
                if (!self.server()) {
                    self.server(new ViewModels.Server());
                }
                self.server().showEditor(callback);
            };
            // This stuff needs to be done after everything else is set up.
            self.callSignId.subscribe(self.autoSave);
            self.callSign.subscribe(self.autoSave);
            self.entryDateTime.subscribe(self.autoSave);
            self.entry.subscribe(self.autoSave);
            self.serverId.subscribe(self.autoSave);
            self.server.subscribe(self.autoSave);
            self.logEntryType.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return LogEntry;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of LogEntry. Can be overidden on each instance via instance.coalesceConfig. */
    LogEntry.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.LogEntry = LogEntry;
    (function (LogEntry) {
        var LogEntryTypeEnum;
        (function (LogEntryTypeEnum) {
            LogEntryTypeEnum[LogEntryTypeEnum["RepeaterConfigStart"] = 1] = "RepeaterConfigStart";
            LogEntryTypeEnum[LogEntryTypeEnum["ClientClosingDown"] = 2] = "ClientClosingDown";
            LogEntryTypeEnum[LogEntryTypeEnum["AMBEStream"] = 3] = "AMBEStream";
            LogEntryTypeEnum[LogEntryTypeEnum["VoiceTransmissionStart"] = 4] = "VoiceTransmissionStart";
            LogEntryTypeEnum[LogEntryTypeEnum["VoiceTransmissionEnd"] = 5] = "VoiceTransmissionEnd";
        })(LogEntryTypeEnum = LogEntry.LogEntryTypeEnum || (LogEntry.LogEntryTypeEnum = {}));
        ;
    })(LogEntry = ViewModels.LogEntry || (ViewModels.LogEntry = {}));
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: LogEntry
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: LogEntry
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var LogEntryDataSources;
    (function (LogEntryDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        LogEntryDataSources.Default = Default;
        var OnlineLogs = (function (_super) {
            __extends(OnlineLogs, _super);
            function OnlineLogs() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return OnlineLogs;
        }(Coalesce.DataSource));
        LogEntryDataSources.OnlineLogs = OnlineLogs;
        var OfflineLogs = (function (_super) {
            __extends(OfflineLogs, _super);
            function OfflineLogs() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return OfflineLogs;
        }(Coalesce.DataSource));
        LogEntryDataSources.OfflineLogs = OfflineLogs;
    })(LogEntryDataSources = ListViewModels.LogEntryDataSources || (ListViewModels.LogEntryDataSources = {}));
    var LogEntryList = (function (_super) {
        __extends(LogEntryList, _super);
        function LogEntryList() {
            var _this = _super.call(this) || this;
            _this.modelName = "LogEntry";
            _this.apiController = "/LogEntry";
            _this.modelKeyName = "logEntryId";
            _this.itemClass = ViewModels.LogEntry;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = LogEntryDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(LogEntryList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.LogEntry(newItem, parent); };
            return _this;
        }
        return LogEntryList;
    }(Coalesce.BaseListViewModel));
    LogEntryList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.LogEntryList = LogEntryList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: RadioIdLog
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: RadioIdLog
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var RadioIdLog = (function (_super) {
        __extends(RadioIdLog, _super);
        function RadioIdLog(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "RadioIdLog";
            _this.primaryKeyName = "radioIdLogId";
            _this.modelDisplayName = "Radio Id Log";
            _this.apiController = "/RadioIdLog";
            _this.viewController = "/RadioIdLog";
            /** Behavioral configuration for the current RadioIdLog instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(RadioIdLog.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.RadioIdLogDataSources;
            _this.radioIdLogId = ko.observable(null);
            _this.callSignId = ko.observable(null);
            _this.callSign = ko.observable(null);
            _this.serverId = ko.observable(null);
            _this.server = ko.observable(null);
            _this.radioId = ko.observable(null);
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.radioIdLogId;
                _this.radioIdLogId(data.radioIdLogId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                if (!data.callSign) {
                    if (data.callSignId != _this.callSignId()) {
                        _this.callSign(null);
                    }
                }
                else {
                    if (!_this.callSign()) {
                        _this.callSign(new ViewModels.CallSign(data.callSign, _this));
                    }
                    else {
                        _this.callSign().loadFromDto(data.callSign);
                    }
                    if (_this.parent instanceof ViewModels.CallSign && _this.parent !== _this.callSign() && _this.parent.callSignId() == _this.callSign().callSignId()) {
                        _this.parent.loadFromDto(data.callSign, null, false);
                    }
                }
                if (!data.server) {
                    if (data.serverId != _this.serverId()) {
                        _this.server(null);
                    }
                }
                else {
                    if (!_this.server()) {
                        _this.server(new ViewModels.Server(data.server, _this));
                    }
                    else {
                        _this.server().loadFromDto(data.server);
                    }
                    if (_this.parent instanceof ViewModels.Server && _this.parent !== _this.server() && _this.parent.serverId() == _this.server().serverId()) {
                        _this.parent.loadFromDto(data.server, null, false);
                    }
                }
                // The rest of the objects are loaded now.
                _this.callSignId(data.callSignId);
                _this.serverId(data.serverId);
                _this.radioId(data.radioId);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.radioIdLogId = _this.radioIdLogId();
                dto.callSignId = _this.callSignId();
                if (!dto.callSignId && _this.callSign()) {
                    dto.callSignId = _this.callSign().callSignId();
                }
                dto.serverId = _this.serverId();
                if (!dto.serverId && _this.server()) {
                    dto.serverId = _this.server().serverId();
                }
                dto.radioId = _this.radioId();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                // See if this.callSign needs to be loaded.
                if (_this.callSign() == null && _this.callSignId() != null) {
                    loadingCount++;
                    var callSignObj = new ViewModels.CallSign();
                    callSignObj.load(_this.callSignId(), function () {
                        loadingCount--;
                        _this.callSign(callSignObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                // See if this.server needs to be loaded.
                if (_this.server() == null && _this.serverId() != null) {
                    loadingCount++;
                    var serverObj = new ViewModels.Server();
                    serverObj.load(_this.serverId(), function () {
                        loadingCount--;
                        _this.server(serverObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([
                    _this.callSignId.extend({ required: { params: true, message: "Call Sign is required." } }),
                    _this.serverId.extend({ required: { params: true, message: "Server is required." } }),
                ]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.radioIdLogId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            self.callSignText = ko.pureComputed(function () {
                if (self.callSign() && self.callSign().text()) {
                    return self.callSign().text().toString();
                }
                else {
                    return "None";
                }
            });
            self.serverText = ko.pureComputed(function () {
                if (self.server() && self.server().displayName()) {
                    return self.server().displayName().toString();
                }
                else {
                    return "None";
                }
            });
            self.showCallSignEditor = function (callback) {
                if (!self.callSign()) {
                    self.callSign(new ViewModels.CallSign());
                }
                self.callSign().showEditor(callback);
            };
            self.showServerEditor = function (callback) {
                if (!self.server()) {
                    self.server(new ViewModels.Server());
                }
                self.server().showEditor(callback);
            };
            // This stuff needs to be done after everything else is set up.
            self.callSignId.subscribe(self.autoSave);
            self.callSign.subscribe(self.autoSave);
            self.serverId.subscribe(self.autoSave);
            self.server.subscribe(self.autoSave);
            self.radioId.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return RadioIdLog;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of RadioIdLog. Can be overidden on each instance via instance.coalesceConfig. */
    RadioIdLog.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.RadioIdLog = RadioIdLog;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: RadioIdLog
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: RadioIdLog
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var RadioIdLogDataSources;
    (function (RadioIdLogDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        RadioIdLogDataSources.Default = Default;
    })(RadioIdLogDataSources = ListViewModels.RadioIdLogDataSources || (ListViewModels.RadioIdLogDataSources = {}));
    var RadioIdLogList = (function (_super) {
        __extends(RadioIdLogList, _super);
        function RadioIdLogList() {
            var _this = _super.call(this) || this;
            _this.modelName = "RadioIdLog";
            _this.apiController = "/RadioIdLog";
            _this.modelKeyName = "radioIdLogId";
            _this.itemClass = ViewModels.RadioIdLog;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = RadioIdLogDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(RadioIdLogList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.RadioIdLog(newItem, parent); };
            return _this;
        }
        return RadioIdLogList;
    }(Coalesce.BaseListViewModel));
    RadioIdLogList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.RadioIdLogList = RadioIdLogList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: Server
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: Server
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var Server = (function (_super) {
        __extends(Server, _super);
        function Server(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "Server";
            _this.primaryKeyName = "serverId";
            _this.modelDisplayName = "Server";
            _this.apiController = "/Server";
            _this.viewController = "/Server";
            /** Behavioral configuration for the current Server instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(Server.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.ServerDataSources;
            _this.serverId = ko.observable(null);
            _this.logFileLocation = ko.observable(null);
            _this.displayName = ko.observable(null);
            _this.serverSearchString = ko.observable(null);
            _this.logEntries = ko.observableArray([]);
            _this.orderBy = ko.observable(null);
            _this.logCount = ko.observable(null);
            _this.onlineLogs = ko.observable(null);
            _this.offlineLogs = ko.observable(null);
            _this.transmissionsAndStreams = ko.observable(null);
            /** Add object to logEntries */
            _this.addToLogEntries = function (autoSave) {
                var newItem = new ViewModels.LogEntry();
                if (typeof (autoSave) == 'boolean') {
                    newItem.coalesceConfig.autoSaveEnabled(autoSave);
                }
                newItem.parent = _this;
                newItem.parentCollection = _this.logEntries;
                newItem.isExpanded(true);
                newItem.serverId(_this.serverId());
                _this.logEntries.push(newItem);
                return newItem;
            };
            /** Url for a table view of all members of collection LogEntries for the current object. */
            _this.logEntriesListUrl = ko.computed(function () { return _this.coalesceConfig.baseViewUrl() + '/LogEntry/Table?filter.serverId=' + _this.serverId(); }, null, { deferEvaluation: true });
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.serverId;
                _this.serverId(data.serverId);
                // Load the lists of other objects
                if (data.logEntries != null) {
                    // Merge the incoming array
                    Coalesce.KnockoutUtilities.RebuildArray(_this.logEntries, data.logEntries, 'logEntryId', ViewModels.LogEntry, _this, allowCollectionDeletes);
                }
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                // The rest of the objects are loaded now.
                _this.logFileLocation(data.logFileLocation);
                _this.displayName(data.displayName);
                _this.serverSearchString(data.serverSearchString);
                _this.orderBy(data.orderBy);
                _this.logCount(data.logCount);
                _this.onlineLogs(data.onlineLogs);
                _this.offlineLogs(data.offlineLogs);
                _this.transmissionsAndStreams(data.transmissionsAndStreams);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.serverId = _this.serverId();
                dto.logFileLocation = _this.logFileLocation();
                dto.displayName = _this.displayName();
                dto.serverSearchString = _this.serverSearchString();
                dto.orderBy = _this.orderBy();
                dto.logCount = _this.logCount();
                dto.onlineLogs = _this.onlineLogs();
                dto.offlineLogs = _this.offlineLogs();
                dto.transmissionsAndStreams = _this.transmissionsAndStreams();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.serverId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            // List Object model for LogEntries. Allows for loading subsets of data.
            var _logEntriesList = null;
            self.logEntriesList = function (loadImmediate) {
                if (loadImmediate === void 0) { loadImmediate = true; }
                if (!_logEntriesList) {
                    _logEntriesList = new ListViewModels.LogEntryList();
                    if (loadImmediate)
                        loadLogEntriesList();
                    self.serverId.subscribe(loadLogEntriesList);
                }
                return _logEntriesList;
            };
            function loadLogEntriesList() {
                if (self.serverId()) {
                    _logEntriesList.queryString = "filter.ServerId=" + self.serverId();
                    _logEntriesList.load();
                }
            }
            // This stuff needs to be done after everything else is set up.
            self.logFileLocation.subscribe(self.autoSave);
            self.displayName.subscribe(self.autoSave);
            self.serverSearchString.subscribe(self.autoSave);
            self.orderBy.subscribe(self.autoSave);
            self.logCount.subscribe(self.autoSave);
            self.onlineLogs.subscribe(self.autoSave);
            self.offlineLogs.subscribe(self.autoSave);
            self.transmissionsAndStreams.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return Server;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of Server. Can be overidden on each instance via instance.coalesceConfig. */
    Server.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.Server = Server;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: Server
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: Server
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var ServerDataSources;
    (function (ServerDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        ServerDataSources.Default = Default;
        var ServersWithoutChildren = (function (_super) {
            __extends(ServersWithoutChildren, _super);
            function ServersWithoutChildren() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ServersWithoutChildren;
        }(Coalesce.DataSource));
        ServerDataSources.ServersWithoutChildren = ServersWithoutChildren;
    })(ServerDataSources = ListViewModels.ServerDataSources || (ListViewModels.ServerDataSources = {}));
    var ServerList = (function (_super) {
        __extends(ServerList, _super);
        function ServerList() {
            var _this = _super.call(this) || this;
            _this.modelName = "Server";
            _this.apiController = "/Server";
            _this.modelKeyName = "serverId";
            _this.itemClass = ViewModels.Server;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ServerDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(ServerList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.Server(newItem, parent); };
            return _this;
        }
        return ServerList;
    }(Coalesce.BaseListViewModel));
    ServerList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.ServerList = ServerList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: Stream
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: Stream
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var Stream = (function (_super) {
        __extends(Stream, _super);
        function Stream(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "Stream";
            _this.primaryKeyName = "streamId";
            _this.modelDisplayName = "Stream";
            _this.apiController = "/Stream";
            _this.viewController = "/Stream";
            /** Behavioral configuration for the current Stream instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(Stream.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.StreamDataSources;
            _this.streamId = ko.observable(null);
            _this.serverId = ko.observable(null);
            _this.server = ko.observable(null);
            _this.callSignId = ko.observable(null);
            _this.callSign = ko.observable(null);
            _this.streamDateTime = ko.observable(moment());
            _this.streamNumber = ko.observable(null);
            _this.repeaterId = ko.observable(null);
            _this.talkGroup = ko.observable(null);
            _this.timeSlot = ko.observable(null);
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.streamId;
                _this.streamId(data.streamId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                if (!data.server) {
                    if (data.serverId != _this.serverId()) {
                        _this.server(null);
                    }
                }
                else {
                    if (!_this.server()) {
                        _this.server(new ViewModels.Server(data.server, _this));
                    }
                    else {
                        _this.server().loadFromDto(data.server);
                    }
                    if (_this.parent instanceof ViewModels.Server && _this.parent !== _this.server() && _this.parent.serverId() == _this.server().serverId()) {
                        _this.parent.loadFromDto(data.server, null, false);
                    }
                }
                if (!data.callSign) {
                    if (data.callSignId != _this.callSignId()) {
                        _this.callSign(null);
                    }
                }
                else {
                    if (!_this.callSign()) {
                        _this.callSign(new ViewModels.CallSign(data.callSign, _this));
                    }
                    else {
                        _this.callSign().loadFromDto(data.callSign);
                    }
                    if (_this.parent instanceof ViewModels.CallSign && _this.parent !== _this.callSign() && _this.parent.callSignId() == _this.callSign().callSignId()) {
                        _this.parent.loadFromDto(data.callSign, null, false);
                    }
                }
                // The rest of the objects are loaded now.
                _this.serverId(data.serverId);
                _this.callSignId(data.callSignId);
                if (data.streamDateTime == null)
                    _this.streamDateTime(null);
                else if (_this.streamDateTime() == null || _this.streamDateTime().valueOf() != new Date(data.streamDateTime).getTime()) {
                    _this.streamDateTime(moment(new Date(data.streamDateTime)));
                }
                _this.streamNumber(data.streamNumber);
                _this.repeaterId(data.repeaterId);
                _this.talkGroup(data.talkGroup);
                _this.timeSlot(data.timeSlot);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.streamId = _this.streamId();
                dto.serverId = _this.serverId();
                if (!dto.serverId && _this.server()) {
                    dto.serverId = _this.server().serverId();
                }
                dto.callSignId = _this.callSignId();
                if (!dto.callSignId && _this.callSign()) {
                    dto.callSignId = _this.callSign().callSignId();
                }
                if (!_this.streamDateTime())
                    dto.streamDateTime = null;
                else
                    dto.streamDateTime = _this.streamDateTime().format('YYYY-MM-DDTHH:mm:ss');
                dto.streamNumber = _this.streamNumber();
                dto.repeaterId = _this.repeaterId();
                dto.talkGroup = _this.talkGroup();
                dto.timeSlot = _this.timeSlot();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                // See if this.server needs to be loaded.
                if (_this.server() == null && _this.serverId() != null) {
                    loadingCount++;
                    var serverObj = new ViewModels.Server();
                    serverObj.load(_this.serverId(), function () {
                        loadingCount--;
                        _this.server(serverObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                // See if this.callSign needs to be loaded.
                if (_this.callSign() == null && _this.callSignId() != null) {
                    loadingCount++;
                    var callSignObj = new ViewModels.CallSign();
                    callSignObj.load(_this.callSignId(), function () {
                        loadingCount--;
                        _this.callSign(callSignObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([
                    _this.serverId.extend({ required: { params: true, message: "Server is required." } }),
                    _this.callSignId.extend({ required: { params: true, message: "Call Sign is required." } }),
                    _this.streamDateTime.extend({ moment: { unix: true } }),
                ]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.streamId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            self.serverText = ko.pureComputed(function () {
                if (self.server() && self.server().displayName()) {
                    return self.server().displayName().toString();
                }
                else {
                    return "None";
                }
            });
            self.callSignText = ko.pureComputed(function () {
                if (self.callSign() && self.callSign().text()) {
                    return self.callSign().text().toString();
                }
                else {
                    return "None";
                }
            });
            self.showServerEditor = function (callback) {
                if (!self.server()) {
                    self.server(new ViewModels.Server());
                }
                self.server().showEditor(callback);
            };
            self.showCallSignEditor = function (callback) {
                if (!self.callSign()) {
                    self.callSign(new ViewModels.CallSign());
                }
                self.callSign().showEditor(callback);
            };
            // This stuff needs to be done after everything else is set up.
            self.serverId.subscribe(self.autoSave);
            self.server.subscribe(self.autoSave);
            self.callSignId.subscribe(self.autoSave);
            self.callSign.subscribe(self.autoSave);
            self.streamDateTime.subscribe(self.autoSave);
            self.streamNumber.subscribe(self.autoSave);
            self.repeaterId.subscribe(self.autoSave);
            self.talkGroup.subscribe(self.autoSave);
            self.timeSlot.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return Stream;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of Stream. Can be overidden on each instance via instance.coalesceConfig. */
    Stream.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.Stream = Stream;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: Stream
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: Stream
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var StreamDataSources;
    (function (StreamDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        StreamDataSources.Default = Default;
    })(StreamDataSources = ListViewModels.StreamDataSources || (ListViewModels.StreamDataSources = {}));
    var StreamList = (function (_super) {
        __extends(StreamList, _super);
        function StreamList() {
            var _this = _super.call(this) || this;
            _this.modelName = "Stream";
            _this.apiController = "/Stream";
            _this.modelKeyName = "streamId";
            _this.itemClass = ViewModels.Stream;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = StreamDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(StreamList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.Stream(newItem, parent); };
            return _this;
        }
        return StreamList;
    }(Coalesce.BaseListViewModel));
    StreamList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.StreamList = StreamList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: TalkGroup
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: TalkGroup
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var TalkGroup = (function (_super) {
        __extends(TalkGroup, _super);
        function TalkGroup(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "TalkGroup";
            _this.primaryKeyName = "talkGroupId";
            _this.modelDisplayName = "Talk Group";
            _this.apiController = "/TalkGroup";
            _this.viewController = "/TalkGroup";
            /** Behavioral configuration for the current TalkGroup instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(TalkGroup.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.TalkGroupDataSources;
            _this.talkGroupId = ko.observable(null);
            _this.ts1Id = ko.observable(null);
            _this.ts2Id = ko.observable(null);
            _this.name = ko.observable(null);
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.talkGroupId;
                _this.talkGroupId(data.talkGroupId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                // The rest of the objects are loaded now.
                _this.ts1Id(data.ts1Id);
                _this.ts2Id(data.ts2Id);
                _this.name(data.name);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.talkGroupId = _this.talkGroupId();
                dto.ts1Id = _this.ts1Id();
                dto.ts2Id = _this.ts2Id();
                dto.name = _this.name();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.talkGroupId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            // This stuff needs to be done after everything else is set up.
            self.ts1Id.subscribe(self.autoSave);
            self.ts2Id.subscribe(self.autoSave);
            self.name.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return TalkGroup;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of TalkGroup. Can be overidden on each instance via instance.coalesceConfig. */
    TalkGroup.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.TalkGroup = TalkGroup;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: TalkGroup
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: TalkGroup
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var TalkGroupDataSources;
    (function (TalkGroupDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        TalkGroupDataSources.Default = Default;
    })(TalkGroupDataSources = ListViewModels.TalkGroupDataSources || (ListViewModels.TalkGroupDataSources = {}));
    var TalkGroupList = (function (_super) {
        __extends(TalkGroupList, _super);
        function TalkGroupList() {
            var _this = _super.call(this) || this;
            _this.modelName = "TalkGroup";
            _this.apiController = "/TalkGroup";
            _this.modelKeyName = "talkGroupId";
            _this.itemClass = ViewModels.TalkGroup;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = TalkGroupDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(TalkGroupList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.TalkGroup(newItem, parent); };
            return _this;
        }
        return TalkGroupList;
    }(Coalesce.BaseListViewModel));
    TalkGroupList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.TalkGroupList = TalkGroupList;
})(ListViewModels || (ListViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: VoiceTransmission
// Generated by IntelliTect.Coalesce
var ViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout View Model for: VoiceTransmission
// Generated by IntelliTect.Coalesce
(function (ViewModels) {
    var VoiceTransmission = (function (_super) {
        __extends(VoiceTransmission, _super);
        function VoiceTransmission(newItem, parent) {
            var _this = _super.call(this, parent) || this;
            _this.modelName = "VoiceTransmission";
            _this.primaryKeyName = "voiceTransmissionId";
            _this.modelDisplayName = "Voice Transmission";
            _this.apiController = "/VoiceTransmission";
            _this.viewController = "/VoiceTransmission";
            /** Behavioral configuration for the current VoiceTransmission instance. */
            _this.coalesceConfig = new Coalesce.ViewModelConfiguration(VoiceTransmission.coalesceConfig);
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = ListViewModels.VoiceTransmissionDataSources;
            _this.voiceTransmissionId = ko.observable(null);
            _this.transmissionDateTimeStart = ko.observable(moment());
            _this.transmissionDateTimeEnd = ko.observable(moment());
            _this.callSignId = ko.observable(null);
            _this.callSign = ko.observable(null);
            _this.serverId = ko.observable(null);
            _this.server = ko.observable(null);
            _this.talkGroup = ko.observable(null);
            _this.lossRate = ko.observable(null);
            /**
                Load the ViewModel object from the DTO.
                @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
                @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
            */
            _this.loadFromDto = function (data, force, allowCollectionDeletes) {
                if (force === void 0) { force = false; }
                if (allowCollectionDeletes === void 0) { allowCollectionDeletes = true; }
                if (!data || (!force && _this.isLoading()))
                    return;
                _this.isLoading(true);
                // Set the ID 
                _this.myId = data.voiceTransmissionId;
                _this.voiceTransmissionId(data.voiceTransmissionId);
                // Load the lists of other objects
                // Objects are loaded first so that they are available when the IDs get loaded.
                // This handles the issue with populating select lists with correct data because we now have the object.
                if (!data.callSign) {
                    if (data.callSignId != _this.callSignId()) {
                        _this.callSign(null);
                    }
                }
                else {
                    if (!_this.callSign()) {
                        _this.callSign(new ViewModels.CallSign(data.callSign, _this));
                    }
                    else {
                        _this.callSign().loadFromDto(data.callSign);
                    }
                    if (_this.parent instanceof ViewModels.CallSign && _this.parent !== _this.callSign() && _this.parent.callSignId() == _this.callSign().callSignId()) {
                        _this.parent.loadFromDto(data.callSign, null, false);
                    }
                }
                if (!data.server) {
                    if (data.serverId != _this.serverId()) {
                        _this.server(null);
                    }
                }
                else {
                    if (!_this.server()) {
                        _this.server(new ViewModels.Server(data.server, _this));
                    }
                    else {
                        _this.server().loadFromDto(data.server);
                    }
                    if (_this.parent instanceof ViewModels.Server && _this.parent !== _this.server() && _this.parent.serverId() == _this.server().serverId()) {
                        _this.parent.loadFromDto(data.server, null, false);
                    }
                }
                // The rest of the objects are loaded now.
                if (data.transmissionDateTimeStart == null)
                    _this.transmissionDateTimeStart(null);
                else if (_this.transmissionDateTimeStart() == null || _this.transmissionDateTimeStart().valueOf() != new Date(data.transmissionDateTimeStart).getTime()) {
                    _this.transmissionDateTimeStart(moment(new Date(data.transmissionDateTimeStart)));
                }
                if (data.transmissionDateTimeEnd == null)
                    _this.transmissionDateTimeEnd(null);
                else if (_this.transmissionDateTimeEnd() == null || _this.transmissionDateTimeEnd().valueOf() != new Date(data.transmissionDateTimeEnd).getTime()) {
                    _this.transmissionDateTimeEnd(moment(new Date(data.transmissionDateTimeEnd)));
                }
                _this.callSignId(data.callSignId);
                _this.serverId(data.serverId);
                _this.talkGroup(data.talkGroup);
                _this.lossRate(data.lossRate);
                if (_this.coalesceConfig.onLoadFromDto()) {
                    _this.coalesceConfig.onLoadFromDto()(_this);
                }
                _this.isLoading(false);
                _this.isDirty(false);
                if (_this.coalesceConfig.validateOnLoadFromDto())
                    _this.validate();
            };
            /** Saves this object into a data transfer object to send to the server. */
            _this.saveToDto = function () {
                var dto = {};
                dto.voiceTransmissionId = _this.voiceTransmissionId();
                if (!_this.transmissionDateTimeStart())
                    dto.transmissionDateTimeStart = null;
                else
                    dto.transmissionDateTimeStart = _this.transmissionDateTimeStart().format('YYYY-MM-DDTHH:mm:ss');
                if (!_this.transmissionDateTimeEnd())
                    dto.transmissionDateTimeEnd = null;
                else
                    dto.transmissionDateTimeEnd = _this.transmissionDateTimeEnd().format('YYYY-MM-DDTHH:mm:ss');
                dto.callSignId = _this.callSignId();
                if (!dto.callSignId && _this.callSign()) {
                    dto.callSignId = _this.callSign().callSignId();
                }
                dto.serverId = _this.serverId();
                if (!dto.serverId && _this.server()) {
                    dto.serverId = _this.server().serverId();
                }
                dto.talkGroup = _this.talkGroup();
                dto.lossRate = _this.lossRate();
                return dto;
            };
            /**
                Loads any child objects that have an ID set, but not the full object.
                This is useful when creating an object that has a parent object and the ID is set on the new child.
            */
            _this.loadChildren = function (callback) {
                var loadingCount = 0;
                // See if this.callSign needs to be loaded.
                if (_this.callSign() == null && _this.callSignId() != null) {
                    loadingCount++;
                    var callSignObj = new ViewModels.CallSign();
                    callSignObj.load(_this.callSignId(), function () {
                        loadingCount--;
                        _this.callSign(callSignObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                // See if this.server needs to be loaded.
                if (_this.server() == null && _this.serverId() != null) {
                    loadingCount++;
                    var serverObj = new ViewModels.Server();
                    serverObj.load(_this.serverId(), function () {
                        loadingCount--;
                        _this.server(serverObj);
                        if (loadingCount == 0 && typeof (callback) == "function") {
                            callback();
                        }
                    });
                }
                if (loadingCount == 0 && typeof (callback) == "function") {
                    callback();
                }
            };
            _this.setupValidation = function () {
                if (_this.errors !== null)
                    return;
                _this.errors = ko.validation.group([
                    _this.transmissionDateTimeStart.extend({ moment: { unix: true } }),
                    _this.transmissionDateTimeEnd.extend({ moment: { unix: true } }),
                    _this.callSignId.extend({ required: { params: true, message: "Call Sign is required." } }),
                    _this.serverId.extend({ required: { params: true, message: "Server is required." } }),
                ]);
                _this.warnings = ko.validation.group([]);
            };
            // Computed Observable for edit URL
            _this.editUrl = ko.pureComputed(function () {
                return _this.coalesceConfig.baseViewUrl() + _this.viewController + "/CreateEdit?id=" + _this.voiceTransmissionId();
            });
            _this.baseInitialize();
            var self = _this;
            self.myId;
            // Create computeds for display for objects
            self.callSignText = ko.pureComputed(function () {
                if (self.callSign() && self.callSign().text()) {
                    return self.callSign().text().toString();
                }
                else {
                    return "None";
                }
            });
            self.serverText = ko.pureComputed(function () {
                if (self.server() && self.server().displayName()) {
                    return self.server().displayName().toString();
                }
                else {
                    return "None";
                }
            });
            self.showCallSignEditor = function (callback) {
                if (!self.callSign()) {
                    self.callSign(new ViewModels.CallSign());
                }
                self.callSign().showEditor(callback);
            };
            self.showServerEditor = function (callback) {
                if (!self.server()) {
                    self.server(new ViewModels.Server());
                }
                self.server().showEditor(callback);
            };
            // This stuff needs to be done after everything else is set up.
            self.transmissionDateTimeStart.subscribe(self.autoSave);
            self.transmissionDateTimeEnd.subscribe(self.autoSave);
            self.callSignId.subscribe(self.autoSave);
            self.callSign.subscribe(self.autoSave);
            self.serverId.subscribe(self.autoSave);
            self.server.subscribe(self.autoSave);
            self.talkGroup.subscribe(self.autoSave);
            self.lossRate.subscribe(self.autoSave);
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
            return _this;
        }
        return VoiceTransmission;
    }(Coalesce.BaseViewModel));
    /** Behavioral configuration for all instances of VoiceTransmission. Can be overidden on each instance via instance.coalesceConfig. */
    VoiceTransmission.coalesceConfig = new Coalesce.ViewModelConfiguration(Coalesce.GlobalConfiguration.viewModel);
    ViewModels.VoiceTransmission = VoiceTransmission;
})(ViewModels || (ViewModels = {}));
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: VoiceTransmission
// Generated by IntelliTect.Coalesce
var ListViewModels;
/// <reference path="../coalesce.dependencies.d.ts" />
// Knockout List View Model for: VoiceTransmission
// Generated by IntelliTect.Coalesce
(function (ListViewModels) {
    var VoiceTransmissionDataSources;
    (function (VoiceTransmissionDataSources) {
        var Default = (function (_super) {
            __extends(Default, _super);
            function Default() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Default;
        }(Coalesce.DataSource));
        VoiceTransmissionDataSources.Default = Default;
    })(VoiceTransmissionDataSources = ListViewModels.VoiceTransmissionDataSources || (ListViewModels.VoiceTransmissionDataSources = {}));
    var VoiceTransmissionList = (function (_super) {
        __extends(VoiceTransmissionList, _super);
        function VoiceTransmissionList() {
            var _this = _super.call(this) || this;
            _this.modelName = "VoiceTransmission";
            _this.apiController = "/VoiceTransmission";
            _this.modelKeyName = "voiceTransmissionId";
            _this.itemClass = ViewModels.VoiceTransmission;
            _this.filter = null;
            /**
                The namespace containing all possible values of this.dataSource.
            */
            _this.dataSources = VoiceTransmissionDataSources;
            /**
                The data source on the server to use when retrieving objects.
                Valid values are in this.dataSources.
            */
            _this.dataSource = new _this.dataSources.Default();
            _this.coalesceConfig = new Coalesce.ListViewModelConfiguration(VoiceTransmissionList.coalesceConfig);
            _this.createItem = function (newItem, parent) { return new ViewModels.VoiceTransmission(newItem, parent); };
            return _this;
        }
        return VoiceTransmissionList;
    }(Coalesce.BaseListViewModel));
    VoiceTransmissionList.coalesceConfig = new Coalesce.ListViewModelConfiguration(Coalesce.GlobalConfiguration.listViewModel);
    ListViewModels.VoiceTransmissionList = VoiceTransmissionList;
})(ListViewModels || (ListViewModels = {}));

//# sourceMappingURL=app.js.map
