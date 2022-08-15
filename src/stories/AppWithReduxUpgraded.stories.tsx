import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AppWithReduxUpgraded from '../AppWithReduxUpgraded';
import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Todolists/AppWithReduxUpgraded',
  component: AppWithReduxUpgraded,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AppWithReduxUpgraded>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppWithReduxUpgraded> = () => <AppWithReduxUpgraded/>;

export const AppWithReduxUpgradedStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

