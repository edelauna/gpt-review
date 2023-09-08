require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises
// export const {open} = 'fs'
, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
exports.UV_FS_O_EXLOCK = 0x10000000;
exports.READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const path = __importStar(__nccwpck_require__(1017));
const ioUtil = __importStar(__nccwpck_require__(1962));
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 3222:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// This file includes code which was modified from https://github.com/openai/gpt-2
const fs = __nccwpck_require__(7147)
const path = __nccwpck_require__(1017);

const encoder = JSON.parse(fs.readFileSync(__nccwpck_require__.ab + "encoder.json"));
const bpe_file = fs.readFileSync(__nccwpck_require__.ab + "vocab.bpe", 'utf-8');

const range = (x, y) => {
  const res = Array.from(Array(y).keys()).slice(x)
  return res
}

const ord = x => {
  return x.charCodeAt(0)
}

const chr = x => {
  return String.fromCharCode(x)
}

const textEncoder = new TextEncoder("utf-8")
const encodeStr = str => {
  return Array.from(textEncoder.encode(str)).map(x => x.toString())
}

const textDecoder = new TextDecoder("utf-8")
const decodeStr = arr => {
  return textDecoder.decode(new Uint8Array(arr));
}

const dictZip = (x, y) => {
  const result = {}
  x.map((_, i) => { result[x[i]] = y[i] })
  return result
}

function bytes_to_unicode() {
  const bs = range(ord('!'), ord('~') + 1).concat(range(ord('¡'), ord('¬') + 1), range(ord('®'), ord('ÿ') + 1))

  let cs = bs.slice()
  let n = 0
  for (let b = 0; b < 2 ** 8; b++) {
    if (!bs.includes(b)) {
      bs.push(b)
      cs.push(2 ** 8 + n)
      n = n + 1
    }
  }

  cs = cs.map(x => chr(x))

  const result = {}
  bs.map((_, i) => { result[bs[i]] = cs[i] })
  return result
}

function get_pairs(word) {
  const pairs = new Set()
  let prev_char = word[0]
  for (let i = 1; i < word.length; i++) {
    const char = word[i]
    pairs.add([prev_char, char])
    prev_char = char
  }
  return pairs
}

const pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu

const decoder = {}
Object.keys(encoder).map(x => { decoder[encoder[x]] = x })

const lines = bpe_file.split('\n')

// bpe_merges = [tuple(merge_str.split()) for merge_str in bpe_data.split("\n")[1:-1]]
const bpe_merges = lines.slice(1, lines.length - 1).map(x => {
  return x.split(/(\s+)/).filter(function(e) { return e.trim().length > 0 })
})

const byte_encoder = bytes_to_unicode()
const byte_decoder = {}
Object.keys(byte_encoder).map(x => { byte_decoder[byte_encoder[x]] = x })

const bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length))
const cache = new Map;

function bpe(token) {
  if (cache.has(token)) {
    return cache.get(token)
  }``

  let word = token.split('')

  let pairs = get_pairs(word)

  if (!pairs) {
    return token
  }

  while (true) {
    const minPairs = {}
    Array.from(pairs).map(pair => {
      const rank = bpe_ranks[pair]
      minPairs[(isNaN(rank) ? 10e10 : rank)] = pair
    })



    const bigram = minPairs[Math.min(...Object.keys(minPairs).map(x => {
      return parseInt(x)
    }
    ))]

    if (!(bigram in bpe_ranks)) {
      break
    }

    const first = bigram[0]
    const second = bigram[1]
    let new_word = []
    let i = 0

    while (i < word.length) {
      const j = word.indexOf(first, i)
      if (j === -1) {
        new_word = new_word.concat(word.slice(i))
        break
      }
      new_word = new_word.concat(word.slice(i, j))
      i = j

      if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
        new_word.push(first + second)
        i = i + 2
      } else {
        new_word.push(word[i])
        i = i + 1
      }
    }

    word = new_word
    if (word.length === 1) {
      break
    } else {
      pairs = get_pairs(word)
    }
  }

  word = word.join(' ')
  cache.set(token, word)

  return word
}

function encode(text) {
  let bpe_tokens = []
  const matches = Array.from(text.matchAll(pat)).map(x => x[0])
  for (let token of matches) {
    token = encodeStr(token).map(x => {
      return byte_encoder[x]
    }).join('')
    
    const new_tokens = bpe(token).split(' ').map(x => encoder[x])
    bpe_tokens = bpe_tokens.concat(new_tokens)
  }
  return bpe_tokens
}

function decode(tokens) {
  let text = tokens.map(x => decoder[x]).join('')
  text = decodeStr(text.split('').map(x => byte_decoder[x]))
  return text
}

module.exports = {
  encode,
  decode
};

/***/ }),

/***/ 1818:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { encode, decode } = __nccwpck_require__(3222);

module.exports = {
  encode,
  decode,
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 3298:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
var exec = __importStar(__nccwpck_require__(1514));
var core = __importStar(__nccwpck_require__(2186));
var parse_1 = __nccwpck_require__(3415);
var GitDiffBaseRefException = /** @class */ (function (_super) {
    __extends(GitDiffBaseRefException, _super);
    function GitDiffBaseRefException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'GitDiffBaseRefException';
        return _this;
    }
    return GitDiffBaseRefException;
}(Error));
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var headRef, baseRef, fetchArgs, diffArgs, output, patches;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                headRef = process.env["GITHUB_HEAD_REF"] || process.env["GITHUB_REF_NAME"];
                baseRef = process.env["GITHUB_BASE_REF"] || core.getInput("TARGET_BRANCH");
                if (!baseRef)
                    throw new GitDiffBaseRefException("Missing github.base_ref, which is required.\n  This is available when the event that triggers a workflow run is a pull_request.\n  Alternatively it can be set via the input parameter target_branch.");
                fetchArgs = [
                    "fetch", "origin",
                    "refs/heads/".concat(baseRef)
                ];
                diffArgs = [
                    "diff",
                    "origin/".concat(baseRef),
                    "--diff-algorithm=minimal",
                    "--unified=7" // bumping from 3 to seven to pass more context to the model
                ];
                if (headRef) {
                    diffArgs[1] = "origin/".concat(baseRef, "...origin/").concat(headRef);
                    fetchArgs.splice(2, 0, "refs/heads/".concat(headRef));
                }
                return [4 /*yield*/, exec.exec("git", fetchArgs)];
            case 1:
                _a.sent();
                core.startGroup("git ".concat(diffArgs.join(" ")));
                return [4 /*yield*/, exec.getExecOutput("git", diffArgs)];
            case 2:
                output = (_a.sent()).stdout;
                core.endGroup();
                patches = (0, parse_1.parse)(output);
                return [2 /*return*/, patches];
        }
    });
}); };
exports.run = run;


/***/ }),

/***/ 3415:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = void 0;
var fileRegex = /^diff --git a\/(.+) b\/(.+)$/m;
var diffRegex = /^@@ -(?:\d+)(?:,\d+)? \+(\d+)(?:,?)(\d+)? @@/m;
var parse = function (input) {
    var diffLines = input.split('\n');
    var diff = [];
    var patch = [];
    var fileName = "";
    var lineNumber = 0;
    var until = 0;
    for (var _i = 0, diffLines_1 = diffLines; _i < diffLines_1.length; _i++) {
        var line = diffLines_1[_i];
        var fileMatch = line.match(fileRegex);
        var diffMatch = line.match(diffRegex);
        if (fileMatch) {
            fileName = fileMatch[2];
        }
        else if (diffMatch) {
            lineNumber = parseInt(diffMatch[1], 10);
            until = diffMatch[2] ? parseInt(diffMatch[2]) : 1;
        }
        else if (until > 0) {
            if (!line.startsWith('-')) { // deleted code seems to confuse the model
                patch.push({ lineNumber: lineNumber, line: line });
                lineNumber++;
                until--;
            }
            if (until == 0) {
                diff.push({ fileName: fileName, patch: __spreadArray([], patch, true) });
                patch.length = 0;
            }
        }
    }
    return diff;
};
exports.parse = parse;


/***/ }),

/***/ 6144:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
var core = __importStar(__nccwpck_require__(2186));
var gitDiff = __importStar(__nccwpck_require__(3298));
var makeReview = __importStar(__nccwpck_require__(2724));
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var diffs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, gitDiff.run()];
            case 1:
                diffs = _a.sent();
                return [4 /*yield*/, makeReview.run(diffs)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                switch (error_1.name) {
                    case 'GitDiffBaseRefException':
                        core.warning(error_1.message);
                        break;
                    default:
                        core.setFailed(error_1.message);
                        break;
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.run = run;
(0, exports.run)();


/***/ }),

/***/ 2724:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
var make_review_1 = __nccwpck_require__(4941);
var message_manager_1 = __nccwpck_require__(8575);
var run = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, input_1, diff, messages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, input_1 = input;
                _a.label = 1;
            case 1:
                if (!(_i < input_1.length)) return [3 /*break*/, 4];
                diff = input_1[_i];
                messages = (0, message_manager_1.messageManager)(diff);
                if (!(0, make_review_1.roomForReview)())
                    return [3 /*break*/, 4];
                if (messages.length == 1)
                    return [3 /*break*/, 3];
                return [4 /*yield*/, (0, make_review_1.makeReview)(messages)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.run = run;


/***/ }),

