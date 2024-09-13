import { ConfigurationTarget ,workspace } from 'vscode';



// export const toggleIcons = () => {
//     return toggleIcons_fn();
// };

// const toggleIcons_fn = async () => {


export const toggleIcons = async () => {

        const currentTheme = workspace.getConfiguration('workbench').get<string>('iconTheme');

        workspace.getConfiguration('workbench').update('iconTheme', null, ConfigurationTarget.Global).then(() => {
            workspace.getConfiguration('workbench').update('iconTheme', currentTheme, ConfigurationTarget.Global);
        });
    };


