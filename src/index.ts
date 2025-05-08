import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the provenance extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'provenance:plugin',
  description: 'A JupyterLab extension to record provenance and credit information.',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension provenance is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('provenance settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for provenance.', reason);
        });
    }
  }
};

export default plugin;