/***/ 4941:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.roomForReview = exports.makeReview = exports.functions = void 0;
var openai_1 = __importDefault(__nccwpck_require__(47));
var core = __importStar(__nccwpck_require__(2186));
var REVIEW_LIMIT = 10;
var existingReview = 0;
var openai = new openai_1.default({
    apiKey: core.getInput("OPENAI_API_KEY")
});
exports.functions = [
    {
        name: "provide_critical_review",
        description: "Provide a critical review of new code changes, identify any defects or suggest quality improvements. You can also suggest alternative solutions. The review should focus on lines beginning with \"+\".",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Title of the review"
                },
                message: {
                    type: "string",
                    description: "Review message using markdown formatting."
                },
                file: {
                    type: "string",
                    description: "Filename the review relates to"
                },
                startLine: {
                    type: "number",
                    description: "The starting line for which the review relates."
                },
                endLine: {
                    type: "number",
                    description: "The end line for which the review relates."
                }
            },
            required: ["title", "message", "file", "startLine", "endLine"]
        }
    }, {
        name: "approve",
        description: "Default response to approve changes.",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Approval message, typically \"Looks Good to Me\" (LGTM)."
                }
            }
        }
    }
];
var makeReview = function (messages) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, openai.chat.completions.create({
                    messages: messages,
                    model: "gpt-3.5-turbo-16k",
                    functions: exports.functions,
                    function_call: 'auto'
                })];
            case 1:
                response = _a.sent();
                _makeReview(response);
                return [2 /*return*/];
        }
    });
}); };
exports.makeReview = makeReview;
var _makeReview = function (response, choice) {
    if (choice === void 0) { choice = 0; }
    try {
        if (response.choices.length <= choice)
            return;
        var message = response.choices[choice].message;
        if (!message.function_call)
            return;
        if (message.function_call.name != exports.functions[0].name)
            return;
        var _a = JSON.parse(message.function_call.arguments), title = _a.title, file = _a.file, startLine = _a.startLine, endLine = _a.endLine, review = _a.message;
        core.notice(review, { title: title, file: file, startLine: startLine, endLine: endLine });
        existingReview++;
    }
    catch (_b) {
        if (choice < 3)
            _makeReview(response, choice + 1);
    }
};
var roomForReview = function () { return existingReview < REVIEW_LIMIT; };
exports.roomForReview = roomForReview;


/***/ }),

/***/ 8575:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.messageManager = void 0;
var gpt_3_encoder_1 = __nccwpck_require__(1818);
var make_review_1 = __nccwpck_require__(4941);
var countTokens = function (input) { return input ? (0, gpt_3_encoder_1.encode)(input).length : 0; };
var MAX_TOKENS = (16385 / 7 * 6) - countTokens(JSON.stringify(make_review_1.functions));
var messages = [
    {
        role: "system",
        content: "You are a code peer reviewer, your role is to provide valuable feedback on Github Pull Requests. Your default response is to simply approve the changes with 'Looks Good to Me' (LGTM) unless there are critical issues. Please thoroughly review each code change and consider any defects, quality improvements, or suggest alternative solutions. Line mapping of the incoming code:\n* Lines beginning with '+' signify new lines\n* Lines beginning with '-' signify removed lines\n* all other lines are provided for context."
    }
];
var currentToKeNs = countTokens(messages[0].content);
var messageManager = function (input) {
    var candidate = JSON.stringify(input);
    var nextToKeNs = countTokens(candidate);
    while (messages.length > 2 && (nextToKeNs + currentToKeNs) > MAX_TOKENS) {
        var prevToKeNs = countTokens(messages[1].content);
        messages.splice(1, 1);
        currentToKeNs -= prevToKeNs;
    }
    if ((nextToKeNs + currentToKeNs) < MAX_TOKENS) {
        messages.push({
            role: "user",
            content: candidate
        });
        currentToKeNs += nextToKeNs;
    }
    return messages;
};
exports.messageManager = messageManager;


/***/ }),

/***/ 1427:
/***/ ((module) => {

module.exports = eval("require")("openai/_shims/agent.js");


/***/ }),

/***/ 3993:
/***/ ((module) => {

module.exports = eval("require")("openai/_shims/fetch.js");


/***/ }),

/***/ 91:
/***/ ((module) => {

module.exports = eval("require")("openai/_shims/fileFromPath.js");


/***/ }),

/***/ 4741:
/***/ ((module) => {

module.exports = eval("require")("openai/_shims/form-data.js");


/***/ }),

/***/ 5709:
/***/ ((module) => {

module.exports = eval("require")("openai/_shims/getMultipartRequestOptions.js");


/***/ }),

/***/ 5518:
/***/ ((module) => {

module.exports = eval("require")("openai/_shims/node-readable.js");


/***/ }),

/***/ 7093:
/***/ ((module) => {

module.exports = eval("require")("openai/core.js");


/***/ }),

/***/ 8562:
/***/ ((module) => {

module.exports = eval("require")("openai/error.js");


/***/ }),

/***/ 812:
/***/ ((module) => {

module.exports = eval("require")("openai/pagination.js");


/***/ }),

