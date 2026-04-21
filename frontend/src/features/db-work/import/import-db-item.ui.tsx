import React from 'react';

import { Button } from '#/shared/components/ui/button';
import type { DbType } from '#/shared/types/db.type';

import { useImportDbItemMutation as useImportDatabaseItemMutation } from './import-db-item.mutation';

export const ImportDbItemButton: React.FC<{ type: DbType }> = React.memo(
  ({ type }) => {
    const fileInputReference = React.useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useImportDatabaseItemMutation(type);

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
          id="importDbFile"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </>
    );
  }
);

ImportDbItemButton.displayName = '_ImportDbItemButton_';
