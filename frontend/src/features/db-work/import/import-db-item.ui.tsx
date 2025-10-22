import React from 'react';

import { Button } from '#/shared/components/ui/button';
import type { DbType } from '#/shared/types/db.type';

import { useImportDbItemMutation } from './import-db-item.mutation';

export const ImportDbItemButton: React.FC<{ type: DbType }> = React.memo(
  ({ type }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useImportDbItemMutation(type);

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