/***/ 8733:
/***/ ((module) => {

module.exports = eval("require")("openai/resource.js");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 1798:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a setter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot write private member to an object whose class did not declare it');
    return (
      kind === 'a' ? f.call(receiver, value)
      : f ? (f.value = value)
      : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return (
      kind === 'm' ? f
      : kind === 'a' ? f.call(receiver)
      : f ? f.value
      : state.get(receiver)
    );
  };
var _AbstractPage_client;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toBase64 =
  exports.getHeader =
  exports.isHeadersProtocol =
  exports.isRunningInBrowser =
  exports.debug =
  exports.hasOwn =
  exports.isEmptyObj =
  exports.maybeCoerceBoolean =
  exports.maybeCoerceFloat =
  exports.maybeCoerceInteger =
  exports.coerceBoolean =
  exports.coerceFloat =
  exports.coerceInteger =
  exports.readEnv =
  exports.ensurePresent =
  exports.castToError =
  exports.sleep =
  exports.safeJSON =
  exports.isRequestOptions =
  exports.createResponseHeaders =
  exports.PagePromise =
  exports.AbstractPage =
  exports.APIResource =
  exports.APIClient =
  exports.APIPromise =
  exports.createForm =
  exports.multipartFormRequestOptions =
  exports.maybeMultipartFormRequestOptions =
    void 0;
const version_1 = __nccwpck_require__(6417);
const streaming_1 = __nccwpck_require__(884);
const error_1 = __nccwpck_require__(8905);
const agent_1 = __nccwpck_require__(1427);
const fetch_1 = __nccwpck_require__(3993);
const uploads_1 = __nccwpck_require__(3394);
var uploads_2 = __nccwpck_require__(3394);
Object.defineProperty(exports, "maybeMultipartFormRequestOptions", ({
  enumerable: true,
  get: function () {
    return uploads_2.maybeMultipartFormRequestOptions;
  },
}));
Object.defineProperty(exports, "multipartFormRequestOptions", ({
  enumerable: true,
  get: function () {
    return uploads_2.multipartFormRequestOptions;
  },
}));
Object.defineProperty(exports, "createForm", ({
  enumerable: true,
  get: function () {
    return uploads_2.createForm;
  },
}));
const MAX_RETRIES = 2;
async function defaultParseResponse(props) {
  const { response } = props;
  if (props.options.stream) {
    // Note: there is an invariant here that isn't represented in the type system
    // that if you set `stream: true` the response type must also be `Stream<T>`
    return new streaming_1.Stream(response, props.controller);
  }
  const contentType = response.headers.get('content-type');
  if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
    const json = await response.json();
    debug('response', response.status, response.url, response.headers, json);
    return json;
  }
  // TODO handle blob, arraybuffer, other content types, etc.
  const text = await response.text();
  debug('response', response.status, response.url, response.headers, text);
  return text;
}
/**
 * A subclass of `Promise` providing additional helper methods
 * for interacting with the SDK.
 */
class APIPromise extends Promise {
  constructor(responsePromise, parseResponse = defaultParseResponse) {
    super((resolve) => {
      // this is maybe a bit weird but this has to be a no-op to not implicitly
      // parse the response body; instead .then, .catch, .finally are overridden
      // to parse the response
      resolve(null);
    });
    this.responsePromise = responsePromise;
    this.parseResponse = parseResponse;
  }
  _thenUnwrap(transform) {
    return new APIPromise(this.responsePromise, async (props) => transform(await this.parseResponse(props)));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   */
  asResponse() {
    return this.responsePromise.then((p) => p.response);
  }
  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   */
  async withResponse() {
    const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
    return { data, response };
  }
  parse() {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then(this.parseResponse);
    }
    return this.parsedPromise;
  }
  then(onfulfilled, onrejected) {
    return this.parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.parse().finally(onfinally);
  }
}
exports.APIPromise = APIPromise;
class APIClient {
  constructor({
    baseURL,
    maxRetries,
    timeout = 600000, // 10 minutes
    httpAgent,
    fetch: overridenFetch,
  }) {
    this.baseURL = baseURL;
    this.maxRetries = validatePositiveInteger(
      'maxRetries',
      maxRetries !== null && maxRetries !== void 0 ? maxRetries : MAX_RETRIES,
    );
    this.timeout = validatePositiveInteger('timeout', timeout);
    this.httpAgent = httpAgent;
    this.fetch = overridenFetch !== null && overridenFetch !== void 0 ? overridenFetch : fetch_1.fetch;
  }
  authHeaders(opts) {
    return {};
  }
  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  defaultHeaders(opts) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this.getUserAgent(),
      ...getPlatformHeaders(),
      ...this.authHeaders(opts),
    };
  }
  /**
   * Override this to add your own headers validation:
   */
  validateHeaders(headers, customHeaders) {}
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  get(path, opts) {
    return this.methodRequest('get', path, opts);
  }
  post(path, opts) {
    return this.methodRequest('post', path, opts);
  }
  patch(path, opts) {
    return this.methodRequest('patch', path, opts);
  }
  put(path, opts) {
    return this.methodRequest('put', path, opts);
  }
  delete(path, opts) {
    return this.methodRequest('delete', path, opts);
  }
  methodRequest(method, path, opts) {
    return this.request(Promise.resolve(opts).then((opts) => ({ method, path, ...opts })));
  }
  getAPIList(path, Page, opts) {
    return this.requestAPIList(Page, { method: 'get', path, ...opts });
  }
  calculateContentLength(body) {
    if (typeof body === 'string') {
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(body, 'utf8').toString();
      }
      if (typeof TextEncoder !== 'undefined') {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(body);
        return encoded.length.toString();
      }
    }
    return null;
  }
  buildRequest(options) {
    var _a, _b, _c, _d, _e, _f;
    const { method, path, query, headers: headers = {} } = options;
    const body =
      (0, uploads_1.isMultipartBody)(options.body) ? options.body.body
      : options.body ? JSON.stringify(options.body, null, 2)
      : null;
    const contentLength = this.calculateContentLength(body);
    const url = this.buildURL(path, query);
    if ('timeout' in options) validatePositiveInteger('timeout', options.timeout);
    const timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : this.timeout;
    const httpAgent =
      (
        (_c = (_b = options.httpAgent) !== null && _b !== void 0 ? _b : this.httpAgent) !== null &&
        _c !== void 0
      ) ?
        _c
      : (0, agent_1.getDefaultAgent)(url);
    const minAgentTimeout = timeout + 1000;
    if (
      typeof ((
        (_d = httpAgent === null || httpAgent === void 0 ? void 0 : httpAgent.options) === null ||
        _d === void 0
      ) ?
        void 0
      : _d.timeout) === 'number' &&
      minAgentTimeout > ((_e = httpAgent.options.timeout) !== null && _e !== void 0 ? _e : 0)
    ) {
      // Allow any given request to bump our agent active socket timeout.
      // This may seem strange, but leaking active sockets should be rare and not particularly problematic,
      // and without mutating agent we would need to create more of them.
      // This tradeoff optimizes for performance.
      httpAgent.options.timeout = minAgentTimeout;
    }
    if (this.idempotencyHeader && method !== 'get') {
      if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
      headers[this.idempotencyHeader] = options.idempotencyKey;
    }
    const reqHeaders = {
      ...(contentLength && { 'Content-Length': contentLength }),
      ...this.defaultHeaders(options),
      ...headers,
    };
    // let builtin fetch set the Content-Type for multipart bodies
    if ((0, uploads_1.isMultipartBody)(options.body) && !fetch_1.isPolyfilled) {
      delete reqHeaders['Content-Type'];
    }
    // Strip any headers being explicitly omitted with null
    Object.keys(reqHeaders).forEach((key) => reqHeaders[key] === null && delete reqHeaders[key]);
    const req = {
      method,
      ...(body && { body: body }),
      headers: reqHeaders,
      ...(httpAgent && { agent: httpAgent }),
      // @ts-ignore node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: (_f = options.signal) !== null && _f !== void 0 ? _f : null,
    };
    this.validateHeaders(reqHeaders, headers);
    return { req, url, timeout };
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(request, { url, options }) {}
  parseHeaders(headers) {
    return (
      !headers ? {}
      : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header]))
      : { ...headers }
    );
  }
  makeStatusError(status, error, message, headers) {
    return error_1.APIError.generate(status, error, message, headers);
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this.makeRequest(options, remainingRetries));
  }
  async makeRequest(optionsInput, retriesRemaining) {
    var _a, _b, _c;
    const options = await optionsInput;
    if (retriesRemaining == null) {
      retriesRemaining = (_a = options.maxRetries) !== null && _a !== void 0 ? _a : this.maxRetries;
    }
    const { req, url, timeout } = this.buildRequest(options);
    await this.prepareRequest(req, { url, options });
    debug('request', url, options, req.headers);
    if ((_b = options.signal) === null || _b === void 0 ? void 0 : _b.aborted) {
      throw new error_1.APIUserAbortError();
    }
    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(exports.castToError);
    if (response instanceof Error) {
      if ((_c = options.signal) === null || _c === void 0 ? void 0 : _c.aborted) {
        throw new error_1.APIUserAbortError();
      }
      if (retriesRemaining) {
        return this.retryRequest(options, retriesRemaining);
      }
      if (response.name === 'AbortError') {
        throw new error_1.APIConnectionTimeoutError();
      }
      throw new error_1.APIConnectionError({ cause: response });
    }
    const responseHeaders = (0, exports.createResponseHeaders)(response.headers);
    if (!response.ok) {
      if (retriesRemaining && this.shouldRetry(response)) {
        return this.retryRequest(options, retriesRemaining, responseHeaders);
      }
      const errText = await response.text().catch(() => 'Unknown');
      const errJSON = (0, exports.safeJSON)(errText);
      const errMessage = errJSON ? undefined : errText;
      debug('response', response.status, url, responseHeaders, errMessage);
      const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
      throw err;
    }
    return { response, options, controller };
  }
  requestAPIList(Page, options) {
    const request = this.makeRequest(options, null);
    return new PagePromise(this, request, Page);
  }
  buildURL(path, query) {
    const url =
      isAbsoluteURL(path) ?
        new URL(path)
      : new URL(this.baseURL + (this.baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));
    const defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery)) {
      query = { ...defaultQuery, ...query };
    }
    if (query) {
      url.search = this.stringifyQuery(query);
    }
    return url.toString();
  }
  stringifyQuery(query) {
    return Object.entries(query)
      .filter(([_, value]) => typeof value !== 'undefined')
      .map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
          return `${encodeURIComponent(key)}=`;
        }
        throw new Error(
          `Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`,
        );
      })
      .join('&');
  }
  async fetchWithTimeout(url, init, ms, controller) {
    const { signal, ...options } = init || {};
    if (signal) signal.addEventListener('abort', () => controller.abort());
    const timeout = setTimeout(() => controller.abort(), ms);
    return this.getRequestClient()
      .fetch(url, { signal: controller.signal, ...options })
      .finally(() => {
        clearTimeout(timeout);
      });
  }
  getRequestClient() {
    return { fetch: this.fetch };
  }
  shouldRetry(response) {
    // Note this is not a standard header.
    const shouldRetryHeader = response.headers.get('x-should-retry');
    // If the server explicitly says whether or not to retry, obey.
    if (shouldRetryHeader === 'true') return true;
    if (shouldRetryHeader === 'false') return false;
    // Retry on lock timeouts.
    if (response.status === 409) return true;
    // Retry on rate limits.
    if (response.status === 429) return true;
    // Retry internal errors.
    if (response.status >= 500) return true;
    return false;
  }
  async retryRequest(options, retriesRemaining, responseHeaders) {
    var _a;
    retriesRemaining -= 1;
    // About the Retry-After header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
    //
    // TODO: we may want to handle the case where the header is using the http-date syntax: "Retry-After: <http-date>".
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After#syntax for details.
    const retryAfter = parseInt(
      (responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders['retry-after']) ||
        '',
    );
    const maxRetries = (_a = options.maxRetries) !== null && _a !== void 0 ? _a : this.maxRetries;
    const timeout = this.calculateRetryTimeoutSeconds(retriesRemaining, retryAfter, maxRetries) * 1000;
    await (0, exports.sleep)(timeout);
    return this.makeRequest(options, retriesRemaining);
  }
  calculateRetryTimeoutSeconds(retriesRemaining, retryAfter, maxRetries) {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 2;
    // If the API asks us to wait a certain amount of time (and it's a reasonable amount),
    // just do what it says.
    if (Number.isInteger(retryAfter) && retryAfter <= 60) {
      return retryAfter;
    }
    const numRetries = maxRetries - retriesRemaining;
    // Apply exponential backoff, but not more than the max.
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(numRetries - 1, 2), maxRetryDelay);
    // Apply some jitter, plus-or-minus half a second.
    const jitter = Math.random() - 0.5;
    return sleepSeconds + jitter;
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${version_1.VERSION}`;
  }
}
exports.APIClient = APIClient;
class APIResource {
  constructor(client) {
    this.client = client;
    this.get = client.get.bind(client);
    this.post = client.post.bind(client);
    this.patch = client.patch.bind(client);
    this.put = client.put.bind(client);
    this.delete = client.delete.bind(client);
    this.getAPIList = client.getAPIList.bind(client);
  }
}
exports.APIResource = APIResource;
class AbstractPage {
  constructor(client, response, body, options) {
    _AbstractPage_client.set(this, void 0);
    __classPrivateFieldSet(this, _AbstractPage_client, client, 'f');
    this.options = options;
    this.response = response;
    this.body = body;
  }
  hasNextPage() {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageInfo() != null;
  }
  async getNextPage() {
    const nextInfo = this.nextPageInfo();
    if (!nextInfo) {
      throw new Error(
        'No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.',
      );
    }
    const nextOptions = { ...this.options };
    if ('params' in nextInfo) {
      nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
    } else if ('url' in nextInfo) {
      const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
      for (const [key, value] of params) {
        nextInfo.url.searchParams.set(key, value);
      }
      nextOptions.query = undefined;
      nextOptions.path = nextInfo.url.toString();
    }
    return await __classPrivateFieldGet(this, _AbstractPage_client, 'f').requestAPIList(
      this.constructor,
      nextOptions,
    );
  }
  async *iterPages() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let page = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }
  async *[((_AbstractPage_client = new WeakMap()), Symbol.asyncIterator)]() {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
}
exports.AbstractPage = AbstractPage;
/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
class PagePromise extends APIPromise {
  constructor(client, request, Page) {
    super(
      request,
      async (props) => new Page(client, props.response, await defaultParseResponse(props), props.options),
    );
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
}
exports.PagePromise = PagePromise;
const createResponseHeaders = (headers) => {
  return new Proxy(
    Object.fromEntries(
      // @ts-ignore
      headers.entries(),
    ),
    {
      get(target, name) {
        const key = name.toString();
        return target[key.toLowerCase()] || target[key];
      },
    },
  );
};
exports.createResponseHeaders = createResponseHeaders;
// This is required so that we can determine if a given object matches the RequestOptions
// type at runtime. While this requires duplication, it is enforced by the TypeScript
// compiler such that any missing / extraneous keys will cause an error.
const requestOptionsKeys = {
  method: true,
  path: true,
  query: true,
  body: true,
  headers: true,
  maxRetries: true,
  stream: true,
  timeout: true,
  httpAgent: true,
  signal: true,
  idempotencyKey: true,
};
const isRequestOptions = (obj) => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !isEmptyObj(obj) &&
    Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k))
  );
};
exports.isRequestOptions = isRequestOptions;
const getPlatformProperties = () => {
  if (typeof Deno !== 'undefined' && Deno.build != null) {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': version_1.VERSION,
      'X-Stainless-OS': normalizePlatform(Deno.build.os),
      'X-Stainless-Arch': normalizeArch(Deno.build.arch),
      'X-Stainless-Runtime': 'deno',
      'X-Stainless-Runtime-Version': Deno.version,
    };
  }
  if (typeof EdgeRuntime !== 'undefined') {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': version_1.VERSION,
      'X-Stainless-OS': 'Unknown',
      'X-Stainless-Arch': `other:${EdgeRuntime}`,
      'X-Stainless-Runtime': 'edge',
      'X-Stainless-Runtime-Version': process.version,
    };
  }
  // Check if Node.js
  if (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': version_1.VERSION,
      'X-Stainless-OS': normalizePlatform(process.platform),
      'X-Stainless-Arch': normalizeArch(process.arch),
      'X-Stainless-Runtime': 'node',
      'X-Stainless-Runtime-Version': process.version,
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': version_1.VERSION,
      'X-Stainless-OS': 'Unknown',
      'X-Stainless-Arch': 'unknown',
      'X-Stainless-Runtime': `browser:${browserInfo.browser}`,
      'X-Stainless-Runtime-Version': browserInfo.version,
    };
  }
  // TODO add support for Cloudflare workers, etc.
  return {
    'X-Stainless-Lang': 'js',
    'X-Stainless-Package-Version': version_1.VERSION,
    'X-Stainless-OS': 'Unknown',
    'X-Stainless-Arch': 'unknown',
    'X-Stainless-Runtime': 'unknown',
    'X-Stainless-Runtime-Version': 'unknown',
  };
};
// Note: modified from https://github.com/JS-DevTools/host-environment/blob/b1ab79ecde37db5d6e163c050e54fe7d287d7c92/src/isomorphic.browser.ts
function getBrowserInfo() {
  if (typeof navigator === 'undefined' || !navigator) {
    return null;
  }
  // NOTE: The order matters here!
  const browserPatterns = [
    { key: 'edge', pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'ie', pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'ie', pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'chrome', pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'firefox', pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'safari', pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ },
  ];
  // Find the FIRST matching browser
  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec(navigator.userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
const normalizeArch = (arch) => {
  // Node docs:
  // - https://nodejs.org/api/process.html#processarch
  // Deno docs:
  // - https://doc.deno.land/deno/stable/~/Deno.build
  if (arch === 'x32') return 'x32';
  if (arch === 'x86_64' || arch === 'x64') return 'x64';
  if (arch === 'arm') return 'arm';
  if (arch === 'aarch64' || arch === 'arm64') return 'arm64';
  if (arch) return `other:${arch}`;
  return 'unknown';
};
const normalizePlatform = (platform) => {
  // Node platforms:
  // - https://nodejs.org/api/process.html#processplatform
  // Deno platforms:
  // - https://doc.deno.land/deno/stable/~/Deno.build
  // - https://github.com/denoland/deno/issues/14799
  platform = platform.toLowerCase();
  // NOTE: this iOS check is untested and may not work
  // Node does not work natively on IOS, there is a fork at
  // https://github.com/nodejs-mobile/nodejs-mobile
  // however it is unknown at the time of writing how to detect if it is running
  if (platform.includes('ios')) return 'iOS';
  if (platform === 'android') return 'Android';
  if (platform === 'darwin') return 'MacOS';
  if (platform === 'win32') return 'Windows';
  if (platform === 'freebsd') return 'FreeBSD';
  if (platform === 'openbsd') return 'OpenBSD';
  if (platform === 'linux') return 'Linux';
  if (platform) return `Other:${platform}`;
  return 'Unknown';
};
let _platformHeaders;
const getPlatformHeaders = () => {
  return _platformHeaders !== null && _platformHeaders !== void 0 ?
      _platformHeaders
    : (_platformHeaders = getPlatformProperties());
};
const safeJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return undefined;
  }
};
exports.safeJSON = safeJSON;
// https://stackoverflow.com/a/19709846
const startsWithSchemeRegexp = new RegExp('^(?:[a-z]+:)?//', 'i');
const isAbsoluteURL = (url) => {
  return startsWithSchemeRegexp.test(url);
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
const validatePositiveInteger = (name, n) => {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new Error(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return n;
};
const castToError = (err) => {
  if (err instanceof Error) return err;
  return new Error(err);
};
exports.castToError = castToError;
const ensurePresent = (value) => {
  if (value == null) throw new Error(`Expected a value to be given but received ${value} instead.`);
  return value;
};
exports.ensurePresent = ensurePresent;
/**
 * Read an environment variable.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */
const readEnv = (env) => {
  var _a, _b, _c, _d;
  if (typeof process !== 'undefined') {
    return (_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a[env]) !== null && _b !== void 0 ?
        _b
      : undefined;
  }
  if (typeof Deno !== 'undefined') {
    return (_d = (_c = Deno.env) === null || _c === void 0 ? void 0 : _c.get) === null || _d === void 0 ?
        void 0
      : _d.call(_c, env);
  }
  return undefined;
};
exports.readEnv = readEnv;
const coerceInteger = (value) => {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value === 'string') return parseInt(value, 10);
  throw new Error(`Could not coerce ${value} (type: ${typeof value}) into a number`);
};
exports.coerceInteger = coerceInteger;
const coerceFloat = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  throw new Error(`Could not coerce ${value} (type: ${typeof value}) into a number`);
};
exports.coerceFloat = coerceFloat;
const coerceBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
};
exports.coerceBoolean = coerceBoolean;
const maybeCoerceInteger = (value) => {
  if (value === undefined) {
    return undefined;
  }
  return (0, exports.coerceInteger)(value);
};
exports.maybeCoerceInteger = maybeCoerceInteger;
const maybeCoerceFloat = (value) => {
  if (value === undefined) {
    return undefined;
  }
  return (0, exports.coerceFloat)(value);
};
exports.maybeCoerceFloat = maybeCoerceFloat;
const maybeCoerceBoolean = (value) => {
  if (value === undefined) {
    return undefined;
  }
  return (0, exports.coerceBoolean)(value);
};
exports.maybeCoerceBoolean = maybeCoerceBoolean;
// https://stackoverflow.com/a/34491287
function isEmptyObj(obj) {
  if (!obj) return true;
  for (const _k in obj) return false;
  return true;
}
exports.isEmptyObj = isEmptyObj;
// https://eslint.org/docs/latest/rules/no-prototype-builtins
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
exports.hasOwn = hasOwn;
function debug(action, ...args) {
  if (typeof process !== 'undefined' && process.env['DEBUG'] === 'true') {
    console.log(`OpenAI:DEBUG:${action}`, ...args);
  }
}
exports.debug = debug;
/**
 * https://stackoverflow.com/a/2117523
 */
const uuid4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const isRunningInBrowser = () => {
  return (
    // @ts-ignore
    typeof window !== 'undefined' &&
    // @ts-ignore
    typeof window.document !== 'undefined' &&
    // @ts-ignore
    typeof navigator !== 'undefined'
  );
};
exports.isRunningInBrowser = isRunningInBrowser;
const isHeadersProtocol = (headers) => {
  return typeof (headers === null || headers === void 0 ? void 0 : headers.get) === 'function';
};
exports.isHeadersProtocol = isHeadersProtocol;
const getHeader = (headers, key) => {
  const lowerKey = key.toLowerCase();
  if ((0, exports.isHeadersProtocol)(headers)) return headers.get(key) || headers.get(lowerKey);
  const value = headers[key] || headers[lowerKey];
  if (Array.isArray(value)) {
    if (value.length <= 1) return value[0];
    console.warn(`Received ${value.length} entries for the ${key} header, using the first entry.`);
    return value[0];
  }
  return value;
};
exports.getHeader = getHeader;
/**
 * Encodes a string to Base64 format.
 */
const toBase64 = (str) => {
  if (!str) return '';
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  throw new Error('Cannot generate b64 string; Expected `Buffer` or `btoa` to be defined');
};
exports.toBase64 = toBase64;
//# sourceMappingURL=core.js.map


/***/ }),

/***/ 8905:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InternalServerError =
  exports.RateLimitError =
  exports.UnprocessableEntityError =
  exports.ConflictError =
  exports.NotFoundError =
  exports.PermissionDeniedError =
  exports.AuthenticationError =
  exports.BadRequestError =
  exports.APIConnectionTimeoutError =
  exports.APIConnectionError =
  exports.APIUserAbortError =
  exports.APIError =
    void 0;
const core_1 = __nccwpck_require__(1798);
class APIError extends Error {
  constructor(status, error, message, headers) {
    super(APIError.makeMessage(error, message));
    this.status = status;
    this.headers = headers;
    const data = error;
    this.error = data;
    this.code = data === null || data === void 0 ? void 0 : data['code'];
    this.param = data === null || data === void 0 ? void 0 : data['param'];
    this.type = data === null || data === void 0 ? void 0 : data['type'];
  }
  static makeMessage(error, message) {
    return (
      (
        error === null || error === void 0 ? void 0 : error.message
      ) ?
        typeof error.message === 'string' ? error.message
        : JSON.stringify(error.message)
      : error ? JSON.stringify(error)
      : message || 'Unknown error occurred'
    );
  }
  static generate(status, errorResponse, message, headers) {
    if (!status) {
      return new APIConnectionError({ cause: (0, core_1.castToError)(errorResponse) });
    }
    const error = errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse['error'];
    if (status === 400) {
      return new BadRequestError(status, error, message, headers);
    }
    if (status === 401) {
      return new AuthenticationError(status, error, message, headers);
    }
    if (status === 403) {
      return new PermissionDeniedError(status, error, message, headers);
    }
    if (status === 404) {
      return new NotFoundError(status, error, message, headers);
    }
    if (status === 409) {
      return new ConflictError(status, error, message, headers);
    }
    if (status === 422) {
      return new UnprocessableEntityError(status, error, message, headers);
    }
    if (status === 429) {
      return new RateLimitError(status, error, message, headers);
    }
    if (status >= 500) {
      return new InternalServerError(status, error, message, headers);
    }
    return new APIError(status, error, message, headers);
  }
}
exports.APIError = APIError;
class APIUserAbortError extends APIError {
  constructor({ message } = {}) {
    super(undefined, undefined, message || 'Request was aborted.', undefined);
    this.status = undefined;
  }
}
exports.APIUserAbortError = APIUserAbortError;
class APIConnectionError extends APIError {
  constructor({ message, cause }) {
    super(undefined, undefined, message || 'Connection error.', undefined);
    this.status = undefined;
    // in some environments the 'cause' property is already declared
    // @ts-ignore
    if (cause) this.cause = cause;
  }
}
exports.APIConnectionError = APIConnectionError;
class APIConnectionTimeoutError extends APIConnectionError {
  constructor({ message } = {}) {
    super({ message: message !== null && message !== void 0 ? message : 'Request timed out.' });
  }
}
exports.APIConnectionTimeoutError = APIConnectionTimeoutError;
class BadRequestError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 400;
  }
}
exports.BadRequestError = BadRequestError;
class AuthenticationError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 401;
  }
}
exports.AuthenticationError = AuthenticationError;
class PermissionDeniedError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 403;
  }
}
exports.PermissionDeniedError = PermissionDeniedError;
class NotFoundError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 404;
  }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 409;
  }
}
exports.ConflictError = ConflictError;
class UnprocessableEntityError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 422;
  }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class RateLimitError extends APIError {
  constructor() {
    super(...arguments);
    this.status = 429;
  }
}
exports.RateLimitError = RateLimitError;
class InternalServerError extends APIError {}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=error.js.map


/***/ }),

/***/ 47:
/***/ (function(module, exports, __nccwpck_require__) {

"use strict";

// File generated from our OpenAPI spec by Stainless.
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create ?
    function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function () {
            return m[k];
          },
        };
      }
      Object.defineProperty(o, k2, desc);
    }
  : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create ?
    function (o, v) {
      Object.defineProperty(o, 'default', { enumerable: true, value: v });
    }
  : function (o, v) {
      o['default'] = v;
    });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fileFromPath =
  exports.toFile =
  exports.UnprocessableEntityError =
  exports.PermissionDeniedError =
  exports.InternalServerError =
  exports.AuthenticationError =
  exports.BadRequestError =
  exports.RateLimitError =
  exports.ConflictError =
  exports.NotFoundError =
  exports.APIUserAbortError =
  exports.APIConnectionTimeoutError =
  exports.APIConnectionError =
  exports.APIError =
  exports.OpenAI =
    void 0;
const Core = __importStar(__nccwpck_require__(1798));
const Pagination = __importStar(__nccwpck_require__(7401));
const API = __importStar(__nccwpck_require__(5690));
const Errors = __importStar(__nccwpck_require__(8905));
const Uploads = __importStar(__nccwpck_require__(3394));
/** API Client for interfacing with the OpenAI API. */
class OpenAI extends Core.APIClient {
  /**
   * API Client for interfacing with the OpenAI API.
   *
   * @param {string} [opts.apiKey=process.env['OPENAI_API_KEY']] - The API Key to send to the API.
   * @param {string} [opts.baseURL] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   * @param {string | null} [opts.organization]
   */
  constructor(_b) {
    var _c, _d, _e;
    var {
      apiKey = Core.readEnv('OPENAI_API_KEY'),
      organization = (_c = Core.readEnv('OPENAI_ORG_ID')) !== null && _c !== void 0 ? _c : null,
      ...opts
    } = _b === void 0 ? {} : _b;
    if (apiKey === undefined) {
      throw new Error(
        "The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'my apiKey' }).",
      );
    }
    const options = {
      apiKey,
      organization,
      ...opts,
      baseURL: (_d = opts.baseURL) !== null && _d !== void 0 ? _d : `https://api.openai.com/v1`,
    };
    if (!options.dangerouslyAllowBrowser && Core.isRunningInBrowser()) {
      throw new Error(
        "It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n",
      );
    }
    super({
      baseURL: options.baseURL,
      timeout: (_e = options.timeout) !== null && _e !== void 0 ? _e : 600000 /* 10 minutes */,
      httpAgent: options.httpAgent,
      maxRetries: options.maxRetries,
      fetch: options.fetch,
    });
    this.completions = new API.Completions(this);
    this.chat = new API.Chat(this);
    this.edits = new API.Edits(this);
    this.embeddings = new API.Embeddings(this);
    this.files = new API.Files(this);
    this.images = new API.Images(this);
    this.audio = new API.Audio(this);
    this.moderations = new API.Moderations(this);
    this.models = new API.Models(this);
    this.fineTuning = new API.FineTuning(this);
    this.fineTunes = new API.FineTunes(this);
    this._options = options;
    this.apiKey = apiKey;
    this.organization = organization;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  defaultHeaders(opts) {
    return {
      ...super.defaultHeaders(opts),
      'OpenAI-Organization': this.organization,
      ...this._options.defaultHeaders,
    };
  }
  authHeaders(opts) {
    return { Authorization: `Bearer ${this.apiKey}` };
  }
}
exports.OpenAI = OpenAI;
_a = OpenAI;
OpenAI.OpenAI = _a;
OpenAI.APIError = Errors.APIError;
OpenAI.APIConnectionError = Errors.APIConnectionError;
OpenAI.APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
OpenAI.APIUserAbortError = Errors.APIUserAbortError;
OpenAI.NotFoundError = Errors.NotFoundError;
OpenAI.ConflictError = Errors.ConflictError;
OpenAI.RateLimitError = Errors.RateLimitError;
OpenAI.BadRequestError = Errors.BadRequestError;
OpenAI.AuthenticationError = Errors.AuthenticationError;
OpenAI.InternalServerError = Errors.InternalServerError;
OpenAI.PermissionDeniedError = Errors.PermissionDeniedError;
OpenAI.UnprocessableEntityError = Errors.UnprocessableEntityError;
(exports.APIError = Errors.APIError),
  (exports.APIConnectionError = Errors.APIConnectionError),
  (exports.APIConnectionTimeoutError = Errors.APIConnectionTimeoutError),
  (exports.APIUserAbortError = Errors.APIUserAbortError),
  (exports.NotFoundError = Errors.NotFoundError),
  (exports.ConflictError = Errors.ConflictError),
  (exports.RateLimitError = Errors.RateLimitError),
  (exports.BadRequestError = Errors.BadRequestError),
  (exports.AuthenticationError = Errors.AuthenticationError),
  (exports.InternalServerError = Errors.InternalServerError),
  (exports.PermissionDeniedError = Errors.PermissionDeniedError),
  (exports.UnprocessableEntityError = Errors.UnprocessableEntityError);
