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
const TourState = {
    OFF: 0,
    ON: 1,
    PAUSED: 2,
};
export { TourState };
TourState[TourState.OFF] = 'OFF';
TourState[TourState.ON] = 'ON';
TourState[TourState.PAUSED] = 'PAUSED';
/** @enum {number} */
const TourDirection = {
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
export class TourService {
    /**
     * @param {?} router
     */
    constructor(router) {
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
        value => ({ name: 'stepShow', value })))), this.stepHide$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({ name: 'stepHide', value })))), this.initialize$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({ name: 'initialize', value })))), this.start$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({ name: 'start', value })))), this.end$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({ name: 'end', value })))), this.pause$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({ name: 'pause', value })))), this.resume$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({ name: 'resume', value })))), this.anchorRegister$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({
            name: 'anchorRegister',
            value
        })))), this.anchorUnregister$.pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => ({
            name: 'anchorUnregister',
            value
        })))));
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
    initialize(steps, stepDefaults) {
        if (steps && steps.length > 0) {
            this.status = TourState.OFF;
            this.steps = steps.map((/**
             * @param {?} step
             * @return {?}
             */
            step => Object.assign({}, stepDefaults, step)));
            this.initialize$.next(this.steps);
        }
    }
    /**
     * @return {?}
     */
    disableHotkeys() {
        this.isHotKeysEnabled = false;
    }
    /**
     * @return {?}
     */
    enableHotkeys() {
        this.isHotKeysEnabled = true;
    }
    /**
     * @return {?}
     */
    start() {
        this.startAt(0);
    }
    /**
     * @param {?} stepId
     * @return {?}
     */
    startAt(stepId) {
        this.status = TourState.ON;
        this.goToStep(this.loadStep(stepId));
        this.start$.next();
        this.router.events
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event instanceof NavigationStart)), first())
            .subscribe((/**
         * @return {?}
         */
        () => {
            if (this.currentStep && this.currentStep.hasOwnProperty('route')) {
                this.hideStep(this.currentStep);
            }
        }));
    }
    /**
     * @return {?}
     */
    end() {
        this.status = TourState.OFF;
        this.hideStep(this.currentStep);
        this.currentStep = undefined;
        this.end$.next();
        this.direction = TourDirection.Next;
    }
    /**
     * @return {?}
     */
    pause() {
        this.status = TourState.PAUSED;
        this.hideStep(this.currentStep);
        this.pause$.next();
    }
    /**
     * @return {?}
     */
    resume() {
        this.status = TourState.ON;
        this.showStep(this.currentStep);
        this.resume$.next();
    }
    /**
     * @param {?=} pause
     * @return {?}
     */
    toggle(pause) {
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
    }
    /**
     * @return {?}
     */
    next() {
        this.direction = TourDirection.Next;
        if (this.hasNext(this.currentStep)) {
            this.goToStep(this.loadStep(this.currentStep.nextStep || this.steps.indexOf(this.currentStep) + 1));
        }
        else {
            this.end();
            return;
        }
    }
    /**
     * @param {?} step
     * @return {?}
     */
    hasNext(step) {
        if (!step) {
            // console.warn('Can\'t get next step. No currentStep.');
            return false;
        }
        return (step.nextStep !== undefined ||
            this.steps.indexOf(step) < this.steps.length - 1);
    }
    /**
     * @return {?}
     */
    prev() {
        this.direction = TourDirection.Previous;
        if (this.hasPrev(this.currentStep)) {
            this.goToStep(this.loadStep(this.currentStep.prevStep || this.steps.indexOf(this.currentStep) - 1));
        }
        else {
            this.end();
            return;
        }
    }
    /**
     * @param {?} step
     * @return {?}
     */
    hasPrev(step) {
        if (!step) {
            // console.warn('Can\'t get previous step. No currentStep.');
            return false;
        }
        return step.prevStep !== undefined || this.steps.indexOf(step) > 0;
    }
    /**
     * @param {?} stepId
     * @return {?}
     */
    goto(stepId) {
        this.goToStep(this.loadStep(stepId));
    }
    /**
     * @param {?} anchorId
     * @param {?} anchor
     * @return {?}
     */
    register(anchorId, anchor) {
        if (!anchorId)
            return;
        if (this.anchors[anchorId]) {
            throw new Error('anchorId ' + anchorId + ' already registered!');
        }
        this.anchors[anchorId] = anchor;
        this.anchorRegister$.next(anchorId);
    }
    /**
     * @param {?} anchorId
     * @return {?}
     */
    unregister(anchorId) {
        if (!anchorId)
            return;
        delete this.anchors[anchorId];
        this.anchorUnregister$.next(anchorId);
    }
    /**
     * @return {?}
     */
    getStatus() {
        return this.status;
    }
    /**
     * @return {?}
     */
    isHotkeysEnabled() {
        return this.isHotKeysEnabled;
    }
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    goToStep(step) {
        if (!step) {
            // console.warn('Can\'t go to non-existent step');
            this.end();
            return;
        }
        /** @type {?} */
        let navigatePromise = new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => resolve(true)));
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
        navigated => {
            if (navigated !== false) {
                setTimeout((/**
                 * @return {?}
                 */
                () => this.setCurrentStep(step)));
            }
        }));
    }
    /**
     * @private
     * @param {?} stepId
     * @return {?}
     */
    loadStep(stepId) {
        if (typeof stepId === 'number') {
            return this.steps[stepId];
        }
        else {
            return this.steps.find((/**
             * @param {?} step
             * @return {?}
             */
            step => step.stepId === stepId));
        }
    }
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    setCurrentStep(step) {
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
        event => event instanceof NavigationStart)), first())
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (this.currentStep && this.currentStep.hasOwnProperty('route')) {
                this.hideStep(this.currentStep);
            }
        }));
    }
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    showStep(step) {
        /** @type {?} */
        const anchor = this.anchors[step && step.anchorId];
        if (!anchor) {
            /** @type {?} */
            let stepIndex = this.steps.indexOf(step);
            this.skipStep();
        }
        else {
            anchor.showTourStep(step);
            this.stepShow$.next(step);
        }
    }
    /**
     * @protected
     * @param {?} step
     * @return {?}
     */
    hideStep(step) {
        /** @type {?} */
        const anchor = this.anchors[step && step.anchorId];
        if (!anchor) {
            return;
        }
        anchor.hideTourStep();
        this.stepHide$.next(step);
    }
    /**
     * @private
     * @return {?}
     */
    skipStep() {
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
    }
}
TourService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TourService.ctorParameters = () => [
    { type: Router }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXRvdXItY29yZS8iLCJzb3VyY2VzIjpbImxpYi90b3VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUd0RSxPQUFPLEVBQUUsT0FBTyxFQUFjLEtBQUssSUFBSSxXQUFXLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFFcEQsaUNBYUM7OztJQVpDLDZCQUFnQjs7SUFDaEIsK0JBQWtCOztJQUNsQiw0QkFBZTs7SUFDZiw4QkFBaUI7O0lBQ2pCLDRCQUE4Qjs7SUFDOUIsK0JBQTJCOztJQUMzQiwrQkFBMkI7O0lBQzNCLGdDQUFnQjs7SUFDaEIsdUNBQTJCOztJQUMzQixtQ0FBc0I7O0lBQ3RCLG1DQUFzQjs7SUFDdEIsa0NBQXFCOzs7O0lBSXJCLE1BQUc7SUFDSCxLQUFFO0lBQ0YsU0FBTTs7Ozs7Ozs7SUFJTixPQUFRO0lBQ1IsT0FBUTtJQUNSLFdBQVk7Ozs7Ozs7OztBQUlkLE1BQU0sT0FBTyxXQUFXOzs7O0lBd0N0QixZQUNVLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBeENqQixjQUFTLEdBQWUsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN0QyxjQUFTLEdBQWUsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN0QyxnQkFBVyxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzFDLFdBQU0sR0FBZSxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ25DLFNBQUksR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNuQyxXQUFNLEdBQWUsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNu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QUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE1BQU07YUFDUDtTQUNGO0lBQ0gsQ0FBQzs7O1lBelFGLFVBQVU7Ozs7WUFqQ2UsTUFBTTs7OztJQW1DOUIsZ0NBQTZDOztJQUM3QyxnQ0FBNkM7O0lBQzdDLGtDQUFpRDs7SUFDakQsNkJBQTBDOztJQUMxQywyQkFBMEM7O0lBQzFDLDZCQUEwQzs7SUFDMUMsOEJBQTJDOztJQUMzQyxzQ0FBd0Q7O0lBQ3hELHdDQUEwRDs7SUFDMUQsOEJBb0JFOztJQUVGLDRCQUF1Qjs7SUFDdkIsa0NBQXNCOztJQUV0Qiw4QkFBaUU7Ozs7O0lBQ2pFLDZCQUEwQzs7Ozs7SUFDMUMsdUNBQWdDOzs7OztJQUNoQyxnQ0FBc0Q7Ozs7O0lBR3BELDZCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmF2aWdhdGlvblN0YXJ0LCBSb3V0ZXIsIFVybFNlZ21lbnQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5cclxuaW1wb3J0IHsgVG91ckFuY2hvckRpcmVjdGl2ZSB9IGZyb20gJy4vdG91ci1hbmNob3IuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgbWVyZ2UgYXMgbWVyZ2VTdGF0aWMgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlyc3QsIG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3RlcE9wdGlvbiB7XHJcbiAgc3RlcElkPzogc3RyaW5nO1xyXG4gIGFuY2hvcklkPzogc3RyaW5nO1xyXG4gIHRpdGxlPzogc3RyaW5nO1xyXG4gIGNvbnRlbnQ/OiBzdHJpbmc7XHJcbiAgcm91dGU/OiBzdHJpbmcgfCBVcmxTZWdtZW50W107XHJcbiAgbmV4dFN0ZXA/OiBudW1iZXIgfCBzdHJpbmc7XHJcbiAgcHJldlN0ZXA/OiBudW1iZXIgfCBzdHJpbmc7XHJcbiAgcGxhY2VtZW50PzogYW55O1xyXG4gIHByZXZlbnRTY3JvbGxpbmc/OiBib29sZWFuO1xyXG4gIHByZXZCdG5UaXRsZT86IHN0cmluZztcclxuICBuZXh0QnRuVGl0bGU/OiBzdHJpbmc7XHJcbiAgZW5kQnRuVGl0bGU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFRvdXJTdGF0ZSB7XHJcbiAgT0ZGLFxyXG4gIE9OLFxyXG4gIFBBVVNFRFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBUb3VyRGlyZWN0aW9uIHtcclxuICBOb25lID0gMCxcclxuICBOZXh0ID0gMSxcclxuICBQcmV2aW91cyA9IDJcclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVG91clNlcnZpY2U8VCBleHRlbmRzIElTdGVwT3B0aW9uID0gSVN0ZXBPcHRpb24+IHtcclxuICBwdWJsaWMgc3RlcFNob3ckOiBTdWJqZWN0PFQ+ID0gbmV3IFN1YmplY3QoKTtcclxuICBwdWJsaWMgc3RlcEhpZGUkOiBTdWJqZWN0PFQ+ID0gbmV3IFN1YmplY3QoKTtcclxuICBwdWJsaWMgaW5pdGlhbGl6ZSQ6IFN1YmplY3Q8VFtdPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIHN0YXJ0JDogU3ViamVjdDxUPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIGVuZCQ6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIHBhdXNlJDogU3ViamVjdDxUPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIHJlc3VtZSQ6IFN1YmplY3Q8VD4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyBhbmNob3JSZWdpc3RlciQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHVibGljIGFuY2hvclVucmVnaXN0ZXIkOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHB1YmxpYyBldmVudHMkOiBPYnNlcnZhYmxlPHsgbmFtZTogc3RyaW5nOyB2YWx1ZTogYW55IH0+ID0gbWVyZ2VTdGF0aWMoXHJcbiAgICB0aGlzLnN0ZXBTaG93JC5waXBlKG1hcCh2YWx1ZSA9PiAoeyBuYW1lOiAnc3RlcFNob3cnLCB2YWx1ZSB9KSkpLFxyXG4gICAgdGhpcy5zdGVwSGlkZSQucGlwZShtYXAodmFsdWUgPT4gKHsgbmFtZTogJ3N0ZXBIaWRlJywgdmFsdWUgfSkpKSxcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSQucGlwZShtYXAodmFsdWUgPT4gKHsgbmFtZTogJ2luaXRpYWxpemUnLCB2YWx1ZSB9KSkpLFxyXG4gICAgdGhpcy5zdGFydCQucGlwZShtYXAodmFsdWUgPT4gKHsgbmFtZTogJ3N0YXJ0JywgdmFsdWUgfSkpKSxcclxuICAgIHRoaXMuZW5kJC5waXBlKG1hcCh2YWx1ZSA9PiAoeyBuYW1lOiAnZW5kJywgdmFsdWUgfSkpKSxcclxuICAgIHRoaXMucGF1c2UkLnBpcGUobWFwKHZhbHVlID0+ICh7IG5hbWU6ICdwYXVzZScsIHZhbHVlIH0pKSksXHJcbiAgICB0aGlzLnJlc3VtZSQucGlwZShtYXAodmFsdWUgPT4gKHsgbmFtZTogJ3Jlc3VtZScsIHZhbHVlIH0pKSksXHJcbiAgICB0aGlzLmFuY2hvclJlZ2lzdGVyJC5waXBlKFxyXG4gICAgICBtYXAodmFsdWUgPT4gKHtcclxuICAgICAgICBuYW1lOiAnYW5jaG9yUmVnaXN0ZXInLFxyXG4gICAgICAgIHZhbHVlXHJcbiAgICAgIH0pKVxyXG4gICAgKSxcclxuICAgIHRoaXMuYW5jaG9yVW5yZWdpc3RlciQucGlwZShcclxuICAgICAgbWFwKHZhbHVlID0+ICh7XHJcbiAgICAgICAgbmFtZTogJ2FuY2hvclVucmVnaXN0ZXInLFxyXG4gICAgICAgIHZhbHVlXHJcbiAgICAgIH0pKVxyXG4gICAgKVxyXG4gICk7XHJcblxyXG4gIHB1YmxpYyBzdGVwczogVFtdID0gW107XHJcbiAgcHVibGljIGN1cnJlbnRTdGVwOiBUO1xyXG5cclxuICBwdWJsaWMgYW5jaG9yczogeyBbYW5jaG9ySWQ6IHN0cmluZ106IFRvdXJBbmNob3JEaXJlY3RpdmUgfSA9IHt9O1xyXG4gIHByaXZhdGUgc3RhdHVzOiBUb3VyU3RhdGUgPSBUb3VyU3RhdGUuT0ZGO1xyXG4gIHByaXZhdGUgaXNIb3RLZXlzRW5hYmxlZCA9IHRydWU7XHJcbiAgcHJpdmF0ZSBkaXJlY3Rpb246IFRvdXJEaXJlY3Rpb24gPSBUb3VyRGlyZWN0aW9uLk5leHQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcclxuICApIHsgfVxyXG5cclxuICBwdWJsaWMgaW5pdGlhbGl6ZShzdGVwczogVFtdLCBzdGVwRGVmYXVsdHM/OiBUKTogdm9pZCB7XHJcbiAgICBpZiAoc3RlcHMgJiYgc3RlcHMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IFRvdXJTdGF0ZS5PRkY7XHJcbiAgICAgIHRoaXMuc3RlcHMgPSBzdGVwcy5tYXAoc3RlcCA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGVwRGVmYXVsdHMsIHN0ZXApKTtcclxuICAgICAgdGhpcy5pbml0aWFsaXplJC5uZXh0KHRoaXMuc3RlcHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc2FibGVIb3RrZXlzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5pc0hvdEtleXNFbmFibGVkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZW5hYmxlSG90a2V5cygpOiB2b2lkIHtcclxuICAgIHRoaXMuaXNIb3RLZXlzRW5hYmxlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXJ0QXQoMCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhcnRBdChzdGVwSWQ6IG51bWJlciB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuT047XHJcbiAgICB0aGlzLmdvVG9TdGVwKHRoaXMubG9hZFN0ZXAoc3RlcElkKSk7XHJcbiAgICB0aGlzLnN0YXJ0JC5uZXh0KCk7XHJcbiAgICB0aGlzLnJvdXRlci5ldmVudHNcclxuICAgICAgLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSwgZmlyc3QoKSlcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0ZXAgJiYgdGhpcy5jdXJyZW50U3RlcC5oYXNPd25Qcm9wZXJ0eSgncm91dGUnKSkge1xyXG4gICAgICAgICAgdGhpcy5oaWRlU3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGVuZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc3RhdHVzID0gVG91clN0YXRlLk9GRjtcclxuICAgIHRoaXMuaGlkZVN0ZXAodGhpcy5jdXJyZW50U3RlcCk7XHJcbiAgICB0aGlzLmN1cnJlbnRTdGVwID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5lbmQkLm5leHQoKTtcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gVG91ckRpcmVjdGlvbi5OZXh0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBhdXNlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuUEFVU0VEO1xyXG4gICAgdGhpcy5oaWRlU3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcclxuICAgIHRoaXMucGF1c2UkLm5leHQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXN1bWUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXR1cyA9IFRvdXJTdGF0ZS5PTjtcclxuICAgIHRoaXMuc2hvd1N0ZXAodGhpcy5jdXJyZW50U3RlcCk7XHJcbiAgICB0aGlzLnJlc3VtZSQubmV4dCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvZ2dsZShwYXVzZT86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGlmIChwYXVzZSkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50U3RlcCkge1xyXG4gICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlc3VtZSgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50U3RlcCkge1xyXG4gICAgICAgIHRoaXMuZW5kKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmV4dCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gVG91ckRpcmVjdGlvbi5OZXh0O1xyXG4gICAgaWYgKHRoaXMuaGFzTmV4dCh0aGlzLmN1cnJlbnRTdGVwKSkge1xyXG4gICAgICB0aGlzLmdvVG9TdGVwKFxyXG4gICAgICAgIHRoaXMubG9hZFN0ZXAoXHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwLm5leHRTdGVwIHx8IHRoaXMuc3RlcHMuaW5kZXhPZih0aGlzLmN1cnJlbnRTdGVwKSArIDFcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVuZCgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaGFzTmV4dChzdGVwOiBUKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXN0ZXApIHtcclxuICAgICAgLy8gY29uc29sZS53YXJuKCdDYW5cXCd0IGdldCBuZXh0IHN0ZXAuIE5vIGN1cnJlbnRTdGVwLicpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBzdGVwLm5leHRTdGVwICE9PSB1bmRlZmluZWQgfHxcclxuICAgICAgdGhpcy5zdGVwcy5pbmRleE9mKHN0ZXApIDwgdGhpcy5zdGVwcy5sZW5ndGggLSAxXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHByZXYoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9IFRvdXJEaXJlY3Rpb24uUHJldmlvdXM7XHJcbiAgICBpZiAodGhpcy5oYXNQcmV2KHRoaXMuY3VycmVudFN0ZXApKSB7XHJcbiAgICAgIHRoaXMuZ29Ub1N0ZXAoXHJcbiAgICAgICAgdGhpcy5sb2FkU3RlcChcclxuICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXAucHJldlN0ZXAgfHwgdGhpcy5zdGVwcy5pbmRleE9mKHRoaXMuY3VycmVudFN0ZXApIC0gMVxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZW5kKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBoYXNQcmV2KHN0ZXA6IFQpOiBib29sZWFuIHtcclxuICAgIGlmICghc3RlcCkge1xyXG4gICAgICAvLyBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZ2V0IHByZXZpb3VzIHN0ZXAuIE5vIGN1cnJlbnRTdGVwLicpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RlcC5wcmV2U3RlcCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMuc3RlcHMuaW5kZXhPZihzdGVwKSA+IDA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ290byhzdGVwSWQ6IG51bWJlciB8IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5nb1RvU3RlcCh0aGlzLmxvYWRTdGVwKHN0ZXBJZCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZ2lzdGVyKGFuY2hvcklkOiBzdHJpbmcsIGFuY2hvcjogVG91ckFuY2hvckRpcmVjdGl2ZSk6IHZvaWQge1xyXG4gICAgaWYgKCFhbmNob3JJZClcclxuICAgICAgcmV0dXJuO1xyXG4gICAgaWYgKHRoaXMuYW5jaG9yc1thbmNob3JJZF0pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhbmNob3JJZCAnICsgYW5jaG9ySWQgKyAnIGFscmVhZHkgcmVnaXN0ZXJlZCEnKTtcclxuICAgIH1cclxuICAgIHRoaXMuYW5jaG9yc1thbmNob3JJZF0gPSBhbmNob3I7XHJcbiAgICB0aGlzLmFuY2hvclJlZ2lzdGVyJC5uZXh0KGFuY2hvcklkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1bnJlZ2lzdGVyKGFuY2hvcklkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmICghYW5jaG9ySWQpXHJcbiAgICAgIHJldHVybjtcclxuICAgIGRlbGV0ZSB0aGlzLmFuY2hvcnNbYW5jaG9ySWRdO1xyXG4gICAgdGhpcy5hbmNob3JVbnJlZ2lzdGVyJC5uZXh0KGFuY2hvcklkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRTdGF0dXMoKTogVG91clN0YXRlIHtcclxuICAgIHJldHVybiB0aGlzLnN0YXR1cztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc0hvdGtleXNFbmFibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNIb3RLZXlzRW5hYmxlZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ29Ub1N0ZXAoc3RlcDogVCk6IHZvaWQge1xyXG4gICAgaWYgKCFzdGVwKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUud2FybignQ2FuXFwndCBnbyB0byBub24tZXhpc3RlbnQgc3RlcCcpO1xyXG4gICAgICB0aGlzLmVuZCgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgbmF2aWdhdGVQcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+ID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxyXG4gICAgICByZXNvbHZlKHRydWUpXHJcbiAgICApO1xyXG4gICAgaWYgKHN0ZXAucm91dGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygc3RlcC5yb3V0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgbmF2aWdhdGVQcm9taXNlID0gdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybChzdGVwLnJvdXRlKTtcclxuICAgIH0gZWxzZSBpZiAoc3RlcC5yb3V0ZSAmJiBBcnJheS5pc0FycmF5KHN0ZXAucm91dGUpKSB7XHJcbiAgICAgIG5hdmlnYXRlUHJvbWlzZSA9IHRoaXMucm91dGVyLm5hdmlnYXRlKHN0ZXAucm91dGUpO1xyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVQcm9taXNlLnRoZW4obmF2aWdhdGVkID0+IHtcclxuICAgICAgaWYgKG5hdmlnYXRlZCAhPT0gZmFsc2UpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0Q3VycmVudFN0ZXAoc3RlcCkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9hZFN0ZXAoc3RlcElkOiBudW1iZXIgfCBzdHJpbmcpOiBUIHtcclxuICAgIGlmICh0eXBlb2Ygc3RlcElkID09PSAnbnVtYmVyJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdGVwc1tzdGVwSWRdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3RlcHMuZmluZChzdGVwID0+IHN0ZXAuc3RlcElkID09PSBzdGVwSWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRDdXJyZW50U3RlcChzdGVwOiBUKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50U3RlcCkge1xyXG4gICAgICB0aGlzLmhpZGVTdGVwKHRoaXMuY3VycmVudFN0ZXApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jdXJyZW50U3RlcCA9IHN0ZXA7XHJcbiAgICB0aGlzLnNob3dTdGVwKHRoaXMuY3VycmVudFN0ZXApO1xyXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXHJcbiAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCksIGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0ZXAgJiYgdGhpcy5jdXJyZW50U3RlcC5oYXNPd25Qcm9wZXJ0eSgncm91dGUnKSkge1xyXG4gICAgICAgICAgdGhpcy5oaWRlU3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaG93U3RlcChzdGVwOiBUKTogdm9pZCB7XHJcbiAgICBjb25zdCBhbmNob3IgPSB0aGlzLmFuY2hvcnNbc3RlcCAmJiBzdGVwLmFuY2hvcklkXTtcclxuICAgIGlmICghYW5jaG9yKSB7XHJcbiAgICAgIGxldCBzdGVwSW5kZXggPSB0aGlzLnN0ZXBzLmluZGV4T2Yoc3RlcCk7XHJcbiAgICAgIHRoaXMuc2tpcFN0ZXAoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFuY2hvci5zaG93VG91clN0ZXAoc3RlcCk7XHJcbiAgICAgIHRoaXMuc3RlcFNob3ckLm5leHQoc3RlcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGlkZVN0ZXAoc3RlcDogVCk6IHZvaWQge1xyXG4gICAgY29uc3QgYW5jaG9yID0gdGhpcy5hbmNob3JzW3N0ZXAgJiYgc3RlcC5hbmNob3JJZF07XHJcbiAgICBpZiAoIWFuY2hvcikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhbmNob3IuaGlkZVRvdXJTdGVwKCk7XHJcbiAgICB0aGlzLnN0ZXBIaWRlJC5uZXh0KHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBza2lwU3RlcCgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcclxuICAgICAgY2FzZSBUb3VyRGlyZWN0aW9uLk5leHQ6IHtcclxuICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIFRvdXJEaXJlY3Rpb24uUHJldmlvdXM6IHtcclxuICAgICAgICB0aGlzLnByZXYoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=