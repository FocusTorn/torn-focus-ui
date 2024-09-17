import { extensions, workspace, WorkspaceConfiguration } from 'vscode';
import { constants } from './constants';

/*********************************************************************************************************
 *  Get configuration of VS Code.
 *
 */
export const getConfig = (section?: string) => {
    console.log(`Getting configuration for section: ${section ?? 'root'}`);
    return workspace.getConfiguration(section);
};

/*********************************************************************************************************
 * Get list of configuration entries from package.json.
 *
 */
export const getConfigProperties = (): { [config: string]: unknown } => {
    console.log('Getting configuration properties from package.json');
    const properties = extensions.getExtension(`${constants.extension.publisher}.${constants.extension.configKey}`)
        ?.packageJSON?.contributes?.configuration?.properties ?? {};
    console.log('Configuration properties:', properties);
    return properties;
};

/*********************************************************************************************************
 * Get list of all configuration property names.
 *
 */
export const configPropertyNames = () => {
    console.log('Getting configuration property names');
    const names = Object.keys(getConfigProperties());
    console.log('Configuration property names:', names);
    return names;
};

/*********************************************************************************************************
 *  Update configuration of VS Code.
 *
 */
export const setConfig = (section: string, value: unknown, global = false) => {
    console.log(`Setting configuration for section: ${section}, value: ${value}, global: ${global}`);
    return getConfig().update(section, value, global);
};



/*********************************************************************************************************
 *  Get current configuration of the theme from the VS Code config.
 *
 */
export const getThemeConfig = (): WorkspaceConfiguration => {
    // console.log(`Getting theme configuration`);
    const themeConfig = workspace.getConfiguration(constants.extension.configKey);
    // console.log('Theme configuration:', themeConfig);
    return themeConfig;
};


/*********************************************************************************************************
 * Set the config of the theme.
 *
 */
export const setThemeConfig = (section: string, value: unknown, global = false) => {
    console.log(`Setting theme configuration for section: ${section}, value: ${value}, global: ${global}`);
    return getConfig(constants.extension.configKey).update(section, value, global);
};



/*********************************************************************************************************
 * Returns the value of a specific configuration by checking the workspace and user configuration,
 * falling back to the default value.
 *
 * @param section The configuration section to retrieve.
 *
 * @returns Actual theme configuration value.
 *
 */
export const getConfigValue = <T>(section: string): T | undefined => {
    console.log(`Getting configuration value for section: ${section}`);
    const config = workspace.getConfiguration(constants.extension.configKey);
    const value = config.get<T>(section);
    console.log('Configuration value:', value);
    return value;
};





















// /**
//  * Merges given objects recursively.
//  *
//  * @param objects Provide the objects that should be merged.
//  * @returns A new object that is the result of the merge.
//  */
// export const merge = <T extends Record<string, unknown>>(
//   ...objects: (T | undefined | null)[]
// ): T => {
//   return objects.reduce<T>((acc, obj) => {
//     Object.keys(obj ?? {}).forEach(key => {
//       const accValue = acc[key];
//       const objValue = obj?.[key];

//       if (accValue === null && objValue  !== null) {
//         acc[key] = objValue;
//       } else if (Array.isArray(objValue) && Array.isArray(accValue)) {
//         acc[key] = [...new Set(accValue.concat(objValue))];
//       } else if (typeof objValue === 'object' && objValue !== null && typeof accValue === 'object' && accValue !== null) {
//         acc[key] = merge(accValue as Record<string, object>, objValue as Record<string, object>);
//       } else {
//         acc[key] = objValue;
//       }
//     });
//     return acc;
//   }, {} as T);
// };










// import { extensions, workspace, ConfigurationScope  } from 'vscode';



// import { constants } from './constants';



// // import { getConfig } from '../../config/config';



// /** Get  configuration of vs code. */
// export const getConfig = (section?: string) => {
//     return workspace.getConfiguration(section);
// };

// /** Get list of configuration entries of package.json */
// export const getConfigProperties = (): { [config: string]: unknown } => {

//     console.log(`${constants.extension.publisher}.${constants.extension.configKey}`);

//     return extensions.getExtension(`${constants.extension.publisher}.${constants.extension.configKey}`)
//         ?.packageJSON?.contributes?.configuration?.properties;
// };

// /** Get list of all configuration properties */
// export const configPropertyNames = () => {
//     return Object.keys(getConfigProperties());
// };

// /** Update configuration of vs code. */
// export const setConfig = (section: string, value: unknown, global = false) => {
//     return getConfig().update(section, value, global);
// };