exports.toFile = Uploads.toFile;
exports.fileFromPath = Uploads.fileFromPath;
(function (OpenAI) {
  // Helper functions
  OpenAI.toFile = Uploads.toFile;
  OpenAI.fileFromPath = Uploads.fileFromPath;
  OpenAI.Page = Pagination.Page;
  OpenAI.CursorPage = Pagination.CursorPage;
  OpenAI.Completions = API.Completions;
  OpenAI.Chat = API.Chat;
  OpenAI.Edits = API.Edits;
  OpenAI.Embeddings = API.Embeddings;
  OpenAI.Files = API.Files;
  OpenAI.FileObjectsPage = API.FileObjectsPage;
  OpenAI.Images = API.Images;
  OpenAI.Audio = API.Audio;
  OpenAI.Moderations = API.Moderations;
  OpenAI.Models = API.Models;
  OpenAI.ModelsPage = API.ModelsPage;
  OpenAI.FineTuning = API.FineTuning;
  OpenAI.FineTunes = API.FineTunes;
  OpenAI.FineTunesPage = API.FineTunesPage;
})((OpenAI = exports.OpenAI || (exports.OpenAI = {})));
exports = module.exports = OpenAI;
exports["default"] = OpenAI;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 7401:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CursorPage = exports.Page = void 0;
const core_1 = __nccwpck_require__(1798);
/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
class Page extends core_1.AbstractPage {
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.object = body.object;
    this.data = body.data;
  }
  getPaginatedItems() {
    return this.data;
  }
  // @deprecated Please use `nextPageInfo()` instead
  /**
   * This page represents a response that isn't actually paginated at the API level
   * so there will never be any next page params.
   */
  nextPageParams() {
    return null;
  }
  nextPageInfo() {
    return null;
  }
}
exports.Page = Page;
class CursorPage extends core_1.AbstractPage {
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data;
  }
  getPaginatedItems() {
    return this.data;
  }
  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams() {
    const info = this.nextPageInfo();
    if (!info) return null;
    if ('params' in info) return info.params;
    const params = Object.fromEntries(info.url.searchParams);
    if (!Object.keys(params).length) return null;
    return params;
  }
  nextPageInfo() {
    var _a, _b;
    if (!((_a = this.data) === null || _a === void 0 ? void 0 : _a.length)) {
      return null;
    }
    const next = (_b = this.data[this.data.length - 1]) === null || _b === void 0 ? void 0 : _b.id;
    if (!next) return null;
    return { params: { after: next } };
  }
}
exports.CursorPage = CursorPage;
//# sourceMappingURL=pagination.js.map


