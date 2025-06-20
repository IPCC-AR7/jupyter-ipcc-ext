import type { FieldProps, WidgetProps } from '@rjsf/utils';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  IFormRendererRegistry,
  IFormRenderer
} from '@jupyterlab/ui-components';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IMetadataFormProvider } from '@jupyterlab/metadataform';
import { IObservableMap } from '@jupyterlab/observables';

import { CustomCheckbox } from './customWidget';
import { CustomField } from './customField';

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

const advanced: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/metadata-form:advanced',
  autoStart: true,
  requires: [IFormRendererRegistry],
  activate: (
    app: JupyterFrontEnd,
    formRegistry: IFormRendererRegistry | null
  ) => {
    // Register the custom widget
    if (formRegistry) {
      const component: IFormRenderer = {
        widgetRenderer: (props: WidgetProps) => {
          return CustomCheckbox(props);
        }
      };
      formRegistry.addRenderer(
        '@jupyterlab-examples/metadata-form:advanced.custom-checkbox',
        component
      );

      const customField: IFormRenderer = {
        fieldRenderer: (props: FieldProps) => {
          return new CustomField().render(props);
        }
      };
      formRegistry.addRenderer(
        '@jupyterlab-examples/metadata-form:advanced.custom-field',
        customField
      );
    }
    console.log('Advanced metadata-form example activated');
  }
};

export default [plugin, advanced];
