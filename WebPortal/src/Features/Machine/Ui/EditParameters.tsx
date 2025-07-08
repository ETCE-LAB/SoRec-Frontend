import React, { useState } from 'react';
import { Button, TextInput, Flex } from '@mantine/core';
import { ApiClient } from '../../../Util/ApiClient';
import { getUser } from '../../../Util/getUser';
import { BackendUrl } from '../../../Util/Urls';

interface EditParametersProps {
  machineId: string;
  parameter: string; 
  initialValue?: string;
}

export const EditParameters: React.FC<EditParametersProps> = ({ machineId, parameter, initialValue = '' }) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value || isNaN(Number(value))) {
      alert(`Bitte geben Sie einen gültigen Wert für ${parameter} ein.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const apiClient = new ApiClient();
      const user = getUser();
      const token = user?.access_token;

      const response = await apiClient.post(
        `${BackendUrl}/machines/updateParameter/${machineId}`,
        { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` },
        {
          parameter: parameter,
          value: value
        }
      );

      console.log(response)

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      alert(`Der Wert für ${parameter} wurde erfolgreich gesetzt.`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Parameters:', error);
      alert('Beim Aktualisieren des Parameters ist ein Fehler aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex direction="row" gap="sm" align="center"> 
      <TextInput
        placeholder="Neuer Wert"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        size="xs" 
        style={{ width: '120px' }} 
        />
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        loading={isSubmitting}
        size="xs"
      >
        Wert setzen
      </Button>
    </Flex>
  );
};
