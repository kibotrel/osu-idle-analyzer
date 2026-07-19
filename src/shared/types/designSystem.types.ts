import {
  BodyVariants,
  ButtonVariants,
  CaptionVariants,
  HeadlineVariants,
  Icons,
  InputTypes,
  InputVariants,
  SeparatorVariants,
} from '../constants/designSystem.constants.ts';

export type BodyVariant = (typeof BodyVariants)[keyof typeof BodyVariants];
export type ButtonVariant = (typeof ButtonVariants)[keyof typeof ButtonVariants];
export type CaptionVariant = (typeof CaptionVariants)[keyof typeof CaptionVariants];
export type HeadlineVariant = (typeof HeadlineVariants)[keyof typeof HeadlineVariants];
export type InputVariant = (typeof InputVariants)[keyof typeof InputVariants];
export type SeparatorVariant = (typeof SeparatorVariants)[keyof typeof SeparatorVariants];

export type Icon = (typeof Icons)[keyof typeof Icons];

export type InputType = (typeof InputTypes)[keyof typeof InputTypes];

export interface Tab<Value = string> {
  label: string;
  value: Value;
  icon?: Icon;
}
