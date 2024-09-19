module.exports = {
    testMatch: [
        '<rootDir>/src/**/*.test.(js|ts)',
        '<rootDir>/test/**/*.(js|ts)'
    ],
    
    moduleDirectories: [
        'node_modules',
        '<rootDir>/src',
        '<rootDir>/test/js',
        '<rootDir>/test/ts',
        
    ],
    
    
    preset: 'ts-jest',
    testEnvironment: 'node',

    
    
    // "reporters": [
    //     "default",
    //     ["./node_modules/jest-html-reporter", {
    //         "pageTitle": "Test Report"
    //     }]
    // ]
        
    
    
    
    
};



// Use:  npx jest   