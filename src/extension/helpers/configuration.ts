
// /**
//  * Returns the value of a specific configuration by checking the workspace and the user configuration and fallback to the default value.
//  *
//  * @param themeConfig Theme configuration
//  * @returns Actual theme configuration value
//  */
// const getConfigValue = <T>(
//     themeConfig: Partial<
//       | {
//           globalValue: T;
//           workspaceValue: T;
//           defaultValue: T;
//         }
//       | undefined
//     >
//   ) => {
//     let configValue: T | undefined;
//     if (themeConfig === undefined) {
//       return undefined;
//     }
//     if (
//       typeof themeConfig.workspaceValue === 'object' &&
//       themeConfig.workspaceValue &&
//       themeConfig.globalValue
//     ) {
//       configValue = merge(themeConfig.workspaceValue, themeConfig.globalValue);
//     } else {
//       configValue =
//         themeConfig.workspaceValue ??
//         themeConfig.globalValue ??
//         themeConfig.defaultValue;
//     }
//     return configValue;
//   };




// /**
//  * Merges given objects recursively.
//  *
//  * @param objects Provide the objects that should be merged.
//  * @returns A new object that is the result of the merge.
//  */
// export const merge = <T extends Record<string, unknown>>(
//     ...objects: (T | undefined | null)[]
//   ): T => {
//     return objects.reduce<T>((acc, obj) => {
//       Object.keys(obj ?? {}).forEach((key) => {
//         const accValue = (acc as Record<string, unknown>)[key];
//         const objValue = obj?.[key];

//         // Check if one of the values is null or undefined and the other is not
//         if (
//           (accValue === undefined || accValue === null) &&
//           objValue !== undefined &&
//           objValue !== null
//         ) {
//           (acc as Record<string, unknown>)[key] = objValue;
//         } else if (
//           (objValue === undefined || objValue === null) &&
//           accValue !== undefined &&
//           accValue !== null
//         ) {
//           // No need to assign acc[key] to itself
//         } else if (Array.isArray(objValue) && Array.isArray(accValue)) {
//           (acc as Record<string, unknown>)[key] = [
//             ...new Set(accValue.concat(objValue)),
//           ];
//         } else if (
//           typeof objValue === 'object' &&
//           objValue !== null &&
//           typeof accValue === 'object' &&
//           accValue !== null
//         ) {
//           (acc as Record<string, unknown>)[key] = merge(
//             accValue as Record<string, object>,
//             objValue as Record<string, object>
//           );
//         } else {
//           (acc as Record<string, unknown>)[key] = objValue;
//         }
//       });
//       return acc;
//     }, {} as T);
//   };
