import {CallsiteRecord} from "callsite-record";
import {Chalk} from "chalk";

export interface IReporter {
    reportTaskStart: (startTime: Date, userAgents: string[], testCount: number) => void;
    reportFixtureStart: (name: string, path: string) => void;
    reportTestDone: (name: string, testRunInfo: ITestRunInfo) => void;
    reportTaskDone: (endTime: Date, passed: number, warnings: string[]) => void;
    renderErrors: (errs: any[]) => string;
    createErrorDecorator: () => any;
}

export interface IReporterPlugin extends IReporter, IReporterlPluginHost {
}

export interface IExtendedReporterPlugin extends IReporter, IReporterlPluginHost {
    renderErrors: (errs: IError[]) => string;
    createErrorDecorator: () => any;
    lastSuiteName: string | undefined;
    failed: number;
    skipped: number;
}

export interface ITestRunInfo {
    durationMs: number;
    screenshotPath: string;
    skipped: boolean;
    errs: IError[];
}

export interface IError {
   callsite: ICallsiteRecord;
   isTestCafeError: boolean;
   screenshotPath: string;
   type: TestCafeErrorType;
   userAgent: string;
}

export interface ICallsiteRecord extends CallsiteRecord {
    filename: string;
    lineNum: number;
    stackFrames: IStackFrame[];
    callsiteFrameIdx: number;
    isV8Frames: boolean;
}

export interface IStackFrame {
    getFileName: () => string;
    getLineNumber: () => number;
    getColumnNumber: () => number;
}
export interface ICallsiteRendererOption {
    codeFrame: boolean;
    frameSize: number;
    stack: boolean;
}

export type TestCafeErrorType =
| "actionElementNotFoundError"
| "uncaughtErrorOnPage"
| "uncaughtErrorInTestCode"
| "uncaughtNonErrorObjectInTestCode"
| "uncaughtErrorInClientFunctionCode"
| "uncaughtErrorInCustomDOMPropertyCode"
| "missingAwaitError"
| "actionIntegerOptionError"
| "actionPositiveIntegerOptionError"
| "actionBooleanOptionError"
| "actionSpeedOptionError"
| "actionOptionsTypeError"
| "actionStringArgumentError"
| "actionNullableStringArgumentError"
| "actionStringOrStringArrayArgumentError"
| "actionStringArrayElementError"
| "actionIntegerArgumentError"
| "actionRoleArgumentError"
| "actionPositiveIntegerArgumentError"
| "actionSelectorError"
| "actionElementNotFoundError"
| "actionElementIsInvisibleError"
| "actionSelectorMatchesWrongNodeTypeError"
| "actionAdditionalElementNotFoundError"
| "actionAdditionalElementIsInvisibleError"
| "actionAdditionalSelectorMatchesWrongNodeTypeError"
| "actionElementNonEditableError"
| "actionElementNotTextAreaError"
| "actionElementNonContentEditableError"
| "actionElementIsNotFileInputError"
| "actionRootContainerNotFoundError"
| "actionIncorrectKeysError"
| "actionCanNotFindFileToUploadError"
| "actionUnsupportedDeviceTypeError"
| "actionIframeIsNotLoadedError"
| "actionElementNotIframeError"
| "actionInvalidScrollTargetError"
| "currentIframeIsNotLoadedError"
| "currentIframeNotFoundError"
| "currentIframeIsInvisibleError"
| "nativeDialogNotHandledError"
| "uncaughtErrorInNativeDialogHandler"
| "setTestSpeedArgumentError"
| "setNativeDialogHandlerCodeWrongTypeError"
| "clientFunctionExecutionInterruptionError"
| "domNodeClientFunctionResultError"
| "invalidSelectorResultError"
| "cantObtainInfoForElementSpecifiedBySelectorError"
| "externalAssertionLibraryError"
| "pageLoadError"
| "windowDimensionsOverflowError"
| "invalidElementScreenshotDimensionsError"
| "roleSwitchInRoleInitializerError"
| "assertionExecutableArgumentError"
;

export interface IReporterlPluginHost {
    write: (text: string) => IReporterlPluginHost;
    setIndent: (val: number) => IReporterlPluginHost;
    newline: () => IReporterlPluginHost;
    chalk: Chalk;
    formatError: (err: any, prefix: string) => string;
}
