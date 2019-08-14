import { CommonModule } from '@angular/common';
import { Injectable, Component, HostListener, NgModule } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { Subject, merge } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';

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
const TourState = {
    OFF: 0,
    ON: 1,
    PAUSED: 2,
};
TourState[TourState.OFF] = 'OFF';
TourState[TourState.ON] = 'ON';
TourState[TourState.PAUSED] = 'PAUSED';
/** @enum {number} */
const TourDirection = {
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
class TourService {
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
        this.events$ = merge(this.stepShow$.pipe(map((/**
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TourHotkeyListenerComponent {
    /**
     * @param {?} tourService
     */
    constructor(tourService) {
        this.tourService = tourService;
    }
    /**
     * Configures hot keys for controlling the tour with the keyboard
     * @return {?}
     */
    onEscapeKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.end();
        }
    }
    /**
     * @return {?}
     */
    onArrowRightKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.hasNext(this.tourService.currentStep) &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.next();
        }
    }
    /**
     * @return {?}
     */
    onArrowLeftKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.hasPrev(this.tourService.currentStep) &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.prev();
        }
    }
}
TourHotkeyListenerComponent.decorators = [
    { type: Component, args: [{
                selector: 'tour-hotkey-listener',
                template: `<ng-content></ng-content>`
            }] }
];
/** @nocollapse */
TourHotkeyListenerComponent.ctorParameters = () => [
    { type: TourService }
];
TourHotkeyListenerComponent.propDecorators = {
    onEscapeKey: [{ type: HostListener, args: ['window:keydown.Escape',] }],
    onArrowRightKey: [{ type: HostListener, args: ['window:keydown.ArrowRight',] }],
    onArrowLeftKey: [{ type: HostListener, args: ['window:keydown.ArrowLeft',] }]
};
if (false) {
    /** @type {?} */
    TourHotkeyListenerComponent.prototype.tourService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TourModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: TourModule,
            providers: [
                TourService,
            ],
        };
    }
}
TourModule.decorators = [
    { type: NgModule, args: [{
                declarations: [TourHotkeyListenerComponent],
                exports: [TourHotkeyListenerComponent],
                imports: [CommonModule, RouterModule],
            },] }
];
;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { TourHotkeyListenerComponent, TourModule, TourService, TourState };
//# sourceMappingURL=ngx-tour-core.js.map
