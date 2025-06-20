import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IMetadataFormProvider } from '@jupyterlab/metadataform';
import { IObservableMap } from '@jupyterlab/observables';

/**
 * Initialization data for the provenance extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/metadata-form:simple',
  description: 'A JupyterLab extension to record provenance and credit information.',
  autoStart: true,
  requires: [INotebookTracker, IMetadataFormProvider],
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    notebooks: INotebookTracker,
    metadataForm: IMetadataFormProvider,
    settingRegistry: ISettingRegistry | null
  ) => {
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

    // Connect to notebook changes to update metadata form
    notebooks.widgetAdded.connect((sender, panel) => {
      const notebook = panel.content;
      const model = notebook.model;
      
      if (model && model.metadata) {
        // Initialize metadata if it doesn't exist
        const metadata = model.metadata as unknown as IObservableMap<any>;
        if (!metadata.has('provenance')) {
          metadata.set('provenance', {
            software: [],
            datasets: []
          });
        }
      }
    });
  }
};

export default plugin;
