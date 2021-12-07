import React, { useCallback, useEffect, useState } from 'react';
import {
  FIXED_CONTAINER_ID,
  useBlock,
  getShadowRoot,
  getEditorRoot,
} from 'easy-email-editor';
import { useField, useForm } from 'react-final-form';
import { awaitForElement } from '@extensions/AttributePanel/utils/awaitForElement';
import { getEditContent, getEditNode } from 'easy-email-editor';

export interface InlineTextProps {
  idx: string;
  children?: React.ReactNode;
  onChange: (content: string) => void;
}

export function InlineText({ idx, onChange, children }: InlineTextProps) {
  const {
    mutators: { setFieldTouched },
  } = useForm();
  const [isFocus, setIsFocus] = useState(false);
  const [textContainer, setTextContainer] = useState<HTMLElement | null>(null);

  useField(idx); // setFieldTouched will be work while register field,
  const { focusBlock } = useBlock();

  useEffect(() => {
    const promiseObj = awaitForElement<HTMLDivElement>(idx);
    promiseObj.promise.then((blockNode) => {
      setTextContainer(blockNode);
    });

    return () => {
      promiseObj.cancel();
    };
  }, [idx, focusBlock]);

  const onTextChange = useCallback(
    (text: string) => {
      if (focusBlock?.data.value.content !== text) {
        onChange(text);
      }
    },
    [focusBlock?.data.value.content, onChange]
  );

  useEffect(() => {
    if (!textContainer) return;

    const container = getEditNode(textContainer);

    if (container) {
      container.focus();
      let focusTarget: HTMLElement | null = null;
      const root = getShadowRoot();

      const onClick = (ev: Event) => {
        ev.stopPropagation();
        focusTarget = ev.target as HTMLElement;
        const fixedContainer = document.getElementById(FIXED_CONTAINER_ID);
        if (textContainer?.contains(focusTarget)) return;

        if (fixedContainer && fixedContainer.contains(focusTarget)) return;
        if (fixedContainer?.contains(document.activeElement)) return;

        onTextChange(getEditContent(textContainer));
      };

      const onPaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') || '';
        document.execCommand('insertHTML', false, text);
      };
      const stopDrag = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const onInput = () => {
        setFieldTouched(idx, true);
      };

      container.addEventListener('paste', onPaste as any, true);
      container.addEventListener('dragstart', stopDrag);
      container.addEventListener('input', onInput);

      document.addEventListener('mousedown', onClick);
      root.addEventListener('mousedown', onClick);

      return () => {
        container.removeEventListener('paste', onPaste as any, true);
        container.removeEventListener('dragstart', stopDrag);
        container.removeEventListener('input', onInput);
        document.removeEventListener('mousedown', onClick);
        root.removeEventListener('mousedown', onClick);
      };
    }
  }, [idx, onTextChange, setFieldTouched, textContainer]);

  useEffect(() => {
    const onFocus = (ev: Event) => {
      ev.stopPropagation();
      if (document.activeElement === getEditorRoot()) {
        setIsFocus(true);
      } else {
        setIsFocus(false);
      }
    };
    const root = getShadowRoot();
    root.addEventListener('click', onFocus);
    root.addEventListener('focusin', onFocus);
    window.addEventListener('focusin', onFocus);
    return () => {
      root.addEventListener('click', onFocus);
      root.removeEventListener('focusin', onFocus);
      window.removeEventListener('focusin', onFocus);
    };
  }, []);

  if (!isFocus) return null;
  return <>{children}</>;
}
