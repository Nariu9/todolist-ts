import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {action} from '@storybook/addon-actions';
import {IconButton, TextField} from '@mui/material';
import {AddBox} from '@mui/icons-material';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Todolists/AddItemForm',
  component: AddItemForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addItem: {
      description: 'form submit'
    }
  },
} as ComponentMeta<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template1: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template1.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AddItemFormStory.args = {
  addItem: action('form submitted with')
};


const Template2: ComponentStory<typeof AddItemForm> = (args) => {

  const [itemTitle, setItemTitle] = useState('')
  const [error, setError] = useState<string | null>('Title is required')

  const addTaskHandler = () => {
    if (itemTitle.trim() === '') {
      setError('Title is required')
      setItemTitle('')
      return
    }
    args.addItem(itemTitle.trim())
    setItemTitle('')
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setItemTitle(e.currentTarget.value)
    error && setError('')
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && addTaskHandler()
  }

  return (
      <div>
        <TextField variant={'outlined'}
                   size={'small'}
                   label={'Title'}
                   value={itemTitle}
                   onChange={onChangeHandler}
                   onKeyDown={onKeyDownHandler}
                   error={!!error}
                   helperText={error}/>
        <IconButton onClick={addTaskHandler} color={'primary'}>
          <AddBox/>
        </IconButton>
      </div>
  )
}

export const AddItemFormStoryWithError = Template2.bind({});