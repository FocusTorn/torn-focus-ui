// import pino from 'pino';

// // Create a Pino logger instance
// const logger = pino({
//     level: 'info', // Set the minimum log level
//     transport: {
//         target: 'pino-pretty', // Use pino-pretty for formatted console output
//         options: {
//             colorize: true
//         }
//     }
// });

// export default logger;


// import * as vscode from 'vscode';
// import pino from 'pino';

// const outputChannel = vscode.window.createOutputChannel('FT-UI');

// const outputPanelTransport = pino.transport({
//     target: function (opts) {
//         return {
//             write(msg) {
//                 outputChannel.appendLine(msg);
//             }
//         };
//     }
// });

// const logger = pino({
//     level: 'info',
//     transport: outputPanelTransport
// });

// export default logger; // Export the logger instance




// import * as vscode from 'vscode';
// import pino from 'pino';
// import outputPanelTransport from './logger_outputPanelTransport'; // Import your custom transport

// const logger = pino({
//     level: 'info',
//     transport: {
//         target: outputPanelTransport, // Use the imported transport
//         // ... other options if needed ...
//     }
// });

// export default logger;



// import pino from 'pino';

// const logger = pino({
//     level: 'info', // Set your desired log level
//     transport: {
//         target: 'pino-pretty',
//         options: {
//             colorize: true
//         }
//     }
// });

// export default logger;
