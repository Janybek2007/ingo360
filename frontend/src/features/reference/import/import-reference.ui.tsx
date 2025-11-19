import React from 'react';

import { Button } from '#/shared/components/ui/button';
import type { ReferencesType } from '#/shared/types/references.type';

import { useImportReferenceMutation } from './import-reference.mutation';

export const ImportReferenceButton: React.FC<{ type: ReferencesType }> =
  React.memo(({ type }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useImportReferenceMutation(type);

    const handleFileChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          mutate(file);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      [mutate]
    );

    const handleButtonClick = React.useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    return (
      <>
        <Button
          className="px-4 py-2 rounded-full"
          onClick={handleButtonClick}
          disabled={isPending}
        >
          {isPending ? 'Импорт...' : 'Импорт из файла'}
        </Button>
        <input
          ref={fileInputRef}
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