// /** Get current configuration of the theme from the vscode config */
// export const getThemeConfig = <T extends string>(section: string): T | undefined => {
//     const themeConfig = workspace.getConfiguration(constants.extension.configKey).inspect<T>(section);
//     console.log('themeConfig:', themeConfig); // Log the entire themeConfig object

//     const configValue = themeConfig?.workspaceValue !== undefined
//         ? themeConfig.workspaceValue
//         : themeConfig?.globalValue;

//     console.log('configValue:', configValue); // Log the extracted configValue

//     if (configValue !== undefined) {
//         return getConfigValue<T>(configValue);
//     } else {
//         return undefined;
//     }
// };








// /** Set the config of the theme. */
// export const setThemeConfig = (
//     section: string,
//     value: unknown,
//     global = false
//   ) => {
//     return getConfig(constants.extension.configKey).update(section, value, global);
//   };






// /**
//  * Returns the value of a specific configuration by checking the workspace and the user configuration and fallback to the default value.
//  *
//  * @param themeConfig Theme configuration
//  * @returns Actual theme configuration value
//  */
// export const getConfigValue = <T>(section: string): T | undefined => {
//     const config = workspace.getConfiguration(constants.extension.configKey);

//     // Get the workspace value (if any)
//     const workspaceValue = config.get<T>(section);

//     // If there's no workspace value, get the global value
//     return workspaceValue !== undefined ? workspaceValue : config.get<T>(section);
// };





















// /**
//  * Merges given objects recursively.
//  *
//  * @param objects Provide the objects that should be merged.
//  * @returns A new object that is the result of the merge.
//  */
// export const merge = <T extends Record<string, unknown>>(
//     ...objects: (T | undefined | null)[]
// ): T => {
//     return objects.reduce<T>((acc, obj) => {
//         Object.keys(obj ?? {}).forEach((key) => {
//             const accValue = (acc as Record<string, unknown>)[key];
//             const objValue = obj?.[key];

//             // Check if one of the values is null or undefined and the other is not
//             if (
//                 (accValue === undefined || accValue === null) &&
//                 objValue !== undefined &&
//                 objValue !== null
//             ) {
//                 (acc as Record<string, unknown>)[key] = objValue;
//             } else if (
//                 (objValue === undefined || objValue === null) &&
//                 accValue !== undefined &&
//                 accValue !== null
//             ) {
//                 // No need to assign acc[key] to itself
//             } else if (Array.isArray(objValue) && Array.isArray(accValue)) {
//                 (acc as Record<string, unknown>)[key] = [
//                     ...new Set(accValue.concat(objValue)),
//                 ];
//             } else if (
//                 typeof objValue === 'object' &&
//                 objValue !== null &&
//                 typeof accValue === 'object' &&
//                 accValue !== null
//             ) {
//                 (acc as Record<string, unknown>)[key] = merge(
//                     accValue as Record<string, object>,
//                     objValue as Record<string, object>
//                 );
//             } else {
//                 (acc as Record<string, unknown>)[key] = objValue;
//             }
//         });
//         return acc;
//     }, {} as T);
// };




// //   /** Set the config of the theme. */
// //   export const setThemeConfig = (
// //     section: string,
// //     value: unknown,
// //     global = false
// //   ) => {
// //     return getConfig(extensionID).update(section, value, global);
// //   };

// //   /**
// //    * Checks if the theme is the active icon theme
// //    * @param{boolean} global false by default
// //    */
// //   export const isThemeActivated = (global = false): boolean => {
// //     return global
// //       ? getConfig().inspect('workbench.iconTheme')?.globalValue === extensionID
// //       : getConfig().inspect('workbench.iconTheme')?.workspaceValue ===
// //       extensionID;
// //   };

// //   /** Checks if the theme is not the active icon theme */
// //   export const isThemeNotVisible = (): boolean => {
// //     const config = getConfig().inspect('workbench.iconTheme');
// //     return (
// //       (!isThemeActivated(true) && !config?.workspaceValue) || // no workspace and not global
// //       (!isThemeActivated() && !!config?.workspaceValue)
// //     );
// //   };


















// // //   /**
// // //    * Get the current configuration of the theme.
// // //    *
// // //    * @returns Current configuration
// // //    */
// // //   export const getCurrentConfig = (): Config => {
// // //     const updatedConfig = configPropertyNames.reduce<Record<string, unknown>>(
// // //       (acc, configNameWithExtensionId) => {
// // //         const configName = configNameWithExtensionId.replace(
// // //           `${extensionID}.`,
// // //           ''
// // //         );
// // //         const configValue = getThemeConfig(configName) ?? null;
// // //         set(acc, configName, configValue);
// // //         return acc;
// // //       },
// // //       {}
// // //     );

// // //     return updatedConfig as Config;
// // //   };




