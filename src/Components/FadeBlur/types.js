// @flow
import { createContext } from 'react';

export type BlurHandle = number;
export const FadeBlurContext = createContext<?BlurHandle>();
export const FadeBlurProvider = FadeBlurContext.Provider;
export const FadeBlurConsumer = FadeBlurContext.Consumer;