/***/ }),

/***/ 6376:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// File generated from our OpenAPI spec by Stainless.
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create ?
    function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function () {
            return m[k];
          },
        };
      }
      Object.defineProperty(o, k2, desc);
    }
  : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create ?
    function (o, v) {
      Object.defineProperty(o, 'default', { enumerable: true, value: v });
    }
  : function (o, v) {
      o['default'] = v;
    });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Audio = void 0;
const resource_1 = __nccwpck_require__(8733);
const transcriptions_1 = __nccwpck_require__(5622);
const translations_1 = __nccwpck_require__(7735);
const API = __importStar(__nccwpck_require__(6750));
class Audio extends resource_1.APIResource {
  constructor() {
    super(...arguments);
    this.transcriptions = new transcriptions_1.Transcriptions(this.client);
    this.translations = new translations_1.Translations(this.client);
  }
}
exports.Audio = Audio;
(function (Audio) {
  Audio.Transcriptions = API.Transcriptions;
  Audio.Translations = API.Translations;
})((Audio = exports.Audio || (exports.Audio = {})));
//# sourceMappingURL=audio.js.map


/***/ }),

/***/ 6750:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Translations = exports.Transcriptions = exports.Audio = void 0;
var audio_1 = __nccwpck_require__(6376);
Object.defineProperty(exports, "Audio", ({
  enumerable: true,
  get: function () {
    return audio_1.Audio;
  },
}));
var transcriptions_1 = __nccwpck_require__(5622);
Object.defineProperty(exports, "Transcriptions", ({
  enumerable: true,
  get: function () {
    return transcriptions_1.Transcriptions;
  },
}));
var translations_1 = __nccwpck_require__(7735);
Object.defineProperty(exports, "Translations", ({
  enumerable: true,
  get: function () {
    return translations_1.Translations;
  },
}));
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 5622:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transcriptions = void 0;
const resource_1 = __nccwpck_require__(8733);
const core_1 = __nccwpck_require__(7093);
class Transcriptions extends resource_1.APIResource {
  /**
   * Transcribes audio into the input language.
   */
  create(body, options) {
    return this.post('/audio/transcriptions', (0, core_1.multipartFormRequestOptions)({ body, ...options }));
  }
}
exports.Transcriptions = Transcriptions;
(function (Transcriptions) {})((Transcriptions = exports.Transcriptions || (exports.Transcriptions = {})));
//# sourceMappingURL=transcriptions.js.map


