import React from 'react';

import { Button } from '#/shared/components/ui/button';
import type { ReferencesType } from '#/shared/types/references.type';

import { useImportReferenceMutation } from './import-reference.mutation';

export const ImportReferenceButton: React.FC<{ type: ReferencesType }> =
  React.memo(({ type }) => {
    const fileInputReference = React.useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useImportReferenceMutation(type);

    const handleFileChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          mutate(file);
          if (fileInputReference.current) {
            fileInputReference.current.value = '';
          }
        }
      },
      [mutate]
    );

    const handleButtonClick = React.useCallback(() => {
      fileInputReference.current?.click();
    }, []);

    return (
      <>
        <Button
          className="rounded-full px-4 py-2"
          onClick={handleButtonClick}
          disabled={isPending}
        >
          {isPending ? 'Импортируем...' : 'Импорт из файла'}
        </Button>
        <input
          ref={fileInputReference}
          id="importFile"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </>
    );
  });

ImportReferenceButton.displayName = '_ImportReferenceButton_';
