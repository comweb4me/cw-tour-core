(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/router'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('ngx-tour-core', ['exports', '@angular/common', '@angular/core', '@angular/router', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['ngx-tour-core'] = {}, global.ng.common, global.ng.core, global.ng.router, global.rxjs, global.rxjs.operators));
}(this, function (exports, common, core, router, rxjs, operators) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function IStepOption() { }
    if (false) {
        /** @type {?|undefined} */
        IStepOption.prototype.stepId;
        /** @type {?|undefined} */
        IStepOption.prototype.anchorId;
        /** @type {?|undefined} */
        IStepOption.prototype.title;
        /** @type {?|undefined} */
        IStepOption.prototype.content;
        /** @type {?|undefined} */
        IStepOption.prototype.route;
        /** @type {?|undefined} */
        IStepOption.prototype.nextStep;
        /** @type {?|undefined} */
        IStepOption.prototype.prevStep;
        /** @type {?|undefined} */
        IStepOption.prototype.placement;
        /** @type {?|undefined} */
        IStepOption.prototype.preventScrolling;
        /** @type {?|undefined} */
        IStepOption.prototype.prevBtnTitle;
        /** @type {?|undefined} */
        IStepOption.prototype.nextBtnTitle;
        /** @type {?|undefined} */
        IStepOption.prototype.endBtnTitle;
    }
    /** @enum {number} */
    var TourState = {
        OFF: 0,
        ON: 1,
        PAUSED: 2,
    };
    TourState[TourState.OFF] = 'OFF';
    TourState[TourState.ON] = 'ON';
    TourState[TourState.PAUSED] = 'PAUSED';
    /** @enum {number} */
    var TourDirection = {
        None: 0,
        Next: 1,
        Previous: 2,
    };
    TourDirection[TourDirection.None] = 'None';
    TourDirection[TourDirection.Next] = 'Next';
    TourDirection[TourDirection.Previous] = 'Previous';
    /**
     * @template T
     */
    var TourService = /** @class */ (function () {
        function TourService(router) {
            this.router = router;
            this.stepShow$ = new rxjs.Subject();
            this.stepHide$ = new rxjs.Subject();
            this.initialize$ = new rxjs.Subject();
            this.start$ = new rxjs.Subject();
            this.end$ = new rxjs.Subject();
            this.pause$ = new rxjs.Subject();
            this.resume$ = new rxjs.Subject();
            this.anchorRegister$ = new rxjs.Subject();
            this.anchorUnregister$ = new rxjs.Subject();
            this.events$ = rxjs.merge(this.stepShow$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'stepShow', value: value }); }))), this.stepHide$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'stepHide', value: value }); }))), this.initialize$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'initialize', value: value }); }))), this.start$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'start', value: value }); }))), this.end$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'end', value: value }); }))), this.pause$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'pause', value: value }); }))), this.resume$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({ name: 'resume', value: value }); }))), this.anchorRegister$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({
                name: 'anchorRegister',
                value: value
            }); }))), this.anchorUnregister$.pipe(operators.map((/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return ({
                name: 'anchorUnregister',
                value: value
            }); }))));
            this.steps = [];
            this.anchors = {};
            this.status = TourState.OFF;
            this.isHotKeysEnabled = true;
            this.direction = TourDirection.Next;
        }
        /**
         * @param {?} steps
         * @param {?=} stepDefaults
         * @return {?}
         */
        TourService.prototype.initialize = /**
         * @param {?} steps
         * @param {?=} stepDefaults
         * @return {?}
         */
        function (steps, stepDefaults) {
            if (steps && steps.length > 0) {
                this.status = TourState.OFF;
                this.steps = steps.map((/**
                 * @param {?} step
                 * @return {?}
                 */
                function (step) { return Object.assign({}, stepDefaults, step); }));
                this.initialize$.next(this.steps);
            }
        };
        /**
         * @return {?}
         */
        TourService.prototype.disableHotkeys = /**
         * @return {?}
         */
        function () {
            this.isHotKeysEnabled = false;
        };
        /**
         * @return {?}
         */
        TourService.prototype.enableHotkeys = /**
         * @return {?}
         */
        function () {
            this.isHotKeysEnabled = true;
        };
        /**
         * @return {?}
         */
        TourService.prototype.start = /**
         * @return {?}
         */
        function () {
            this.startAt(0);
        };
        /**
         * @param {?} stepId
         * @return {?}
         */
        TourService.prototype.startAt = /**
         * @param {?} stepId
         * @return {?}
         */
        function (stepId) {
            var _this = this;
            this.status = TourState.ON;
            this.goToStep(this.loadStep(stepId));
            this.start$.next();
            this.router.events
                .pipe(operators.filter((/**
             * @param {?} event
             * @return {?}
             */
            function (event) { return event instanceof router.NavigationStart; })), operators.first())
                .subscribe((/**
             * @return {?}
             */
            function () {
                if (_this.currentStep && _this.currentStep.hasOwnProperty('route')) {
                    _this.hideStep(_this.currentStep);
                }
            }));
        };
        /**
         * @return {?}
         */
        TourService.prototype.end = /**
         * @return {?}
         */
        function () {
            this.status = TourState.OFF;
            this.hideStep(this.currentStep);
            this.currentStep = undefined;
            this.end$.next();
            this.direction = TourDirection.Next;
        };
        /**
         * @return {?}
         */
        TourService.prototype.pause = /**
         * @return {?}
         */
        function () {
            this.status = TourState.PAUSED;
            this.hideStep(this.currentStep);
            this.pause$.next();
        };
        /**
         * @return {?}
         */
        TourService.prototype.resume = /**
         * @return {?}
         */
        function () {
            this.status = TourState.ON;
            this.showStep(this.currentStep);
            this.resume$.next();
        };
        /**
         * @param {?=} pause
         * @return {?}
         */
        TourService.prototype.toggle = /**
         * @param {?=} pause
         * @return {?}
         */
        function (pause) {
            if (pause) {
                if (this.currentStep) {
                    this.pause();
                }
                else {
                    this.resume();
                }
            }
            else {
                if (this.currentStep) {
                    this.end();
                }
                else {
                    this.start();
                }
            }
        };
        /**
         * @return {?}
         */
        TourService.prototype.next = /**
         * @return {?}
         */
        function () {
            this.direction = TourDirection.Next;
            if (this.hasNext(this.currentStep)) {
                this.goToStep(this.loadStep(this.currentStep.nextStep || this.steps.indexOf(this.currentStep) + 1));
            }
            else {
                this.end();
                return;
            }
        };
        /**
         * @param {?} step
         * @return {?}
         */
        TourService.prototype.hasNext = /**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            if (!step) {
                // console.warn('Can\'t get next step. No currentStep.');
                return false;
            }
            return (step.nextStep !== undefined ||
                this.steps.indexOf(step) < this.steps.length - 1);
        };
        /**
         * @return {?}
         */
        TourService.prototype.prev = /**
         * @return {?}
         */
        function () {
            this.direction = TourDirection.Previous;
            if (this.hasPrev(this.currentStep)) {
                this.goToStep(this.loadStep(this.currentStep.prevStep || this.steps.indexOf(this.currentStep) - 1));
            }
            else {
                this.end();
                return;
            }
        };
        /**
         * @param {?} step
         * @return {?}
         */
        TourService.prototype.hasPrev = /**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            if (!step) {
                // console.warn('Can\'t get previous step. No currentStep.');
                return false;
            }
            return step.prevStep !== undefined || this.steps.indexOf(step) > 0;
        };
        /**
         * @param {?} stepId
         * @return {?}
         */
        TourService.prototype.goto = /**
         * @param {?} stepId
         * @return {?}
         */
        function (stepId) {
            this.goToStep(this.loadStep(stepId));
        };
        /**
         * @param {?} anchorId
         * @param {?} anchor
         * @return {?}
         */
        TourService.prototype.register = /**
         * @param {?} anchorId
         * @param {?} anchor
         * @return {?}
         */
        function (anchorId, anchor) {
            if (!anchorId)
                return;
            if (this.anchors[anchorId]) {
                throw new Error('anchorId ' + anchorId + ' already registered!');
            }
            this.anchors[anchorId] = anchor;
            this.anchorRegister$.next(anchorId);
        };
        /**
         * @param {?} anchorId
         * @return {?}
         */
        TourService.prototype.unregister = /**
         * @param {?} anchorId
         * @return {?}
         */
        function (anchorId) {
            if (!anchorId)
                return;
            delete this.anchors[anchorId];
            this.anchorUnregister$.next(anchorId);
        };
        /**
         * @return {?}
         */
        TourService.prototype.getStatus = /**
         * @return {?}
         */
        function () {
            return this.status;
        };
        /**
         * @return {?}
         */
        TourService.prototype.isHotkeysEnabled = /**
         * @return {?}
         */
        function () {
            return this.isHotKeysEnabled;
        };
        /**
         * @private
         * @param {?} step
         * @return {?}
         */
        TourService.prototype.goToStep = /**
         * @private
         * @param {?} step
         * @return {?}
         */
        function (step) {
            var _this = this;
            if (!step) {
                // console.warn('Can\'t go to non-existent step');
                this.end();
                return;
            }
            /** @type {?} */
            var navigatePromise = new Promise((/**
             * @param {?} resolve
             * @return {?}
             */
            function (resolve) {
                return resolve(true);
            }));
            if (step.route !== undefined && typeof step.route === 'string') {
                navigatePromise = this.router.navigateByUrl(step.route);
            }
            else if (step.route && Array.isArray(step.route)) {
                navigatePromise = this.router.navigate(step.route);
            }
            navigatePromise.then((/**
             * @param {?} navigated
             * @return {?}
             */
            function (navigated) {
                if (navigated !== false) {
                    setTimeout((/**
                     * @return {?}
                     */
                    function () { return _this.setCurrentStep(step); }));
                }
            }));
        };
        /**
         * @private
         * @param {?} stepId
         * @return {?}
         */
        TourService.prototype.loadStep = /**
         * @private
         * @param {?} stepId
         * @return {?}
         */
        function (stepId) {
            if (typeof stepId === 'number') {
                return this.steps[stepId];
            }
            else {
                return this.steps.find((/**
                 * @param {?} step
                 * @return {?}
                 */
                function (step) { return step.stepId === stepId; }));
            }
        };
        /**
         * @private
         * @param {?} step
         * @return {?}
         */
        TourService.prototype.setCurrentStep = /**
         * @private
         * @param {?} step
         * @return {?}
         */
        function (step) {
            var _this = this;
            if (this.currentStep) {
                this.hideStep(this.currentStep);
            }
            this.currentStep = step;
            this.showStep(this.currentStep);
            this.router.events
                .pipe(operators.filter((/**
             * @param {?} event
             * @return {?}
             */
            function (event) { return event instanceof router.NavigationStart; })), operators.first())
                .subscribe((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                if (_this.currentStep && _this.currentStep.hasOwnProperty('route')) {
                    _this.hideStep(_this.currentStep);
                }
            }));
        };
        /**
         * @private
         * @param {?} step
         * @return {?}
         */
        TourService.prototype.showStep = /**
         * @private
         * @param {?} step
         * @return {?}
         */
        function (step) {
            /** @type {?} */
            var anchor = this.anchors[step && step.anchorId];
            if (!anchor) {
                /** @type {?} */
                var stepIndex = this.steps.indexOf(step);
                this.skipStep();
            }
            else {
                anchor.showTourStep(step);
                this.stepShow$.next(step);
            }
        };
        /**
         * @protected
         * @param {?} step
         * @return {?}
         */
        TourService.prototype.hideStep = /**
         * @protected
         * @param {?} step
         * @return {?}
         */
        function (step) {
            /** @type {?} */
            var anchor = this.anchors[step && step.anchorId];
            if (!anchor) {
                return;
            }
            anchor.hideTourStep();
            this.stepHide$.next(step);
        };
        /**
         * @private
         * @return {?}
         */
        TourService.prototype.skipStep = /**
         * @private
         * @return {?}
         */
        function () {
            switch (this.direction) {
                case TourDirection.Next: {
                    this.next();
                    break;
                }
                case TourDirection.Previous: {
                    this.prev();
                    break;
                }
            }
        };
        TourService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TourService.ctorParameters = function () { return [
            { type: router.Router }
        ]; };
        return TourService;
    }());
    if (false) {
        /** @type {?} */
        TourService.prototype.stepShow$;
        /** @type {?} */
        TourService.prototype.stepHide$;
        /** @type {?} */
        TourService.prototype.initialize$;
        /** @type {?} */
        TourService.prototype.start$;
        /** @type {?} */
        TourService.prototype.end$;
        /** @type {?} */
        TourService.prototype.pause$;
        /** @type {?} */
        TourService.prototype.resume$;
        /** @type {?} */
        TourService.prototype.anchorRegister$;
        /** @type {?} */
        TourService.prototype.anchorUnregister$;
        /** @type {?} */
        TourService.prototype.events$;
        /** @type {?} */
        TourService.prototype.steps;
        /** @type {?} */
        TourService.prototype.currentStep;
        /** @type {?} */
        TourService.prototype.anchors;
        /**
         * @type {?}
         * @private
         */
        TourService.prototype.status;
        /**
         * @type {?}
         * @private
         */
        TourService.prototype.isHotKeysEnabled;
        /**
         * @type {?}
         * @private
         */
        TourService.prototype.direction;
        /**
         * @type {?}
         * @private
         */
        TourService.prototype.router;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var TourHotkeyListenerComponent = /** @class */ (function () {
        function TourHotkeyListenerComponent(tourService) {
            this.tourService = tourService;
        }
        /**
         * Configures hot keys for controlling the tour with the keyboard
         */
        /**
         * Configures hot keys for controlling the tour with the keyboard
         * @return {?}
         */
        TourHotkeyListenerComponent.prototype.onEscapeKey = /**
         * Configures hot keys for controlling the tour with the keyboard
         * @return {?}
         */
        function () {
            if (this.tourService.getStatus() === TourState.ON &&
                this.tourService.isHotkeysEnabled()) {
                this.tourService.end();
            }
        };
        /**
         * @return {?}
         */
        TourHotkeyListenerComponent.prototype.onArrowRightKey = /**
         * @return {?}
         */
        function () {
            if (this.tourService.getStatus() === TourState.ON &&
                this.tourService.hasNext(this.tourService.currentStep) &&
                this.tourService.isHotkeysEnabled()) {
                this.tourService.next();
            }
        };
        /**
         * @return {?}
         */
        TourHotkeyListenerComponent.prototype.onArrowLeftKey = /**
         * @return {?}
         */
        function () {
            if (this.tourService.getStatus() === TourState.ON &&
                this.tourService.hasPrev(this.tourService.currentStep) &&
                this.tourService.isHotkeysEnabled()) {
                this.tourService.prev();
            }
        };
        TourHotkeyListenerComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'tour-hotkey-listener',
                        template: "<ng-content></ng-content>"
                    }] }
        ];
        /** @nocollapse */
        TourHotkeyListenerComponent.ctorParameters = function () { return [
            { type: TourService }
        ]; };
        TourHotkeyListenerComponent.propDecorators = {
            onEscapeKey: [{ type: core.HostListener, args: ['window:keydown.Escape',] }],
            onArrowRightKey: [{ type: core.HostListener, args: ['window:keydown.ArrowRight',] }],
            onArrowLeftKey: [{ type: core.HostListener, args: ['window:keydown.ArrowLeft',] }]
        };
        return TourHotkeyListenerComponent;
    }());
    if (false) {
        /** @type {?} */
        TourHotkeyListenerComponent.prototype.tourService;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var TourModule = /** @class */ (function () {
        function TourModule() {
        }
        /**
         * @return {?}
         */
        TourModule.forRoot = /**
         * @return {?}
         */
        function () {
            return {
                ngModule: TourModule,
                providers: [
                    TourService,
                ],
            };
        };
        TourModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [TourHotkeyListenerComponent],
                        exports: [TourHotkeyListenerComponent],
                        imports: [common.CommonModule, router.RouterModule],
                    },] }
        ];
        return TourModule;
    }());
    ;

    exports.TourHotkeyListenerComponent = TourHotkeyListenerComponent;
    exports.TourModule = TourModule;
    exports.TourService = TourService;
    exports.TourState = TourState;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-tour-core.umd.js.map
