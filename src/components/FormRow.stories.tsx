import type { Meta, StoryObj } from '@storybook/react';

import FormRow from './FormRow';

const meta = {
  component: FormRow,
} satisfies Meta<typeof FormRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};