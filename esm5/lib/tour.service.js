/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject, merge as mergeStatic } from 'rxjs';
import { first, map, filter } from 'rxjs/operators';
/**
 * @record
 */
export function IStepOption() { }
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
export { TourState };
TourState[TourState.OFF] = 'OFF';
TourState[TourState.ON] = 'ON';
TourState[TourState.PAUSED] = 'PAUSED';
/** @enum {number} */
var TourDirection = {
    None: 0,
    Next: 1,
    Previous: 2,
};
export { TourDirection };
TourDirection[TourDirection.None] = 'None';
TourDirection[TourDirection.Next] = 'Next';
TourDirection[TourDirection.Previous] = 'Previous';
/**
 * @template T
 */
var TourService = /** @class */ (function () {
    function TourService(router) {
        this.router = router;
        this.stepShow$ = new Subject();
        this.stepHide$ = new Subject();
        this.initialize$ = new Subject();
        this.start$ = new Subject();
        this.end$ = new Subject();
        this.pause$ = new Subject();
        this.resume$ = new Subject();
        this.anchorRegister$ = new Subject();
        this.anchorUnregister$ = new Subject();
        this.events$ = mergeStatic(this.stepShow$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'stepShow', value: value }); }))), this.stepHide$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'stepHide', value: value }); }))), this.initialize$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'initialize', value: value }); }))), this.start$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'start', value: value }); }))), this.end$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'end', value: value }); }))), this.pause$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'pause', value: value }); }))), this.resume$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({ name: 'resume', value: value }); }))), this.anchorRegister$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return ({
            name: 'anchorRegister',
            value: value
        }); }))), this.anchorUnregister$.pipe(map((/**
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
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return event instanceof NavigationStart; })), first())
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
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return event instanceof NavigationStart; })), first())
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
        { type: Injectable }
    ];
    /** @nocollapse */
    TourService.ctorParameters = function () { return [
        { type: Router }
    ]; };
    return TourService;
}());
export { TourService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXRvdXItY29yZS8iLCJzb3VyY2VzIjpbImxpYi90b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUd0RSxPQUFPLEVBQUUsT0FBTyxFQUFjLEtBQUssSUFBSSxXQUFXLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFFcEQsaUNBYUM7OztJQVpDLDZCQUFnQjs7SUFDaEIsK0JBQWtCOztJQUNsQiw0QkFBZTs7SUFDZiw4QkFBaUI7O0lBQ2pCLDRCQUE4Qjs7SUFDOUIsK0JBQTJCOztJQUMzQiwrQkFBMkI7O0lBQzNCLGdDQUFnQjs7SUFDaEIsdUNBQTJCOztJQUMzQixtQ0FBc0I7O0lBQ3RCLG1DQUFzQjs7SUFDdEIsa0NBQXFCOzs7O0lBSXJCLE1BQUc7SUFDSCxLQUFFO0lBQ0YsU0FBTTs7Ozs7Ozs7SUFJTixPQUFRO0lBQ1IsT0FBUTtJQUNSLFdBQVk7Ozs7Ozs7OztBQUdkO0lBeUNFLHFCQUNVLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBeENqQixjQUFTLEdBQWUsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN0QyxjQUFTLEdBQWUsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN0QyxnQkFBVyxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzFDLFdBQU0sR0FBZSxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ25DLFNBQUksR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNuQyxXQUFNLEdBQWUsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNuQyxZQUFPLEdBQWUsSUFBSSxP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LElBQUksQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7Ozs7O0lBRVMsOEJBQVE7Ozs7O0lBQWxCLFVBQW1CLElBQU87O1lBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2xELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPO1NBQ1I7UUFDRCxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Ozs7SUFFTyw4QkFBUTs7OztJQUFoQjtRQUNFLFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixLQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE1BQU07YUFDUDtZQUNELEtBQUssYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osTUFBTTthQUNQO1NBQ0Y7SUFDSCxDQUFDOztnQkF6UUYsVUFBVTs7OztnQkFqQ2UsTUFBTTs7SUEyU2hDLGtCQUFDO0NBQUEsQUExUUQsSUEwUUM7U0F6UVksV0FBVzs7O0lBQ3RCLGdDQUE2Qzs7SUFDN0MsZ0NBQTZDOztJQUM3QyxrQ0FBaUQ7O0lBQ2pELDZCQUEwQzs7SUFDMUMsMkJBQTBDOztJQUMxQyw2QkFBMEM7O0lBQzFDLDhCQUEyQzs7SUFDM0Msc0NBQXdEOztJQUN4RCx3Q0FBMEQ7O0lBQzFELDhCQW9CRTs7SUFFRiw0QkFBdUI7O0lBQ3ZCLGtDQUFzQjs7SUFFdEIsOEJBQWlFOzs7OztJQUNqRSw2QkFBMEM7Ozs7O0lBQzFDLHVDQUFnQzs7Ozs7SUFDaEMsZ0NBQXNEOzs7OztJQUdwRCw2QkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5hdmlnYXRpb25TdGFydCwgUm91dGVyLCBVcmxTZWdtZW50IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbmltcG9ydCB7IFRvdXJBbmNob3JEaXJlY3RpdmUgfSBmcm9tICcuL3RvdXItYW5jaG9yLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIG1lcmdlIGFzIG1lcmdlU3RhdGljIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpcnN0LCBtYXAsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN0ZXBPcHRpb24ge1xyXG4gIHN0ZXBJZD86IHN0cmluZztcclxuICBhbmNob3JJZD86IHN0cmluZztcclxuICB0aXRsZT86IHN0cmluZztcclxuICBjb250ZW50Pzogc3RyaW5nO1xyXG4gIHJvdXRlPzogc3RyaW5nIHwgVXJsU2VnbWVudFtdO1xyXG4gIG5leHRTdGVwPzogbnVtYmVyIHwgc3RyaW5nO1xyXG4gIHByZXZTdGVwPzogbnVtYmVyIHwgc3RyaW5nO1xyXG4gIHBsYWNlbWVudD86IGFueTtcclxuICBwcmV2ZW50U2Nyb2xsaW5nPzogYm9vbGVhbjtcclxuICBwcmV2QnRuVGl0bGU/OiBzdHJpbmc7XHJcbiAgbmV4dEJ0blRpdGxlPzogc3RyaW5nO1xyXG4gIGVuZEJ0blRpdGxlPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBUb3VyU3RhdGUge1xyXG4gIE9GRixcclxuICBPTixcclxuICBQQVVTRURcclxufVxyXG5cclxuZXhwb3J0IGVudW0gVG91ckRpcmVjdGlvbiB7XHJcbiAgTm9uZSA9IDAsXHJcbiAgTmV4dCA9IDEsXHJcbiAgUHJldmlvdXMgPSAyXHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRvdXJTZXJ2aWNlPFQgZXh0ZW5kcyBJU3RlcE9wdGlvbiA9IElTdGVwT3B0aW9uPiB7XHJcbiAgcHVibGljIHN0ZXBTaG93JDogU3ViamVjdDxUPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIHN0ZXBIaWRlJDogU3ViamVjdDxUPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIGluaXRpYWxpemUkOiBTdWJqZWN0PFRbXT4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyBzdGFydCQ6IFN1YmplY3Q8VD4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyBlbmQkOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyBwYXVzZSQ6IFN1YmplY3Q8VD4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyByZXN1bWUkOiBTdWJqZWN0PFQ+ID0gbmV3IFN1YmplY3QoKTtcclxuICBwdWJsaWMgYW5jaG9yUmVnaXN0ZXIkOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyBhbmNob3JVbnJlZ2lzdGVyJDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcclxuICBwdWJsaWMgZXZlbnRzJDogT2JzZXJ2YWJsZTx7IG5hbWU6IHN0cmluZzsgdmFsdWU6IGFueSB9PiA9IG1lcmdlU3RhdGljKFxyXG4gICAgdGhpcy5zdGVwU2hvdyQucGlwZShtYXAodmFsdWUgPT4gKHsgbmFtZTogJ3N0ZXBTaG93JywgdmFsdWUgfSkpKSxcclxuICAgIHRoaXMuc3RlcEhpZGUkLnBpcGUobWFwKHZhbHVlID0+ICh7IG5hbWU6ICdzdGVwSGlkZScsIHZhbHVlIH0pKSksXHJcbiAgICB0aGlzLmluaXRpYWxpemUkLnBpcGUobWFwKHZhbHVlID0+ICh7IG5hbWU6ICdpbml0aWFsaXplJywgdmFsdWUgfSkpKSxcclxuICAgIHRoaXMuc3RhcnQkLnBpcGUobWFwKHZhbHVlID0+ICh7IG5hbWU6ICdzdGFydCcsIHZhbHVlIH0pKSksXHJcbiAgICB0aGlzLmVuZCQucGlwZShtYXAodmFsdWUgPT4gKHsgbmFtZTogJ2VuZCcsIHZhbHVlIH0pKSksXHJcbiAgICB0aGlzLnBhdXNlJC5waXBlKG1hcCh2YWx1ZSA9PiAoeyBuYW1lOiAncGF1c2UnLCB2YWx1ZSB9KSkpLFxyXG4gICAgdGhpcy5yZXN1bWUkLnBpcGUobWFwKHZhbHVlID0+ICh7IG5hbWU6ICdyZXN1bWUnLCB2YWx1ZSB9KSkpLFxyXG4gICAgdGhpcy5hbmNob3JSZWdpc3RlciQucGlwZShcclxuICAgICAgbWFwKHZhbHVlID0+ICh7XHJcbiAgICAgICAgbmFtZTogJ2FuY2hvclJlZ2lzdGVyJyxcclxuICAgICAgICB2YWx1ZVxyXG4gICAgICB9KSlcclxuICAgICksXHJcbiAgICB0aGlzLmFuY2hvclVucmVnaXN0ZXIkLnBpcGUoXHJcbiAgICAgIG1hcCh2YWx1ZSA9PiAoe1xyXG4gICAgICAgIG5hbWU6ICdhbmNob3JVbnJlZ2lzdGVyJyxcclxuICAgICAgICB2YWx1ZVxyXG4gICAgICB9KSlcclxuICAgIClcclxuICApO1xyXG5cclxuICBwdWJsaWMgc3RlcHM6IFRbXSA9IFtdO1xyXG4gIHB1YmxpYyBjdXJyZW50U3RlcDogVDtcclxuXHJcbiAgcHVibGljIGFuY2hvcnM6IHsgW2FuY2hvcklkOiBzdHJpbmddOiBUb3VyQW5jaG9yRGlyZWN0aXZlIH0gPSB7fTtcclxuICBwcml2YXRlIHN0YXR1czogVG91clN0YXRlID0gVG91clN0YXRlLk9GRjtcclxuICBwcml2YXRlIGlzSG90S2V5c0VuYWJsZWQgPSB0cnVlO1xyXG4gIHByaXZhdGUgZGlyZWN0aW9uOiBUb3VyRGlyZWN0aW9uID0gVG91ckRpcmVjdGlvbi5OZXh0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgKSB7IH1cclxuXHJcbiAgcHVibGljIGluaXRpYWxpemUoc3RlcHM6IFRbXSwgc3RlcERlZmF1bHRzPzogVCk6IHZvaWQge1xyXG4gICAgaWYgKHN0ZXBzICYmIHN0ZXBzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuT0ZGO1xyXG4gICAgICB0aGlzLnN0ZXBzID0gc3RlcHMubWFwKHN0ZXAgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RlcERlZmF1bHRzLCBzdGVwKSk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSQubmV4dCh0aGlzLnN0ZXBzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkaXNhYmxlSG90a2V5cygpOiB2b2lkIHtcclxuICAgIHRoaXMuaXNIb3RLZXlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGVuYWJsZUhvdGtleXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmlzSG90S2V5c0VuYWJsZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdGFydEF0KDApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXJ0QXQoc3RlcElkOiBudW1iZXIgfCBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc3RhdHVzID0gVG91clN0YXRlLk9OO1xyXG4gICAgdGhpcy5nb1RvU3RlcCh0aGlzLmxvYWRTdGVwKHN0ZXBJZCkpO1xyXG4gICAgdGhpcy5zdGFydCQubmV4dCgpO1xyXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXHJcbiAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCksIGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGVwICYmIHRoaXMuY3VycmVudFN0ZXAuaGFzT3duUHJvcGVydHkoJ3JvdXRlJykpIHtcclxuICAgICAgICAgIHRoaXMuaGlkZVN0ZXAodGhpcy5jdXJyZW50U3RlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlbmQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXR1cyA9IFRvdXJTdGF0ZS5PRkY7XHJcbiAgICB0aGlzLmhpZGVTdGVwKHRoaXMuY3VycmVudFN0ZXApO1xyXG4gICAgdGhpcy5jdXJyZW50U3RlcCA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuZW5kJC5uZXh0KCk7XHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IFRvdXJEaXJlY3Rpb24uTmV4dDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwYXVzZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc3RhdHVzID0gVG91clN0YXRlLlBBVVNFRDtcclxuICAgIHRoaXMuaGlkZVN0ZXAodGhpcy5jdXJyZW50U3RlcCk7XHJcbiAgICB0aGlzLnBhdXNlJC5uZXh0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzdW1lKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuT047XHJcbiAgICB0aGlzLnNob3dTdGVwKHRoaXMuY3VycmVudFN0ZXApO1xyXG4gICAgdGhpcy5yZXN1bWUkLm5leHQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b2dnbGUocGF1c2U/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAocGF1c2UpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFN0ZXApIHtcclxuICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZXN1bWUoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFN0ZXApIHtcclxuICAgICAgICB0aGlzLmVuZCgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG5leHQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IFRvdXJEaXJlY3Rpb24uTmV4dDtcclxuICAgIGlmICh0aGlzLmhhc05leHQodGhpcy5jdXJyZW50U3RlcCkpIHtcclxuICAgICAgdGhpcy5nb1RvU3RlcChcclxuICAgICAgICB0aGlzLmxvYWRTdGVwKFxyXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3RlcC5uZXh0U3RlcCB8fCB0aGlzLnN0ZXBzLmluZGV4T2YodGhpcy5jdXJyZW50U3RlcCkgKyAxXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbmQoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhc05leHQoc3RlcDogVCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCFzdGVwKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUud2FybignQ2FuXFwndCBnZXQgbmV4dCBzdGVwLiBObyBjdXJyZW50U3RlcC4nKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgc3RlcC5uZXh0U3RlcCAhPT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgIHRoaXMuc3RlcHMuaW5kZXhPZihzdGVwKSA8IHRoaXMuc3RlcHMubGVuZ3RoIC0gMVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwcmV2KCk6IHZvaWQge1xyXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBUb3VyRGlyZWN0aW9uLlByZXZpb3VzO1xyXG4gICAgaWYgKHRoaXMuaGFzUHJldih0aGlzLmN1cnJlbnRTdGVwKSkge1xyXG4gICAgICB0aGlzLmdvVG9TdGVwKFxyXG4gICAgICAgIHRoaXMubG9hZFN0ZXAoXHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwLnByZXZTdGVwIHx8IHRoaXMuc3RlcHMuaW5kZXhPZih0aGlzLmN1cnJlbnRTdGVwKSAtIDFcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVuZCgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaGFzUHJldihzdGVwOiBUKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXN0ZXApIHtcclxuICAgICAgLy8gY29uc29sZS53YXJuKCdDYW5cXCd0IGdldCBwcmV2aW91cyBzdGVwLiBObyBjdXJyZW50U3RlcC4nKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0ZXAucHJldlN0ZXAgIT09IHVuZGVmaW5lZCB8fCB0aGlzLnN0ZXBzLmluZGV4T2Yoc3RlcCkgPiAwO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdvdG8oc3RlcElkOiBudW1iZXIgfCBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuZ29Ub1N0ZXAodGhpcy5sb2FkU3RlcChzdGVwSWQpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWdpc3RlcihhbmNob3JJZDogc3RyaW5nLCBhbmNob3I6IFRvdXJBbmNob3JEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgIGlmICghYW5jaG9ySWQpXHJcbiAgICAgIHJldHVybjtcclxuICAgIGlmICh0aGlzLmFuY2hvcnNbYW5jaG9ySWRdKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignYW5jaG9ySWQgJyArIGFuY2hvcklkICsgJyBhbHJlYWR5IHJlZ2lzdGVyZWQhJyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFuY2hvcnNbYW5jaG9ySWRdID0gYW5jaG9yO1xyXG4gICAgdGhpcy5hbmNob3JSZWdpc3RlciQubmV4dChhbmNob3JJZCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdW5yZWdpc3RlcihhbmNob3JJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBpZiAoIWFuY2hvcklkKVxyXG4gICAgICByZXR1cm47XHJcbiAgICBkZWxldGUgdGhpcy5hbmNob3JzW2FuY2hvcklkXTtcclxuICAgIHRoaXMuYW5jaG9yVW5yZWdpc3RlciQubmV4dChhbmNob3JJZCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0U3RhdHVzKCk6IFRvdXJTdGF0ZSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdGF0dXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNIb3RrZXlzRW5hYmxlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmlzSG90S2V5c0VuYWJsZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdvVG9TdGVwKHN0ZXA6IFQpOiB2b2lkIHtcclxuICAgIGlmICghc3RlcCkge1xyXG4gICAgICAvLyBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZ28gdG8gbm9uLWV4aXN0ZW50IHN0ZXAnKTtcclxuICAgICAgdGhpcy5lbmQoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG5hdmlnYXRlUHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT5cclxuICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgKTtcclxuICAgIGlmIChzdGVwLnJvdXRlICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHN0ZXAucm91dGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIG5hdmlnYXRlUHJvbWlzZSA9IHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoc3RlcC5yb3V0ZSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0ZXAucm91dGUgJiYgQXJyYXkuaXNBcnJheShzdGVwLnJvdXRlKSkge1xyXG4gICAgICBuYXZpZ2F0ZVByb21pc2UgPSB0aGlzLnJvdXRlci5uYXZpZ2F0ZShzdGVwLnJvdXRlKTtcclxuICAgIH1cclxuICAgIG5hdmlnYXRlUHJvbWlzZS50aGVuKG5hdmlnYXRlZCA9PiB7XHJcbiAgICAgIGlmIChuYXZpZ2F0ZWQgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldEN1cnJlbnRTdGVwKHN0ZXApKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxvYWRTdGVwKHN0ZXBJZDogbnVtYmVyIHwgc3RyaW5nKTogVCB7XHJcbiAgICBpZiAodHlwZW9mIHN0ZXBJZCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3RlcHNbc3RlcElkXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN0ZXBzLmZpbmQoc3RlcCA9PiBzdGVwLnN0ZXBJZCA9PT0gc3RlcElkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Q3VycmVudFN0ZXAoc3RlcDogVCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFN0ZXApIHtcclxuICAgICAgdGhpcy5oaWRlU3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcclxuICAgIH1cclxuICAgIHRoaXMuY3VycmVudFN0ZXAgPSBzdGVwO1xyXG4gICAgdGhpcy5zaG93U3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcclxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xyXG4gICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpLCBmaXJzdCgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGVwICYmIHRoaXMuY3VycmVudFN0ZXAuaGFzT3duUHJvcGVydHkoJ3JvdXRlJykpIHtcclxuICAgICAgICAgIHRoaXMuaGlkZVN0ZXAodGhpcy5jdXJyZW50U3RlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd1N0ZXAoc3RlcDogVCk6IHZvaWQge1xyXG4gICAgY29uc3QgYW5jaG9yID0gdGhpcy5hbmNob3JzW3N0ZXAgJiYgc3RlcC5hbmNob3JJZF07XHJcbiAgICBpZiAoIWFuY2hvcikge1xyXG4gICAgICBsZXQgc3RlcEluZGV4ID0gdGhpcy5zdGVwcy5pbmRleE9mKHN0ZXApO1xyXG4gICAgICB0aGlzLnNraXBTdGVwKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbmNob3Iuc2hvd1RvdXJTdGVwKHN0ZXApO1xyXG4gICAgICB0aGlzLnN0ZXBTaG93JC5uZXh0KHN0ZXApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhpZGVTdGVwKHN0ZXA6IFQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuYW5jaG9yc1tzdGVwICYmIHN0ZXAuYW5jaG9ySWRdO1xyXG4gICAgaWYgKCFhbmNob3IpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYW5jaG9yLmhpZGVUb3VyU3RlcCgpO1xyXG4gICAgdGhpcy5zdGVwSGlkZSQubmV4dChzdGVwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2tpcFN0ZXAoKSB7XHJcbiAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XHJcbiAgICAgIGNhc2UgVG91ckRpcmVjdGlvbi5OZXh0OiB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBUb3VyRGlyZWN0aW9uLlByZXZpb3VzOiB7XHJcbiAgICAgICAgdGhpcy5wcmV2KCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19