/***/ }),

/***/ 7735:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Translations = void 0;
const resource_1 = __nccwpck_require__(8733);
const core_1 = __nccwpck_require__(7093);
class Translations extends resource_1.APIResource {
  /**
   * Translates audio into English.
   */
  create(body, options) {
    return this.post('/audio/translations', (0, core_1.multipartFormRequestOptions)({ body, ...options }));
  }
}
exports.Translations = Translations;
(function (Translations) {})((Translations = exports.Translations || (exports.Translations = {})));
//# sourceMappingURL=translations.js.map


/***/ }),

/***/ 7670:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// File generated from our OpenAPI spec by Stainless.
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create ?
    function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function () {
            return m[k];
          },
        };
      }
      Object.defineProperty(o, k2, desc);
    }
  : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create ?
    function (o, v) {
      Object.defineProperty(o, 'default', { enumerable: true, value: v });
    }
  : function (o, v) {
      o['default'] = v;
    });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Chat = void 0;
const resource_1 = __nccwpck_require__(8733);
const completions_1 = __nccwpck_require__(2875);
const API = __importStar(__nccwpck_require__(8240));
class Chat extends resource_1.APIResource {
  constructor() {
    super(...arguments);
    this.completions = new completions_1.Completions(this.client);
  }
}
exports.Chat = Chat;
(function (Chat) {
  Chat.Completions = API.Completions;
})((Chat = exports.Chat || (exports.Chat = {})));
//# sourceMappingURL=chat.js.map


/***/ }),

/***/ 2875:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Completions = void 0;
const resource_1 = __nccwpck_require__(8733);
class Completions extends resource_1.APIResource {
  create(body, options) {
    var _a;
    return this.post('/chat/completions', {
      body,
      ...options,
      stream: (_a = body.stream) !== null && _a !== void 0 ? _a : false,
    });
  }
}
exports.Completions = Completions;
(function (Completions) {})((Completions = exports.Completions || (exports.Completions = {})));
//# sourceMappingURL=completions.js.map


/***/ }),

/***/ 8240:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Completions = exports.Chat = void 0;
var chat_1 = __nccwpck_require__(7670);
Object.defineProperty(exports, "Chat", ({
  enumerable: true,
  get: function () {
    return chat_1.Chat;
  },
}));
var completions_1 = __nccwpck_require__(2875);
Object.defineProperty(exports, "Completions", ({
  enumerable: true,
  get: function () {
    return completions_1.Completions;
  },
}));
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9327:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Completions = void 0;
const resource_1 = __nccwpck_require__(8733);
class Completions extends resource_1.APIResource {
  create(body, options) {
    var _a;
    return this.post('/completions', {
      body,
      ...options,
      stream: (_a = body.stream) !== null && _a !== void 0 ? _a : false,
    });
  }
}
exports.Completions = Completions;
(function (Completions) {})((Completions = exports.Completions || (exports.Completions = {})));
//# sourceMappingURL=completions.js.map


/***/ }),

/***/ 4259:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Edits = void 0;
const resource_1 = __nccwpck_require__(8733);
class Edits extends resource_1.APIResource {
  /**
   * Creates a new edit for the provided input, instruction, and parameters.
   *
   * @deprecated The Edits API is deprecated; please use Chat Completions instead.
   *
   * https://openai.com/blog/gpt-4-api-general-availability#deprecation-of-the-edits-api
   */
  create(body, options) {
    return this.post('/edits', { body, ...options });
  }
}
exports.Edits = Edits;
(function (Edits) {})((Edits = exports.Edits || (exports.Edits = {})));
//# sourceMappingURL=edits.js.map


/***/ }),

/***/ 8064:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Embeddings = void 0;
const resource_1 = __nccwpck_require__(8733);
class Embeddings extends resource_1.APIResource {
  /**
   * Creates an embedding vector representing the input text.
   */
  create(body, options) {
    return this.post('/embeddings', { body, ...options });
  }
}
exports.Embeddings = Embeddings;
(function (Embeddings) {})((Embeddings = exports.Embeddings || (exports.Embeddings = {})));
//# sourceMappingURL=embeddings.js.map


/***/ }),

/***/ 3873:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileObjectsPage = exports.Files = void 0;
const resource_1 = __nccwpck_require__(8733);
const core_1 = __nccwpck_require__(7093);
const error_1 = __nccwpck_require__(8562);
const core_2 = __nccwpck_require__(7093);
const pagination_1 = __nccwpck_require__(812);
class Files extends resource_1.APIResource {
  /**
   * Upload a file that contains document(s) to be used across various
   * endpoints/features. Currently, the size of all the files uploaded by one
   * organization can be up to 1 GB. Please contact us if you need to increase the
   * storage limit.
   */
  create(body, options) {
    return this.post('/files', (0, core_2.multipartFormRequestOptions)({ body, ...options }));
  }
  /**
   * Returns information about a specific file.
   */
  retrieve(fileId, options) {
    return this.get(`/files/${fileId}`, options);
  }
  /**
   * Returns a list of files that belong to the user's organization.
   */
  list(options) {
    return this.getAPIList('/files', FileObjectsPage, options);
  }
  /**
   * Delete a file.
   */
  del(fileId, options) {
    return this.delete(`/files/${fileId}`, options);
  }
  /**
   * Returns the contents of the specified file
   */
  retrieveContent(fileId, options) {
    return this.get(`/files/${fileId}/content`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options === null || options === void 0 ? void 0 : options.headers),
      },
    });
  }
  /**
   * Waits for the given file to be processed, default timeout is 30 mins.
   */
  async waitForProcessing(id, { pollInterval = 5000, maxWait = 30 * 60 * 1000 } = {}) {
    const TERMINAL_STATES = new Set(['processed', 'error', 'deleted']);
    const start = Date.now();
    let file = await this.retrieve(id);
    while (!file.status || !TERMINAL_STATES.has(file.status)) {
      await (0, core_1.sleep)(pollInterval);
      file = await this.retrieve(id);
      if (Date.now() - start > maxWait) {
        throw new error_1.APIConnectionTimeoutError({
          message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`,
        });
      }
    }
    return file;
  }
}
exports.Files = Files;
/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
class FileObjectsPage extends pagination_1.Page {}
exports.FileObjectsPage = FileObjectsPage;
(function (Files) {})((Files = exports.Files || (exports.Files = {})));
//# sourceMappingURL=files.js.map


/***/ }),

/***/ 3379:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineTunesPage = exports.FineTunes = void 0;
const resource_1 = __nccwpck_require__(8733);
const pagination_1 = __nccwpck_require__(812);
class FineTunes extends resource_1.APIResource {
  /**
   * Creates a job that fine-tunes a specified model from a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](/docs/guides/legacy-fine-tuning)
   */
  create(body, options) {
    return this.post('/fine-tunes', { body, ...options });
  }
  /**
   * Gets info about the fine-tune job.
   *
   * [Learn more about fine-tuning](/docs/guides/legacy-fine-tuning)
   */
  retrieve(fineTuneId, options) {
    return this.get(`/fine-tunes/${fineTuneId}`, options);
  }
  /**
   * List your organization's fine-tuning jobs
   */
  list(options) {
    return this.getAPIList('/fine-tunes', FineTunesPage, options);
  }
  /**
   * Immediately cancel a fine-tune job.
   */
  cancel(fineTuneId, options) {
    return this.post(`/fine-tunes/${fineTuneId}/cancel`, options);
  }
  listEvents(fineTuneId, query, options) {
    var _a;
    return this.get(`/fine-tunes/${fineTuneId}/events`, {
      query,
      timeout: 86400000,
      ...options,
      stream:
        (_a = query === null || query === void 0 ? void 0 : query.stream) !== null && _a !== void 0 ?
          _a
        : false,
    });
  }
}
exports.FineTunes = FineTunes;
/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
class FineTunesPage extends pagination_1.Page {}
exports.FineTunesPage = FineTunesPage;
(function (FineTunes) {})((FineTunes = exports.FineTunes || (exports.FineTunes = {})));
//# sourceMappingURL=fine-tunes.js.map


/***/ }),

/***/ 1364:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// File generated from our OpenAPI spec by Stainless.
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create ?
    function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function () {
            return m[k];
          },
        };
      }
      Object.defineProperty(o, k2, desc);
    }
  : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create ?
    function (o, v) {
      Object.defineProperty(o, 'default', { enumerable: true, value: v });
    }
  : function (o, v) {
      o['default'] = v;
    });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineTuning = void 0;
const resource_1 = __nccwpck_require__(8733);
const jobs_1 = __nccwpck_require__(4900);
const API = __importStar(__nccwpck_require__(8093));
class FineTuning extends resource_1.APIResource {
  constructor() {
    super(...arguments);
    this.jobs = new jobs_1.Jobs(this.client);
  }
}
exports.FineTuning = FineTuning;
(function (FineTuning) {
  FineTuning.Jobs = API.Jobs;
  FineTuning.FineTuningJobsPage = API.FineTuningJobsPage;
  FineTuning.FineTuningJobEventsPage = API.FineTuningJobEventsPage;
})((FineTuning = exports.FineTuning || (exports.FineTuning = {})));
//# sourceMappingURL=fine-tuning.js.map


/***/ }),

/***/ 8093:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Jobs = exports.FineTuningJobEventsPage = exports.FineTuningJobsPage = exports.FineTuning = void 0;
var fine_tuning_1 = __nccwpck_require__(1364);
Object.defineProperty(exports, "FineTuning", ({
  enumerable: true,
  get: function () {
    return fine_tuning_1.FineTuning;
  },
}));
var jobs_1 = __nccwpck_require__(4900);
Object.defineProperty(exports, "FineTuningJobsPage", ({
  enumerable: true,
  get: function () {
    return jobs_1.FineTuningJobsPage;
  },
}));
Object.defineProperty(exports, "FineTuningJobEventsPage", ({
  enumerable: true,
  get: function () {
    return jobs_1.FineTuningJobEventsPage;
  },
}));
Object.defineProperty(exports, "Jobs", ({
  enumerable: true,
  get: function () {
    return jobs_1.Jobs;
  },
}));
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FineTuningJobEventsPage = exports.FineTuningJobsPage = exports.Jobs = void 0;
const resource_1 = __nccwpck_require__(8733);
const core_1 = __nccwpck_require__(7093);
const pagination_1 = __nccwpck_require__(812);
class Jobs extends resource_1.APIResource {
  /**
   * Creates a job that fine-tunes a specified model from a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](/docs/guides/fine-tuning)
   */
  create(body, options) {
    return this.post('/fine_tuning/jobs', { body, ...options });
  }
  /**
   * Get info about a fine-tuning job.
   *
   * [Learn more about fine-tuning](/docs/guides/fine-tuning)
   */
  retrieve(fineTuningJobId, options) {
    return this.get(`/fine_tuning/jobs/${fineTuningJobId}`, options);
  }
  list(query = {}, options) {
    if ((0, core_1.isRequestOptions)(query)) {
      return this.list({}, query);
    }
    return this.getAPIList('/fine_tuning/jobs', FineTuningJobsPage, { query, ...options });
  }
  /**
   * Immediately cancel a fine-tune job.
   */
  cancel(fineTuningJobId, options) {
    return this.post(`/fine_tuning/jobs/${fineTuningJobId}/cancel`, options);
  }
  listEvents(fineTuningJobId, query = {}, options) {
    if ((0, core_1.isRequestOptions)(query)) {
      return this.listEvents(fineTuningJobId, {}, query);
    }
    return this.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/events`, FineTuningJobEventsPage, {
      query,
      ...options,
    });
  }
}
exports.Jobs = Jobs;
class FineTuningJobsPage extends pagination_1.CursorPage {}
exports.FineTuningJobsPage = FineTuningJobsPage;
class FineTuningJobEventsPage extends pagination_1.CursorPage {}
exports.FineTuningJobEventsPage = FineTuningJobEventsPage;
(function (Jobs) {})((Jobs = exports.Jobs || (exports.Jobs = {})));
//# sourceMappingURL=jobs.js.map


/***/ }),

