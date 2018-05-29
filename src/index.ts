
import { extendedReporterPlugin } from "./reporter";
import { IReporter } from "./reporter-interface";

const reporter: () => IReporter = () => {
    return {
        reportFixtureStart(name: string, path: string) {
            extendedReporterPlugin.reportFixtureStart.call(this, name, path);
        },
        reportTaskDone(endTime: Date, passed: number, warnings: string[]) {
            extendedReporterPlugin.reportTaskDone.call(this, endTime, passed, warnings);
        },
        reportTaskStart(startTime: Date, userAgents: string[], testCount: number) {
            extendedReporterPlugin.reportTaskStart.call(this, startTime, userAgents, testCount);
        },
        reportTestDone(name: string, testRunInfo: any) {
            extendedReporterPlugin.reportTestDone.call(this, name, testRunInfo);
        },
        renderErrors(errs: any[]) {
            return extendedReporterPlugin.renderErrors.call(this, errs);
        },
        createErrorDecorator() {
            return extendedReporterPlugin.createErrorDecorator.call(this);
        },
    };
};

export = reporter;
