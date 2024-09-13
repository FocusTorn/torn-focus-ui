import { extensions, workspace } from 'vscode';



import { constants } from './constants';



// import { getConfig } from '../../config/config';



/** Get configuration of vs code. */
export const getConfig = (section?: string) => {
    return workspace.getConfiguration(section);
};

/** Get list of configuration entries of package.json */
export const getConfigProperties = (): { [config: string]: unknown } => {

    console.log(`${constants.extension.publisher}.${constants.extension.name}`);

    return extensions.getExtension(`${constants.extension.publisher}.${constants.extension.name}`)
        ?.packageJSON?.contributes?.configuration?.properties;
};

/** Get list of all configration properties */
export const configPropertyNames = () => {
    return Object.keys(getConfigProperties());
};

/** Update configuration of vs code. */
export const setConfig = (section: string, value: unknown, global = false) => {
    return getConfig().update(section, value, global);
};


/** Get current configuration of the theme from the vscode config */
export const getThemeConfig = <T>(section: string): T | undefined => {
    const themeConfig = getConfig(constants.extension.name).inspect<T>(section);
    return getConfigValue<T | undefined>(themeConfig);
};


/**
 * Returns the value of a specific configuration by checking the workspace and the user configuration and fallback to the default value.
 *
 * @param themeConfig Theme configuration
 * @returns Actual theme configuration value
 */
export const getConfigValue = <T>(
    themeConfig: Partial<
        | {
            globalValue: T;
            workspaceValue: T;
            defaultValue: T;
        }
        | undefined
    >
) => {
    let configValue: T | undefined;
    if (themeConfig === undefined) {
        return undefined;
    }
    if (
        typeof themeConfig.workspaceValue === 'object' &&
        themeConfig.workspaceValue &&
        themeConfig.globalValue
    ) {
        configValue = merge(themeConfig.workspaceValue, themeConfig.globalValue);
    } else {
        configValue =
            themeConfig.workspaceValue ??
            themeConfig.globalValue ??
            themeConfig.defaultValue;
    }
    return configValue;
};




/**
 * Merges given objects recursively.
 *
 * @param objects Provide the objects that should be merged.
 * @returns A new object that is the result of the merge.
 */
export const merge = <T extends Record<string, unknown>>(
    ...objects: (T | undefined | null)[]
): T => {
    return objects.reduce<T>((acc, obj) => {
        Object.keys(obj ?? {}).forEach((key) => {
            const accValue = (acc as Record<string, unknown>)[key];
            const objValue = obj?.[key];

            // Check if one of the values is null or undefined and the other is not
            if (
                (accValue === undefined || accValue === null) &&
                objValue !== undefined &&
                objValue !== null
            ) {
                (acc as Record<string, unknown>)[key] = objValue;
            } else if (
                (objValue === undefined || objValue === null) &&
                accValue !== undefined &&
                accValue !== null
            ) {
                // No need to assign acc[key] to itself
            } else if (Array.isArray(objValue) && Array.isArray(accValue)) {
                (acc as Record<string, unknown>)[key] = [
                    ...new Set(accValue.concat(objValue)),
                ];
            } else if (
                typeof objValue === 'object' &&
                objValue !== null &&
                typeof accValue === 'object' &&
                accValue !== null
            ) {
                (acc as Record<string, unknown>)[key] = merge(
                    accValue as Record<string, object>,
                    objValue as Record<string, object>
                );
            } else {
                (acc as Record<string, unknown>)[key] = objValue;
            }
        });
        return acc;
    }, {} as T);
};




//   /** Set the config of the theme. */
//   export const setThemeConfig = (
//     section: string,
//     value: unknown,
//     global = false
//   ) => {
//     return getConfig(extensionID).update(section, value, global);
//   };

//   /**
//    * Checks if the theme is the active icon theme
//    * @param{boolean} global false by default
//    */
//   export const isThemeActivated = (global = false): boolean => {
//     return global
//       ? getConfig().inspect('workbench.iconTheme')?.globalValue === extensionID
//       : getConfig().inspect('workbench.iconTheme')?.workspaceValue ===
//       extensionID;
//   };

//   /** Checks if the theme is not the active icon theme */
//   export const isThemeNotVisible = (): boolean => {
//     const config = getConfig().inspect('workbench.iconTheme');
//     return (
//       (!isThemeActivated(true) && !config?.workspaceValue) || // no workspace and not global
//       (!isThemeActivated() && !!config?.workspaceValue)
//     );
//   };


















// //   /**
// //    * Get the current configuration of the theme.
// //    *
// //    * @returns Current configuration
// //    */
// //   export const getCurrentConfig = (): Config => {
// //     const updatedConfig = configPropertyNames.reduce<Record<string, unknown>>(
// //       (acc, configNameWithExtensionId) => {
// //         const configName = configNameWithExtensionId.replace(
// //           `${extensionID}.`,
// //           ''
// //         );
// //         const configValue = getThemeConfig(configName) ?? null;
// //         set(acc, configName, configValue);
// //         return acc;
// //       },
// //       {}
// //     );

// //     return updatedConfig as Config;
// //   };