/***/ 2621:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Images = void 0;
const resource_1 = __nccwpck_require__(8733);
const core_1 = __nccwpck_require__(7093);
class Images extends resource_1.APIResource {
  /**
   * Creates a variation of a given image.
   */
  createVariation(body, options) {
    return this.post('/images/variations', (0, core_1.multipartFormRequestOptions)({ body, ...options }));
  }
  /**
   * Creates an edited or extended image given an original image and a prompt.
   */
  edit(body, options) {
    return this.post('/images/edits', (0, core_1.multipartFormRequestOptions)({ body, ...options }));
  }
  /**
   * Creates an image given a prompt.
   */
  generate(body, options) {
    return this.post('/images/generations', { body, ...options });
  }
}
exports.Images = Images;
(function (Images) {})((Images = exports.Images || (exports.Images = {})));
//# sourceMappingURL=images.js.map


/***/ }),

/***/ 5690:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Moderations =
  exports.Models =
  exports.ModelsPage =
  exports.Images =
  exports.FineTuning =
  exports.FineTunes =
  exports.FineTunesPage =
  exports.Files =
  exports.FileObjectsPage =
  exports.Edits =
  exports.Embeddings =
  exports.Completions =
  exports.Chat =
  exports.Audio =
    void 0;
var audio_1 = __nccwpck_require__(6376);
Object.defineProperty(exports, "Audio", ({
  enumerable: true,
  get: function () {
    return audio_1.Audio;
  },
}));
var chat_1 = __nccwpck_require__(7670);
Object.defineProperty(exports, "Chat", ({
  enumerable: true,
  get: function () {
    return chat_1.Chat;
  },
}));
var completions_1 = __nccwpck_require__(9327);
Object.defineProperty(exports, "Completions", ({
  enumerable: true,
  get: function () {
    return completions_1.Completions;
  },
}));
var embeddings_1 = __nccwpck_require__(8064);
Object.defineProperty(exports, "Embeddings", ({
  enumerable: true,
  get: function () {
    return embeddings_1.Embeddings;
  },
}));
var edits_1 = __nccwpck_require__(4259);
Object.defineProperty(exports, "Edits", ({
  enumerable: true,
  get: function () {
    return edits_1.Edits;
  },
}));
var files_1 = __nccwpck_require__(3873);
Object.defineProperty(exports, "FileObjectsPage", ({
  enumerable: true,
  get: function () {
    return files_1.FileObjectsPage;
  },
}));
Object.defineProperty(exports, "Files", ({
  enumerable: true,
  get: function () {
    return files_1.Files;
  },
}));
var fine_tunes_1 = __nccwpck_require__(3379);
Object.defineProperty(exports, "FineTunesPage", ({
  enumerable: true,
  get: function () {
    return fine_tunes_1.FineTunesPage;
  },
}));
Object.defineProperty(exports, "FineTunes", ({
  enumerable: true,
  get: function () {
    return fine_tunes_1.FineTunes;
  },
}));
var fine_tuning_1 = __nccwpck_require__(1364);
Object.defineProperty(exports, "FineTuning", ({
  enumerable: true,
  get: function () {
    return fine_tuning_1.FineTuning;
  },
}));
var images_1 = __nccwpck_require__(2621);
Object.defineProperty(exports, "Images", ({
  enumerable: true,
  get: function () {
    return images_1.Images;
  },
}));
var models_1 = __nccwpck_require__(6467);
Object.defineProperty(exports, "ModelsPage", ({
  enumerable: true,
  get: function () {
    return models_1.ModelsPage;
  },
}));
Object.defineProperty(exports, "Models", ({
  enumerable: true,
  get: function () {
    return models_1.Models;
  },
}));
var moderations_1 = __nccwpck_require__(2085);
Object.defineProperty(exports, "Moderations", ({
  enumerable: true,
  get: function () {
    return moderations_1.Moderations;
  },
}));
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6467:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelsPage = exports.Models = void 0;
const resource_1 = __nccwpck_require__(8733);
const pagination_1 = __nccwpck_require__(812);
class Models extends resource_1.APIResource {
  /**
   * Retrieves a model instance, providing basic information about the model such as
   * the owner and permissioning.
   */
  retrieve(model, options) {
    return this.get(`/models/${model}`, options);
  }
  /**
   * Lists the currently available models, and provides basic information about each
   * one such as the owner and availability.
   */
  list(options) {
    return this.getAPIList('/models', ModelsPage, options);
  }
  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization to
   * delete a model.
   */
  del(model, options) {
    return this.delete(`/models/${model}`, options);
  }
}
exports.Models = Models;
/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
class ModelsPage extends pagination_1.Page {}
exports.ModelsPage = ModelsPage;
(function (Models) {})((Models = exports.Models || (exports.Models = {})));
//# sourceMappingURL=models.js.map


/***/ }),

/***/ 2085:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// File generated from our OpenAPI spec by Stainless.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Moderations = void 0;
const resource_1 = __nccwpck_require__(8733);
class Moderations extends resource_1.APIResource {
  /**
   * Classifies if text violates OpenAI's Content Policy
   */
  create(body, options) {
    return this.post('/moderations', { body, ...options });
  }
}
exports.Moderations = Moderations;
(function (Moderations) {})((Moderations = exports.Moderations || (exports.Moderations = {})));
//# sourceMappingURL=moderations.js.map


/***/ }),

