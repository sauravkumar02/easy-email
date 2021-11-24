import React from 'react';
import { getShadowRoot, TextStyle, useBlock, useFocusIdx } from 'easy-email-editor';
import { getValueByIdx } from 'easy-email-core';
import { RichTextField } from '../components/Form/RichTextField';

import { SelectionRangeProvider } from './components/provider/SelectionRangeProvider';
import { PresetColorsProvider } from './components/provider/PresetColorsProvider';
import ReactDOM from 'react-dom';
import { BlockAttributeConfigurationManager } from './utils/BlockAttributeConfigurationManager';


export interface AttributePanelProps { }

export function AttributePanel() {
  const { values, focusBlock } = useBlock();

  const { focusIdx } = useFocusIdx();

  const value = getValueByIdx(values, focusIdx);

  const Com = focusBlock && BlockAttributeConfigurationManager.get(focusBlock.type);

  const shadowRoot = getShadowRoot();

  if (!value) return null;
  return (
    <PresetColorsProvider>
      <SelectionRangeProvider>
        {Com ? (
          <Com />
        ) : (
          <div style={{ marginTop: 200, padding: '0 50px' }}>
            <TextStyle size='extraLarge'>No matching components</TextStyle>
          </div>
        )}

        <div style={{ position: 'absolute' }}>
          <RichTextField
            idx={focusIdx}
            name={`${focusIdx}.data.value.content`}
            label=''
            labelHidden
          />
        </div>
        {
          shadowRoot && ReactDOM.createPortal(
            <style>
              {
                `
              .email-block [contentEditable="true"],
              .email-block [contentEditable="true"] * {
                outline: none;
                cursor: text;
              }
              `
              }
            </style>, shadowRoot as any)
        }
      </SelectionRangeProvider>
    </PresetColorsProvider>
  );
}
