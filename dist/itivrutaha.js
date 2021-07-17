/*
 *  Entryfile for itivrutaha logging module.
 *  Created On 10 October 2019
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from 'chalk';
import merge from 'deepmerge';
import del from 'del';
import { DateTime } from 'luxon';
import { readPackageUpSync } from 'read-pkg-up';
import { Logger } from './class/index.js';
import { open } from './class/log.js';
import { typeCase } from './config.js';
// Holds the default configuration which acts like a
// replacement when no value is provided for a
// particular configuration key
const defaults = {
    // The name of your app, if not provided
    // the value will be determined by reading
    // package.json of the above project.
    appName: null,
    // Whether to log when the logger is initialized.
    bootLog: true,
    // Whether to log when the Node.js process exits.
    // Logs when terminating gracefully, due to an error
    // or when POSIX signals are received.
    shutdownLog: true,
    // remove the "^C⏎" after terminating the process
    // when Ctrl+C is pressed
    clearOnSIGINT: true,
    // Command-line arguments that suppress the output
    // to the console if found.
    quietIdentifier: ['--quiet', '-q'],
    // Command-line arguments that render verbose message
    // type to the console if found.
    verboseIdentifier: ['--verbose', '-v'],
    // Configuration for this particular logger.
    // Useful when application has multiple loggers.
    context: {
        // Name of the context, example "app", "api",
        // "bot", "server"...
        name: null,
        // Chalk color function for this context.
        color: chalk.blueBright,
    },
    // Configuration options related to rendering the
    // log messages to the console.
    theme: {
        // The theme string, that determines which variables
        // are to be rendered.
        string: `:time ${chalk.gray.dim('•')} :emoji :type :message`,
        // Whether to log colored output
        // or plain.
        colored: true,
        // Whether to render message type (":type" variable)
        // in bold.
        boldType: true,
        // The character casing to render message type or
        // the (":type" variable).
        typeCase: typeCase.lower,
        // Luxon time formatting used to render the
        // ":time" variable. See 👇 for formatting guide
        // https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
        timeFormat: 'HH:mm:ss dd-LL-yyyy',
    },
    logs: {
        // Whether to enable file logging or not.
        enable: false,
        // The directory where log files are saved.
        dir: null,
        // Filename for writing output (stdout)
        // logs.
        output: `output-${DateTime.local().toFormat('dd-LL-yyyy')}.log`,
        // Filename for writing error (stderr)
        // logs.
        error: `error-${DateTime.local().toFormat('dd-LL-yyyy')}.log`,
    },
};
// createNewLogger() will create a new instance of the logger class
const createNewLogger = (config = defaults) => __awaiter(void 0, void 0, void 0, function* () {
    // if custom properties were given merge those together
    // with defaults so we have all properties defined
    config = merge(defaults, config);
    // fill out the fields which are specific to this
    // particular instance of Logger
    if (config.appName == null)
        config.appName = readPackageUpSync().packageJson.name;
    if (config.context.name)
        config.theme.string = `:time ${chalk.gray.dim('•')} ${config.context.color(config.context.name)} :emoji :type :message`;
    // initialize file logging according to the configuration
    const data = yield open(config);
    // return a new LoggerClass instance
    return new Logger(config, data);
});
const clearLogs = (logger) => __awaiter(void 0, void 0, void 0, function* () { return yield del(logger.config.logs.dir, { force: true }); });
// Export the above two functions
export default {
    /**
     * Creates a new instance of a logger.
     * @param config {ConfigImpl}
     * @returns Logger
     */
    createNewLogger,
    /**
     * Deletes the log directory for a given logger.
     * @param logger {Logger}
     * @returns string[]
     */
    clearLogs,
};