/***/ 884:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Stream = void 0;
class Stream {
  constructor(response, controller) {
    this.response = response;
    this.controller = controller;
    this.decoder = new SSEDecoder();
  }
  async *iterMessages() {
    if (!this.response.body) {
      this.controller.abort();
      throw new Error(`Attempted to iterate over a response with no body`);
    }
    const lineDecoder = new LineDecoder();
    const iter = readableStreamAsyncIterable(this.response.body);
    for await (const chunk of iter) {
      for (const line of lineDecoder.decode(chunk)) {
        const sse = this.decoder.decode(line);
        if (sse) yield sse;
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = this.decoder.decode(line);
      if (sse) yield sse;
    }
  }
  async *[Symbol.asyncIterator]() {
    let done = false;
    try {
      for await (const sse of this.iterMessages()) {
        if (done) continue;
        if (sse.data.startsWith('[DONE]')) {
          done = true;
          continue;
        }
        if (sse.event === null) {
          try {
            yield JSON.parse(sse.data);
          } catch (e) {
            console.error(`Could not parse message into JSON:`, sse.data);
            console.error(`From chunk:`, sse.raw);
            throw e;
          }
        }
      }
      done = true;
    } catch (e) {
      // If the user calls `stream.controller.abort()`, we should exit without throwing.
      if (e instanceof Error && e.name === 'AbortError') return;
      throw e;
    } finally {
      // If the user `break`s, abort the ongoing request.
      if (!done) this.controller.abort();
    }
  }
}
exports.Stream = Stream;
class SSEDecoder {
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith('\r')) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      // empty line and we didn't previously encounter any messages
      if (!this.event && !this.data.length) return null;
      const sse = {
        event: this.event,
        data: this.data.join('\n'),
        raw: this.chunks,
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(':')) {
      return null;
    }
    let [fieldname, _, value] = partition(line, ':');
    if (value.startsWith(' ')) {
      value = value.substring(1);
    }
    if (fieldname === 'event') {
      this.event = value;
    } else if (fieldname === 'data') {
      this.data.push(value);
    }
    return null;
  }
}
/**
 * A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
 * reading lines from text.
 *
 * https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
 */
class LineDecoder {
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text = this.decodeText(chunk);
    if (this.trailingCR) {
      text = '\r' + text;
      this.trailingCR = false;
    }
    if (text.endsWith('\r')) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }
    if (!text) {
      return [];
    }
    const trailingNewline = LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || '');
    let lines = text.split(LineDecoder.NEWLINE_REGEXP);
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join('') + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ''];
    }
    return lines;
  }
  decodeText(bytes) {
    var _a;
    if (bytes == null) return '';
    if (typeof bytes === 'string') return bytes;
    // Node:
    if (typeof Buffer !== 'undefined') {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new Error(
        `Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`,
      );
    }
    // Browser
    if (typeof TextDecoder !== 'undefined') {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        (_a = this.textDecoder) !== null && _a !== void 0 ? _a : (this.textDecoder = new TextDecoder('utf8'));
        return this.textDecoder.decode(bytes);
      }
      throw new Error(
        `Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`,
      );
    }
    throw new Error(
      `Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`,
    );
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join('')];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
}
// prettier-ignore
LineDecoder.NEWLINE_CHARS = new Set(['\n', '\r', '\x0b', '\x0c', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029']);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;
function partition(str, delimiter) {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }
  return [str, '', ''];
}
/**
 * Most browsers don't yet have async iterable support for ReadableStream,
 * and Node has a very different way of reading bytes from its "ReadableStream".
 *
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator]) return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result === null || result === void 0 ? void 0 : result.done) reader.releaseLock(); // release lock when stream becomes closed
        return result;
      } catch (e) {
        reader.releaseLock(); // release lock when stream becomes errored
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: undefined };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
//# sourceMappingURL=streaming.js.map


/***/ }),

/***/ 3394:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createForm =
  exports.multipartFormRequestOptions =
  exports.maybeMultipartFormRequestOptions =
  exports.isMultipartBody =
  exports.MultipartBody =
  exports.toFile =
  exports.isUploadable =
  exports.isBlobLike =
  exports.isFileLike =
  exports.isResponseLike =
  exports.fileFromPath =
    void 0;
const form_data_1 = __nccwpck_require__(4741);
const getMultipartRequestOptions_1 = __nccwpck_require__(5709);
const fileFromPath_1 = __nccwpck_require__(91);
Object.defineProperty(exports, "fileFromPath", ({
  enumerable: true,
  get: function () {
    return fileFromPath_1.fileFromPath;
  },
}));
const node_readable_1 = __nccwpck_require__(5518);
const isResponseLike = (value) =>
  value != null &&
  typeof value === 'object' &&
  typeof value.url === 'string' &&
  typeof value.blob === 'function';
exports.isResponseLike = isResponseLike;
const isFileLike = (value) =>
  value != null &&
  typeof value === 'object' &&
  typeof value.name === 'string' &&
  typeof value.lastModified === 'number' &&
  (0, exports.isBlobLike)(value);
exports.isFileLike = isFileLike;
/**
 * The BlobLike type omits arrayBuffer() because @types/node-fetch@^2.6.4 lacks it; but this check
 * adds the arrayBuffer() method type because it is available and used at runtime
 */
const isBlobLike = (value) =>
  value != null &&
  typeof value === 'object' &&
  typeof value.size === 'number' &&
  typeof value.type === 'string' &&
  typeof value.text === 'function' &&
  typeof value.slice === 'function' &&
  typeof value.arrayBuffer === 'function';
exports.isBlobLike = isBlobLike;
const isUploadable = (value) => {
  return (
    (0, exports.isFileLike)(value) ||
    (0, exports.isResponseLike)(value) ||
    (0, node_readable_1.isFsReadStream)(value)
  );
};
exports.isUploadable = isUploadable;
/**
 * Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
 * @param value the raw content of the file.  Can be an {@link Uploadable}, {@link BlobLikePart}, or {@link AsyncIterable} of {@link BlobLikePart}s
 * @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
 * @param {Object=} options additional properties
 * @param {string=} options.type the MIME type of the content
 * @param {number=} options.lastModified the last modified timestamp
 * @returns a {@link File} with the given properties
 */
async function toFile(value, name, options = {}) {
  var _a, _b, _c;
  // If it's a promise, resolve it.
  value = await value;
  if ((0, exports.isResponseLike)(value)) {
    const blob = await value.blob();
    name ||
      (name =
        (_a = new URL(value.url).pathname.split(/[\\/]/).pop()) !== null && _a !== void 0 ?
          _a
        : 'unknown_file');
    return new form_data_1.File([blob], name, options);
  }
  const bits = await getBytes(value);
  name || (name = (_b = getName(value)) !== null && _b !== void 0 ? _b : 'unknown_file');
  if (!options.type) {
    const type = (_c = bits[0]) === null || _c === void 0 ? void 0 : _c.type;
    if (typeof type === 'string') {
      options = { ...options, type };
    }
  }
  return new form_data_1.File(bits, name, options);
}
exports.toFile = toFile;
async function getBytes(value) {
  var _a;
  let parts = [];
  if (
    typeof value === 'string' ||
    ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
    value instanceof ArrayBuffer
  ) {
    parts.push(value);
  } else if ((0, exports.isBlobLike)(value)) {
    parts.push(await value.arrayBuffer());
  } else if (
    isAsyncIterableIterator(value) // includes Readable, ReadableStream, etc.
  ) {
    for await (const chunk of value) {
      parts.push(chunk); // TODO, consider validating?
    }
  } else {
    throw new Error(
      `Unexpected data type: ${typeof value}; constructor: ${
        (_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ?
          void 0
        : _a.name
      }; props: ${propsForError(value)}`,
    );
  }
  return parts;
}
function propsForError(value) {
  const props = Object.getOwnPropertyNames(value);
  return `[${props.map((p) => `"${p}"`).join(', ')}]`;
}
function getName(value) {
  var _a;
  return (
    getStringFromMaybeBuffer(value.name) ||
    getStringFromMaybeBuffer(value.filename) ||
    // For fs.ReadStream
    ((_a = getStringFromMaybeBuffer(value.path)) === null || _a === void 0 ? void 0 : _a.split(/[\\/]/).pop())
  );
}
const getStringFromMaybeBuffer = (x) => {
  if (typeof x === 'string') return x;
  if (typeof Buffer !== 'undefined' && x instanceof Buffer) return String(x);
  return undefined;
};
const isAsyncIterableIterator = (value) =>
  value != null && typeof value === 'object' && typeof value[Symbol.asyncIterator] === 'function';
class MultipartBody {
  constructor(body) {
    this.body = body;
  }
  get [Symbol.toStringTag]() {
    return 'MultipartBody';
  }
}
exports.MultipartBody = MultipartBody;
const isMultipartBody = (body) =>
  body && typeof body === 'object' && body.body && body[Symbol.toStringTag] === 'MultipartBody';
exports.isMultipartBody = isMultipartBody;
/**
 * Returns a multipart/form-data request if any part of the given request body contains a File / Blob value.
 * Otherwise returns the request as is.
 */
const maybeMultipartFormRequestOptions = async (opts) => {
  if (!hasUploadableValue(opts.body)) return opts;
  const form = await (0, exports.createForm)(opts.body);
  return (0, getMultipartRequestOptions_1.getMultipartRequestOptions)(form, opts);
};
exports.maybeMultipartFormRequestOptions = maybeMultipartFormRequestOptions;
const multipartFormRequestOptions = async (opts) => {
  const form = await (0, exports.createForm)(opts.body);
  return (0, getMultipartRequestOptions_1.getMultipartRequestOptions)(form, opts);
};
exports.multipartFormRequestOptions = multipartFormRequestOptions;
const createForm = async (body) => {
  const form = new form_data_1.FormData();
  await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
  return form;
};
exports.createForm = createForm;
const hasUploadableValue = (value) => {
  if ((0, exports.isUploadable)(value)) return true;
  if (Array.isArray(value)) return value.some(hasUploadableValue);
  if (value && typeof value === 'object') {
    for (const k in value) {
      if (hasUploadableValue(value[k])) return true;
    }
  }
  return false;
};
const addFormValue = async (form, key, value) => {
  if (value === undefined) return;
  if (value == null) {
    throw new TypeError(
      `Received null for "${key}"; to pass null in FormData, you must use the string 'null'`,
    );
  }
  // TODO: make nested formats configurable
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    form.append(key, String(value));
  } else if ((0, exports.isUploadable)(value)) {
    const file = await toFile(value);
    form.append(key, file);
  } else if (Array.isArray(value)) {
    await Promise.all(value.map((entry) => addFormValue(form, key + '[]', entry)));
  } else if (typeof value === 'object') {
    await Promise.all(
      Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)),
    );
  } else {
    throw new TypeError(
      `Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`,
    );
  }
};
//# sourceMappingURL=uploads.js.map


/***/ }),

/***/ 6417:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VERSION = void 0;
exports.VERSION = '4.5.0'; // x-release-please-version
//# sourceMappingURL=version.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(6144);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map