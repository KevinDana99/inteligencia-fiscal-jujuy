import { Button, Text } from '@mantine/core';
import type { IUnifiedRegisterAddress, IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import type { PreviewController } from '../types';
import { SectionCard } from './shared/SectionCard';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type AddressesCardProps = {
  item: IUnifiedRegisterDetail;
  preview: PreviewController;
};

export function AddressesCard({ item, preview }: AddressesCardProps) {
  return (
    <SectionCard title="Domicilios" action={<AddButton onClick={() => preview.openCreateModal('address')} />}>
      <div className={classes.addressList}>
        <AddressBlock label="Fiscal" value={item.fiscalAddress} />
        <AddressBlock label="Comercial" value={item.commercialAddress} />
        <Text className={classes.subsectionLabel}>Alternativos</Text>
        {preview.addresses.map((address) => (
          <EditableAddress
            key={address.id}
            address={address}
            onEdit={() => preview.openEditModal('address', address)}
            onDelete={() => preview.openDeleteModal('address', address.id)}
          />
        ))}
        {preview.isAddressesHydrating ? (
          <Text className={classes.emptyStateText}>Cargando domicilios alternativos...</Text>
        ) : !preview.addresses.length ? (
          <Text className={classes.emptyStateText}>No hay domicilios alternativos cargados.</Text>
        ) : null}
      </div>
    </SectionCard>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="light"
      color="blue"
      radius="md"
      size="xs"
      className={`${classes.inlineAddButton} ${classes.staticButton}`}
      onClick={onClick}
    >
      + Agregar
    </Button>
  );
}

function AddressBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className={classes.addressBlock}>
      <Text className={classes.addressLabel}>{label}</Text>
      <Text className={classes.addressValue}>{value}</Text>
    </div>
  );
}

function EditableAddress({
  address,
  onEdit,
  onDelete
}: {
  address: IUnifiedRegisterAddress;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={classes.inlineEditablePanel}>
      <div className={classes.inlineActionRow}>
        <button className={classes.editLink} onClick={onEdit}>Editar</button>
        <button className={classes.deleteLink} onClick={onDelete}>Eliminar</button>
      </div>
      <Text className={classes.inlinePanelValue}>{address.address}</Text>
    </div>
  );
}
