export default {
    multipass: true,
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    
                    // customize the params of a default plugin
                    // inlineStyles: {
                    //   onlyMatchedOnce: false,
                    // },
                },
            },
        },
        'convertStyleToAttrs',
        'removeDimensions',
        'removeOffCanvasPaths',
        'removeScriptElement',
        //'removeStyleElement',
        //'reusePaths',
        'sortAttrs',
    ],
};

// module.exports = {
//     multipass: false,
//     precision: 2,
//     plugins: [
//         {
//             name: 'preset-default',
//             params: {
//                 overrides: {
//                     removeUnknownsAndDefaults: false,

//                     convertStyleToAttrs: true,
//                     removeDimensions: true,
//                     removeOffCanvasPaths: true,
//                     removeScriptElement: true,
//                     removeStyleElement: true,
//                     reusePaths: true,
//                     sortAttrs: true,
//                 },
//             },
//         },
//     ],
// };

// module.exports = {
//   multipass: true,
//   precision: 2,
//   plugins: [
//     {
//       name: 'preset-default',
//     },
//     'convertStyleToAttrs',
//     'removeDimensions',
//     'removeOffCanvasPaths',
//     'removeScriptElement',
//     'removeStyleElement',
//     'reusePaths',
//     'sortAttrs',
//   ],

//   plugins:
//   - removeAttrs:
//       attrs:
//         - '**(stroke|fill)' # Prevent removal of stroke and fill attributes
//   - removeUnknownsAndDefaults: false # Disable this plugin entirely

// };
