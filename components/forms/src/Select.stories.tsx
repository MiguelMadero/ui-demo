import React from 'react';
import { Box, Flex } from 'rebass';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Select from './Select';

const options = [{ value: 'yes', label: 'Yes' }, { value: 'maybe', label: 'Maybe' }, { value: 'no', label: 'No' }];

storiesOf('Select', module)
  .addDecorator(getStory => (
    <Box p={20} w={[1, 1 / 2]} bg="white">
      {getStory()}
    </Box>
  ))
  .add('default', () => <Select options={options} />)
  .add('placeholder', () => <Select options={options} placeholder="Placeholder" />)
  .add('rebass props', () => <Select options={options} placeholder="Placeholder" my={50} />)
  .add('sizes', () => (
    <Flex wrap align="center">
      <Box w={1 / 3}>Large</Box>
      <Box w={2 / 3} mb={1}>
        <Select s="large" options={options} placeholder="Placeholder" />
      </Box>
      <Box w={1 / 3}>Medium</Box>
      <Box w={2 / 3} mb={1}>
        <Select s="medium" options={options} placeholder="Placeholder" />
      </Box>
      <Box w={1 / 3}>Small</Box>
      <Box w={2 / 3} mb={1}>
        <Select s="small" options={options} placeholder="Placeholder" />
      </Box>
    </Flex>
  ))
  .add('default value', () => <Select options={options} value="no" />)
  .add('disabled', () => <Select options={options} value="yes" disabled />)
  .add('autoFocus', () => <Select options={options} autoFocus openOnFocus />)
  .add('multi', () => <Select options={options} multi value="yes,maybe" />)
  .add('error', () => <Select options={options} value="no" className="error" />)
  .add('fires events', () => (
    <Select
      options={options}
      placeholder="Try interacting"
      onFocus={action('select-onfocus')}
      onBlur={action('select-onblur')}
      onClick={action('select-onclick')}
      onKeyUp={action('select-onkeyup')}
      onChange={action('select-onchange')}
    />
  ));
