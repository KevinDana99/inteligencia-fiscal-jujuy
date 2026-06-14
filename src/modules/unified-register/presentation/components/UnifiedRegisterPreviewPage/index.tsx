'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronLeft,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconFileText,
  IconListDetails,
} from '@tabler/icons-react';
import { SendToReprocessingModal } from '@/modules/reprocessing/presentation/components';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterContact,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterDetail,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterFine,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterInterventionOrder,
  IUnifiedRegisterNote,
  IUnifiedRegisterNotesListData,
  UnifiedRegisterRiskLevel
} from '../../../data/models/UnifiedRegister';
import { InformeGenerationModal } from '../InformeGenerationModal';
import { InformePreviewModal } from '../InformePreviewModal';
import { useInformeGeneration } from '../../hooks/useInformeGeneration';
import { useUnifiedRegisterPreview } from '../../hooks/useUnifiedRegisterPreview';
import {
  formatNullableDetailCell,
  getNullableRecordKey
} from '../../utils/unifiedRegisterDetailRecords';
import classes from './UnifiedRegisterPreviewPage.module.css';

const RISK_CLASS_BY_LEVEL = {
  A: classes.riskA,
  B: classes.riskB,
  C: classes.riskC,
  D: classes.riskD
} as const satisfies Record<UnifiedRegisterRiskLevel, string>;

const FINE_STATUS_CLASS: Record<string, string> = {
  Impaga: classes.badgeCritical,
  Pagada: classes.badgePositive,
  'En gestión': classes.badgeWarning
} as const;

const FINE_AMOUNT_CLASS: Record<string, string> = {
  Impaga: classes.amountCritical,
  Pagada: classes.amountPositive,
  'En gestión': classes.amountWarning
} as const;

const FINE_AMOUNT_COLOR: Record<string, string> = {
  Impaga: '#dc2626',
  Pagada: '#059669',
  'En gestión': '#d97706'
} as const;

const ORDER_STATUS_CLASS: Record<string, string> = {
  'En curso': classes.badgeWarning,
  Cerrada: classes.badgePositive
} as const;

const ORDER_AMOUNT_CLASS: Record<string, string> = {
  'En curso': classes.amountWarning,
  Cerrada: classes.amountPositive
} as const;

const ORDER_AMOUNT_COLOR: Record<string, string> = {
  'En curso': '#d97706',
  Cerrada: '#059669'
} as const;

const SOURCE_STATUS_CLASS: Record<string, string> = {
  '✓ Validado': classes.badgeNeutral,
  Diferencia: classes.badgeCritical,
  Desvío: classes.badgeCritical,
  Revisar: classes.badgeWarning,
  '✓ OK': classes.badgeNeutral,
  'Al día': classes.badgeNeutral,
  'Deuda parcial': classes.badgeWarning,
  Pagado: classes.badgeNeutral,
  Pendiente: classes.badgeCritical
} as const;

function getRiskClass(riskLevel: UnifiedRegisterRiskLevel | null) {
  return riskLevel ? RISK_CLASS_BY_LEVEL[riskLevel] : classes.riskEmpty;
}

function getStatusClass(
  statusClassByValue: Record<string, string>,
  status: string | null
) {
  return status ? statusClassByValue[status] : undefined;
}

function Pager({
  current,
  total,
  onPrevious,
  onNext,
  disabled
}: {
  current: number;
  total: number;
  onPrevious?: () => void;
  onNext?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={classes.pager}>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        onClick={onPrevious}
        disabled={disabled || current <= 1}
      >
        <IconArrowNarrowLeft size={14} />
      </ActionIcon>
      <Text className={classes.pagerLabel}>
        {current} / {total}
      </Text>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        onClick={onNext}
        disabled={disabled || current >= total}
      >
        <IconArrowNarrowRight size={14} />
      </ActionIcon>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
  footer
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className={classes.sectionCard} padding="md" radius="lg">
      <div className={classes.sectionHeader}>
        <Text className={classes.sectionTitle}>{title}</Text>
        {action}
      </div>
      {children}
      {footer ? <div className={classes.sectionFooter}>{footer}</div> : null}
    </Card>
  );
}

function RecordsTable({
  title,
  badgeLabel,
  columns,
  rows,
  footer
}: {
  title: string;
  badgeLabel: string;
  columns: string[];
  rows: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className={classes.tableCard} padding="md" radius="lg">
      <div className={classes.tableHeader}>
        <Group gap="xs">
          <Text className={classes.sectionTitle}>{title}</Text>
          <Badge className={classes.tableCountBadge} radius="xl">
            {badgeLabel}
          </Badge>
        </Group>
      </div>

      <div className={classes.tableWrapper}>
        <Table withTableBorder={false} withColumnBorders={false} withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column}>{column}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      {footer ? <div className={classes.tableFooter}>{footer}</div> : null}
    </Card>
  );
}

export function UnifiedRegisterPreviewPage({
  item,
  initialContactsData,
  initialMercurioData,
  initialInterventionOrdersData,
  initialNotesData
}: {
  item: IUnifiedRegisterDetail;
  initialContactsData: IUnifiedRegisterContactsListData | null;
  initialMercurioData: IUnifiedRegisterFinesListData | null;
  initialInterventionOrdersData: IUnifiedRegisterInterventionOrdersListData | null;
  initialNotesData: IUnifiedRegisterNotesListData | null;
}) {
  const router = useRouter();
  const {
    activeHeaderModal,
    addresses,
    addressActionError,
    contacts,
    contactActionError,
    contactsCurrentPage,
    contactsTotalPages,
    noteActionError,
    notesCurrentPage,
    notesTotalPages,
    fines,
    finesCurrentPage,
    finesTotalPages,
    finesTotalItems,
    fineActionError,
    interventionOrders,
    interventionOrdersCurrentPage,
    interventionOrdersTotalPages,
    interventionOrdersTotalItems,
    interventionOrdersError,
    reprocessingActionError,
    batchSearch,
    filteredLotOptions,
    selectedLotOption,
    activeSourceTableId,
    activeSourceTable,
    activeNote,
    isEditModalOpen,
    isDeleteModalOpen,
    editKind,
    deleteKind,
    isAddressSavePending,
    isAddressDeletePending,
    isContactsPagePending,
    isContactSavePending,
    isContactDeletePending,
    isNotesPagePending,
    isFinesPagePending,
    isInterventionOrdersPagePending,
    isNoteSavePending,
    isNoteDeletePending,
    formValue,
    contactForm,
    editingItemId,
    setBatchSearch,
    setActiveSourceTableId,
    setFormValue,
    setContactField,
    openHeaderModal,
    closeHeaderModal,
    confirmReprocessing,
    selectLotOption,
    closeLotConfirmModal,
    openCreateModal,
    openEditModal,
    closeEditModal,
    resetEditModal,
    submitEditModal,
    openDeleteModal,
    closeDeleteModal,
    resetDeleteModal,
    confirmDeleteModal,
    goToPreviousContactPage,
    goToNextContactPage,
    goToPreviousNote,
    goToNextNote,
    goToPreviousFinePage,
    goToNextFinePage,
    goToPreviousInterventionOrderPage,
    goToNextInterventionOrderPage
  } = useUnifiedRegisterPreview(
    item,
    initialContactsData,
    initialNotesData,
    initialMercurioData,
    initialInterventionOrdersData
  );
  const informeGeneration = useInformeGeneration(item);

  const isEditingNote = editKind === 'note';
  const isEditingContact = editKind === 'contact';
  const isContactFormEmpty =
    !contactForm.phone.trim() &&
    !contactForm.mail.trim() &&
    !contactForm.legal.trim() &&
    !contactForm.accountant.trim();
  const backRoute = '/' as Route;
  const editModalTitle =
    editKind === 'address'
      ? editingItemId
        ? 'Editar domicilio alternativo'
        : 'Agregar domicilio alternativo'
      : editKind === 'contact'
        ? editingItemId
          ? 'Editar contacto'
          : 'Agregar contacto'
        : editKind === 'note'
          ? editingItemId
            ? 'Editar nota'
            : 'Agregar nota'
          : '';
  const editModalLabel =
    editKind === 'note'
      ? 'Nota'
      : editKind === 'address'
        ? 'Dirección'
        : editKind === 'contact'
          ? 'Contacto'
          : '';
  const editModalPlaceholder =
    editKind === 'note'
      ? 'Ingresá una nota'
      : editKind === 'address'
        ? 'Ej: Av. Independencia 500, S.S. de Jujuy'
        : editKind === 'contact'
          ? 'Ingresá un contacto'
          : '';
  const deleteModalTitle =
    deleteKind === 'address'
      ? 'Eliminar domicilio'
      : deleteKind === 'contact'
        ? 'Eliminar contacto'
        : deleteKind === 'note'
          ? 'Eliminar nota'
          : '';
  const deleteModalDescription =
    deleteKind === 'address'
      ? '¿Estás seguro que querés eliminar este domicilio alternativo?'
      : deleteKind === 'contact'
        ? '¿Estás seguro que querés eliminar este contacto?'
        : deleteKind === 'note'
          ? '¿Estás seguro que querés eliminar esta nota?'
          : '';
  const closeInformeFlow = () => {
    informeGeneration.resetFlow();
    closeHeaderModal();
  };

  return (
    <div className={classes.page}>
      <button className={classes.backButton} onClick={() => router.push(backRoute)}>
        <IconChevronLeft size={14} />
        <span>Padrón Unificado</span>
      </button>

      <Card className={classes.headerCard} padding={0} radius="xl">
        <div className={classes.headerTop}>
          <div className={classes.headerMain}>
            <Text className={classes.cuit}>CUIT {item.cuit}</Text>
            <Text className={classes.title}>{item.businessName}</Text>

            <div className={classes.pillRow}>
              <span className={`${classes.pill} ${classes.statusPill}`}>
                <span className={classes.statusDot} />
                {item.status}
              </span>
              {item.regime ? (
                <span className={`${classes.pill} ${classes.regimeText}`}>
                  {item.regime}
                </span>
              ) : null}
              <span className={`${classes.pill} ${classes.controlPill}`}>
                Control IF: {item.controlLotsLabel}
              </span>
              {item.activities.map((activity) => (
                <span
                  key={activity.id}
                  className={`${classes.pill} ${
                    activity.type === 'Primaria' ? classes.activityPrimaryPill : classes.activitySecondaryPill
                  }`}
                >
                  {activity.label}
                </span>
              ))}
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaText}>
                <strong>Inicio actividad:</strong> {item.startedAt}
              </Text>
              <Text className={classes.metaText}>
                <strong>Jurisdicción:</strong> {item.jurisdiction}
              </Text>
              <Text className={classes.metaText}>
                <strong>Domicilio fiscal:</strong> {item.fiscalAddress}
              </Text>
              <Text className={classes.metaText}>
                <strong>Domicilio alternativo:</strong> {item.alternateAddress}
              </Text>
            </div>
          </div>

          <div className={`${classes.riskBox} ${getRiskClass(item.riskLevel)}`}>
            <Text className={classes.riskLevel}>
              {formatNullableDetailCell(item.riskLevel)}
            </Text>
            <Text className={classes.riskLabel}>Riesgo</Text>
          </div>
        </div>

        <div className={classes.headerActions}>
          <Group gap="sm">
            <button className={classes.switchAction} onClick={() => openHeaderModal('reprocessing')}>
              <span className={classes.switchTrack}>
                <span className={classes.switchKnob} />
              </span>
              <span>Marcar reproceso</span>
            </button>

            <button className={classes.secondaryAction} onClick={() => openHeaderModal('crosses')}>
              <IconListDetails size={12} className={classes.secondaryActionIcon} />
              <span>Cruces a realizar</span>
              <IconChevronDown size={12} className={classes.secondaryActionChevron} />
            </button>
          </Group>

          <div className={classes.headerActionMenu}>
            <Button
              variant="default"
              radius="xl"
              className={`${classes.headerGhostButton} ${classes.staticButton}`}
              leftSection={<IconFileText size={14} />}
              onClick={() => openHeaderModal('report')}
            >
              Generar Informe
            </Button>
            <Button
              radius="xl"
              className={`${classes.headerPrimaryButton} ${classes.staticButton}`}
              onClick={() =>
                activeHeaderModal === 'batch' ? closeHeaderModal() : openHeaderModal('batch')
              }
            >
              Agregar a lote
            </Button>

            {activeHeaderModal === 'batch' ? (
              <>
                <button
                  type="button"
                  aria-label="Cerrar selector de lote"
                  className={classes.batchDropdownBackdrop}
                  onClick={closeHeaderModal}
                />
                <div className={classes.batchDropdown}>
                <TextInput
                  classNames={{
                    input: classes.batchDropdownInput
                  }}
                  value={batchSearch}
                  onChange={(event) => setBatchSearch(event.currentTarget.value)}
                  placeholder="Buscar lote..."
                />

                <div className={classes.batchDropdownList}>
                  {filteredLotOptions.map((lot) => (
                    <button
                      key={lot.id}
                      type="button"
                      className={classes.batchDropdownOption}
                      onClick={() => selectLotOption(lot)}
                    >
                      <Text className={classes.batchDropdownOptionTitle}>{lot.label}</Text>
                      <Text className={classes.batchDropdownOptionMeta}>
                        {lot.cuitCount} CUITs
                      </Text>
                    </button>
                  ))}
                </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Card>

      <div className={classes.metricsGrid}>
        {item.widgets.map((widget) => (
          <Card key={widget.id} className={classes.metricCard} padding={0} radius="lg">
            <Text className={classes.metricLabel}>{widget.label}</Text>

            {widget.splitValue ? (
              <div className={classes.metricSplit}>
                <div>
                  <Text className={classes.metricSplitPrimaryValue}>
                    {widget.splitValue.primaryValue}
                  </Text>
                  <Text className={classes.metricSplitPrimaryLabel}>
                    {widget.splitValue.primaryLabel}
                  </Text>
                </div>
                <Text className={classes.metricSplitDivider}>/</Text>
                <div>
                  <Text className={classes.metricSplitSecondaryValue}>
                    {widget.splitValue.secondaryValue}
                  </Text>
                  <Text className={classes.metricSplitSecondaryLabel}>
                    {widget.splitValue.secondaryLabel}
                  </Text>
                </div>
              </div>
            ) : (
              <>
                <Text
                  className={`${classes.metricValue} ${
                    widget.id === 'debt' ? classes.metricValueCritical : ''
                  }`}
                >
                  {widget.value}
                </Text>
                {widget.badgeLabel ? (
                  <Badge
                    className={classes.metricBadge}
                    classNames={{ label: classes.metricBadgeLabel }}
                    radius="xl"
                  >
                    {widget.badgeLabel}
                  </Badge>
                ) : null}
                {widget.subtitle ? (
                  <Text
                    className={`${classes.metricSubtitle} ${
                      widget.id === 'debt' ? classes.metricSubtitleCritical : ''
                    }`}
                  >
                    {widget.subtitle}
                  </Text>
                ) : null}
              </>
            )}
          </Card>
        ))}
      </div>

      <div className={classes.contentGrid}>
        <div className={classes.leftColumn}>
          <SectionCard title="Actividades">
            <div className={classes.activitiesList}>
              {item.activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`${classes.activityEntry} ${
                    index > 0 ? classes.activityEntryBorder : ''
                  }`}
                >
                  <div>
                    <Text className={classes.activityType}>{activity.type}</Text>
                    <Text className={classes.activityLabel}>{activity.label}</Text>
                  </div>
                  <Badge
                    radius="xl"
                    classNames={{ label: classes.activityTagLabel }}
                    className={
                      activity.tagTone === 'blue'
                        ? classes.activityTagPrimary
                        : classes.activityTagSecondary
                    }
                  >
                    {activity.tag}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Domicilios"
            action={
              <Button
                variant="light"
                color="blue"
                radius="md"
                size="xs"
                className={`${classes.inlineAddButton} ${classes.staticButton}`}
                onClick={() => openCreateModal('address')}
              >
                + Agregar
              </Button>
            }
          >
            <div className={classes.addressList}>
              <div className={classes.addressBlock}>
                <Text className={classes.addressLabel}>Fiscal</Text>
                <Text className={classes.addressValue}>{item.fiscalAddress}</Text>
              </div>
              <div className={classes.addressBlock}>
                <Text className={classes.addressLabel}>Comercial</Text>
                <Text className={classes.addressValue}>{item.commercialAddress}</Text>
              </div>

              <Text className={classes.subsectionLabel}>Alternativos</Text>
              {addresses.map((address) => (
                <div key={address.id} className={classes.inlineEditablePanel}>
                  <div className={classes.inlineActionRow}>
                    <button
                      className={classes.editLink}
                      onClick={() => openEditModal('address', address as IUnifiedRegisterAddress)}
                    >
                      Editar
                    </button>
                    <button
                      className={classes.deleteLink}
                      onClick={() => openDeleteModal('address', address.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <Text className={classes.inlinePanelValue}>{address.address}</Text>
                </div>
              ))}
              {!addresses.length ? (
                <Text className={classes.emptyStateText}>
                  No hay domicilios alternativos cargados.
                </Text>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Contactos"
            action={
              <Button
                variant="light"
                color="blue"
                radius="md"
                size="xs"
                className={`${classes.inlineAddButton} ${classes.staticButton}`}
                onClick={() => openCreateModal('contact')}
              >
                + Agregar
              </Button>
            }
            footer={
              <Pager
                current={contactsTotalPages ? contactsCurrentPage : 0}
                total={Math.max(contactsTotalPages, 1)}
                onPrevious={goToPreviousContactPage}
                onNext={goToNextContactPage}
                disabled={isContactsPagePending || contactsTotalPages <= 1}
              />
            }
          >
            <div className={classes.highlightPanel}>
              <div className={classes.inlineActionRow}>
                {contacts[0] ? (
                  <>
                    <button
                      className={classes.editLink}
                      onClick={() => openEditModal('contact', contacts[0] as IUnifiedRegisterContact)}
                    >
                      Editar
                    </button>
                    <button
                      className={classes.deleteLink}
                      onClick={() =>
                        openDeleteModal('contact', contacts[0].recordId ?? contacts[0].id)
                      }
                    >
                      Eliminar
                    </button>
                  </>
                ) : null}
              </div>
              <div className={classes.contactsList}>
                {contacts.map((contact) => (
                  <div
                    key={`${contact.recordId ?? 'contact'}-${contact.id}`}
                    className={classes.contactItem}
                  >
                    <Text className={classes.contactLabel}>{contact.label}</Text>
                    <Text className={classes.contactValue}>{contact.value}</Text>
                  </div>
                ))}
              </div>
              {!contacts.length ? (
                <Text className={classes.emptyStateText}>No hay contactos cargados.</Text>
              ) : null}
              {contactActionError ? (
                <Text className={classes.modalText} c="red">
                  {contactActionError}
                </Text>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Notas internas"
            action={
              <Button
                variant="light"
                color="blue"
                radius="md"
                size="xs"
                className={`${classes.inlineAddButton} ${classes.staticButton}`}
                onClick={() => openCreateModal('note')}
              >
                + Nota
              </Button>
            }
            footer={
              <Pager
                current={notesTotalPages ? notesCurrentPage : 0}
                total={Math.max(notesTotalPages, 1)}
                onPrevious={goToPreviousNote}
                onNext={goToNextNote}
                disabled={isNotesPagePending || notesTotalPages <= 1}
              />
            }
          >
            <div className={classes.highlightPanel}>
              {activeNote ? (
                <>
                  <div className={classes.inlineActionRow}>
                    <button
                      className={classes.editLink}
                      onClick={() => openEditModal('note', activeNote as IUnifiedRegisterNote)}
                    >
                      Editar
                    </button>
                    <button
                      className={classes.deleteLink}
                      onClick={() => openDeleteModal('note', activeNote.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <Text className={classes.noteText}>{activeNote.text}</Text>
                </>
              ) : (
                <Text className={classes.emptyStateText}>No hay notas cargadas.</Text>
              )}
              {noteActionError ? (
                <Text className={classes.modalText} c="red">
                  {noteActionError}
                </Text>
              ) : null}
            </div>
          </SectionCard>
        </div>

        <div className={classes.rightColumn}>
          <RecordsTable
            title="Multas Mercurio"
            badgeLabel={`${finesTotalItems} registros`}
            columns={['N°', 'Fecha', 'Descripción', 'Monto', 'Estado']}
            rows={fines.map((fine: IUnifiedRegisterFine, index) => (
              <Table.Tr key={getNullableRecordKey(fine.id, 'fine', index)}>
                <Table.Td className={classes.mutedCodeCell}>
                  {formatNullableDetailCell(fine.id)}
                </Table.Td>
                <Table.Td className={classes.mutedCell}>
                  {formatNullableDetailCell(fine.issuedAt)}
                </Table.Td>
                <Table.Td className={classes.descriptionCell}>
                  {formatNullableDetailCell(fine.description)}
                </Table.Td>
                <Table.Td
                  className={`${classes.amountCell} ${
                    getStatusClass(FINE_AMOUNT_CLASS, fine.status) ?? ''
                  }`}
                  style={{
                    color: fine.status ? FINE_AMOUNT_COLOR[fine.status] : undefined
                  }}
                >
                  {formatNullableDetailCell(fine.amount)}
                </Table.Td>
                <Table.Td className={classes.statusCell}>
                  {fine.status ? (
                    <Badge
                      radius="xl"
                      className={`${
                        getStatusClass(FINE_STATUS_CLASS, fine.status) ??
                        classes.badgeNeutral
                      } ${classes.statusBadge}`}
                      classNames={{ label: classes.statusBadgeLabel }}
                    >
                      {fine.status}
                    </Badge>
                  ) : null}
                </Table.Td>
              </Table.Tr>
            ))}
            footer={
              <Pager
                current={finesCurrentPage}
                total={finesTotalPages || 1}
                onPrevious={goToPreviousFinePage}
                onNext={goToNextFinePage}
                disabled={isFinesPagePending || finesTotalPages <= 1}
              />
            }
          />
          {fineActionError ? (
            <Text className={classes.modalText} c="red">
              {fineActionError}
            </Text>
          ) : null}

          <RecordsTable
            title="Órdenes de Intervención"
            badgeLabel={`${interventionOrdersTotalItems} registros`}
            columns={['N° OI', 'Período', 'Motivo', 'Monto', 'Estado']}
            rows={interventionOrders.map((order: IUnifiedRegisterInterventionOrder, index) => (
              <Table.Tr key={getNullableRecordKey(order.id, 'order', index)}>
                <Table.Td className={classes.orderCodeCellCell}>
                  <span className={classes.orderCodeCell}>
                    {formatNullableDetailCell(order.id)}
                  </span>
                </Table.Td>
                <Table.Td className={classes.mutedCell}>
                  {formatNullableDetailCell(order.period)}
                </Table.Td>
                <Table.Td>{formatNullableDetailCell(order.reason)}</Table.Td>
                <Table.Td
                  className={`${classes.amountCell} ${
                    getStatusClass(ORDER_AMOUNT_CLASS, order.status) ?? ''
                  }`}
                  style={{
                    color: order.status ? ORDER_AMOUNT_COLOR[order.status] : undefined
                  }}
                >
                  {formatNullableDetailCell(order.amount)}
                </Table.Td>
                <Table.Td className={classes.statusCell}>
                  {order.status ? (
                    <Badge
                      radius="xl"
                      className={`${
                        getStatusClass(ORDER_STATUS_CLASS, order.status) ??
                        classes.badgeNeutral
                      } ${classes.statusBadge}`}
                      classNames={{ label: classes.statusBadgeLabel }}
                    >
                      {order.status}
                    </Badge>
                  ) : null}
                </Table.Td>
              </Table.Tr>
            ))}
            footer={
              <Pager
                current={interventionOrdersCurrentPage}
                total={interventionOrdersTotalPages || 1}
                onPrevious={goToPreviousInterventionOrderPage}
                onNext={goToNextInterventionOrderPage}
                disabled={
                  isInterventionOrdersPagePending || interventionOrdersTotalPages <= 1
                }
              />
            }
          />
          {interventionOrdersError ? (
            <Text className={classes.modalText} c="red">
              {interventionOrdersError}
            </Text>
          ) : null}

          <Card className={classes.tableCard} padding={0} radius="lg">
            <div className={classes.tabsRow}>
              {item.sourceTables.map((table) => (
                <button
                  key={table.id}
                  className={`${classes.tabButton} ${
                    activeSourceTableId === table.id ? classes.tabButtonActive : ''
                  }`}
                  onClick={() => setActiveSourceTableId(table.id)}
                >
                  {table.label}
                </button>
              ))}
            </div>

            <div className={classes.tableWrapper}>
              <Table
                className={classes.sourceTable}
                withTableBorder={false}
                withColumnBorders={false}
                withRowBorders={false}
              >
                <Table.Thead>
                  <Table.Tr>
                    {activeSourceTable.columns.map((column) => (
                      <Table.Th key={column}>{column}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {activeSourceTable.rows.map((row, rowIndex) => (
                    <Table.Tr key={`${activeSourceTable.id}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => {
                        const isLastCell = cellIndex === row.length - 1;
                        const columnName = activeSourceTable.columns[cellIndex]?.toLowerCase() ?? '';
                        const isDifferenceColumn = columnName === 'diferencia';
                        const isCriticalValue = isDifferenceColumn && cell.trim().startsWith('+');
                        const isPositiveDifference = isDifferenceColumn && !cell.trim().startsWith('+');

                        if (isLastCell) {
                          return (
                            <Table.Td
                              key={`${activeSourceTable.id}-${rowIndex}-${cellIndex}`}
                              className={classes.sourceStatusCell}
                            >
                              <Badge
                                radius="xl"
                                className={`${SOURCE_STATUS_CLASS[cell] ?? classes.badgeNeutral} ${
                                  classes.sourceStatusBadge
                                }`}
                                classNames={{ root: classes.sourceStatusBadgeRoot, label: classes.sourceStatusBadgeLabel }}
                              >
                                {cell}
                              </Badge>
                            </Table.Td>
                          );
                        }

                        return (
                          <Table.Td
                            key={`${activeSourceTable.id}-${rowIndex}-${cellIndex}`}
                            className={isCriticalValue ? classes.amountCritical : ''}
                            style={
                              isCriticalValue
                                ? { color: '#dc2626', fontWeight: 600 }
                                : isPositiveDifference
                                  ? { color: '#059669', fontWeight: 600 }
                                  : undefined
                            }
                          >
                            {cell}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>

            <div className={classes.tableFooter}>
              <Pager current={1} total={1} disabled />
            </div>
          </Card>
        </div>
      </div>

      <SendToReprocessingModal
        opened={activeHeaderModal === 'reprocessing'}
        onClose={closeHeaderModal}
        contribuyenteId={item.contribuyenteId}
        cuit={item.cuit}
        razonSocial={item.businessName}
        error={reprocessingActionError}
        onConfirm={confirmReprocessing}
      />

      <Modal
        opened={activeHeaderModal === 'crosses'}
        onClose={closeHeaderModal}
        title="Cruces a realizar"
        size="lg"
        centered
        zIndex={900}
        classNames={{
          overlay: classes.modalOverlay,
          inner: classes.modalInner,
          content: classes.modalContent,
          header: classes.modalHeader,
          body: classes.modalBody,
          title: classes.modalTitle
        }}
      >
        <Stack gap="md">
          <Text className={classes.modalText}>
            Panel mock de cruces. La conexión con la lógica final se hará en otra iteración.
          </Text>
          <Card className={classes.modalMockCard} padding="md" radius="md">
            <Stack gap="xs">
              <Text fw={600}>Mensuales</Text>
              <Text size="sm" c="dimmed">
                Control de desvío de BI, créditos, SAF y agentes.
              </Text>
            </Stack>
          </Card>
          <Card className={classes.modalMockCard} padding="md" radius="md">
            <Stack gap="xs">
              <Text fw={600}>Anuales</Text>
              <Text size="sm" c="dimmed">
                Régimen CM, BI declarada, no inscriptos y bases presuntivas.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Modal>

      <InformeGenerationModal
        opened={activeHeaderModal === 'report' && informeGeneration.step === 'form'}
        report={informeGeneration}
        onClose={closeInformeFlow}
      />

      <InformePreviewModal
        opened={activeHeaderModal === 'report' && informeGeneration.step === 'preview'}
        report={informeGeneration}
        onClose={closeInformeFlow}
      />

      <Modal
        opened={Boolean(selectedLotOption)}
        onClose={closeLotConfirmModal}
        title="Agregar a lote"
        centered
        size={420}
        zIndex={900}
        classNames={{
          overlay: classes.modalOverlay,
          inner: classes.modalInner,
          content: `${classes.modalContent} ${classes.lotConfirmModalContent}`,
          header: `${classes.modalHeader} ${classes.lotConfirmModalHeader}`,
          body: `${classes.modalBody} ${classes.lotConfirmModalBody}`,
          title: classes.modalTitle
        }}
      >
        {selectedLotOption ? (
          <Stack gap={0}>
            <Text className={`${classes.modalText} ${classes.lotConfirmModalText}`}>
              ¿Querés agregar este CUIT al lote {selectedLotOption.label} ({selectedLotOption.cuitCount}{' '}
              CUITs actualmente)
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeLotConfirmModal}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
                onClick={closeLotConfirmModal}
              >
                Confirmar
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>

      <Modal
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onExitTransitionEnd={resetDeleteModal}
        title={deleteModalTitle}
        centered
        zIndex={900}
        classNames={{
          overlay: classes.modalOverlay,
          inner: classes.modalInner,
          content: classes.modalContent,
          header: classes.modalHeader,
          body: classes.modalBody,
          title: classes.modalTitle
        }}
      >
        {deleteKind ? (
          <Stack gap="lg">
            <Text className={classes.modalText}>{deleteModalDescription}</Text>
            {deleteKind === 'address' && addressActionError ? (
              <Text className={classes.modalText} c="red">
                {addressActionError}
              </Text>
            ) : null}
            {deleteKind === 'contact' && contactActionError ? (
              <Text className={classes.modalText} c="red">
                {contactActionError}
              </Text>
            ) : null}
            {deleteKind === 'note' && noteActionError ? (
              <Text className={classes.modalText} c="red">
                {noteActionError}
              </Text>
            ) : null}
            <Group justify="flex-end">
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeDeleteModal}
                disabled={
                  (deleteKind === 'address' && isAddressDeletePending) ||
                  (deleteKind === 'contact' && isContactDeletePending) ||
                  (deleteKind === 'note' && isNoteDeletePending)
                }
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.deletePrimaryButton} ${classes.staticButton}`}
                onClick={confirmDeleteModal}
                loading={
                  (deleteKind === 'address' && isAddressDeletePending) ||
                  (deleteKind === 'contact' && isContactDeletePending) ||
                  (deleteKind === 'note' && isNoteDeletePending)
                }
              >
                Eliminar
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>

      <Modal
        opened={isEditModalOpen}
        onClose={closeEditModal}
        onExitTransitionEnd={resetEditModal}
        title={editModalTitle}
        centered
        withCloseButton={!isEditingNote}
        zIndex={900}
        classNames={{
          overlay: classes.modalOverlay,
          inner: classes.modalInner,
          content: `${classes.modalContent} ${isEditingContact ? classes.contactModalContent : ''} ${
            isEditingNote ? classes.noteModalContent : ''
          }`,
          header: `${classes.modalHeader} ${isEditingContact ? classes.contactModalHeader : ''} ${
            isEditingNote ? classes.noteModalHeader : ''
          }`,
          body: `${classes.modalBody} ${isEditingContact ? classes.contactModalBody : ''} ${
            isEditingNote ? classes.noteModalBody : ''
          }`,
          title: classes.modalTitle
        }}
      >
        {isEditingContact ? (
          <Stack gap={0}>
            <div className={classes.contactModalFields}>
              <div>
                <Text className={classes.contactModalLabel}>
                  Teléfono <span className={classes.contactModalOptional}>(opcional)</span>
                </Text>
                <TextInput
                  classNames={{ input: classes.modalInputField }}
                  value={contactForm.phone}
                  onChange={(event) => setContactField('phone', event.currentTarget.value)}
                  placeholder="+5388 000-0000"
                />
              </div>
              <div>
                <Text className={classes.contactModalLabel}>
                  Mail <span className={classes.contactModalOptional}>(opcional)</span>
                </Text>
                <TextInput
                  classNames={{ input: classes.modalInputField }}
                  value={contactForm.mail}
                  onChange={(event) => setContactField('mail', event.currentTarget.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <Text className={classes.contactModalLabel}>
                  Representante legal{' '}
                  <span className={classes.contactModalOptional}>(opcional)</span>
                </Text>
                <TextInput
                  classNames={{ input: classes.modalInputField }}
                  value={contactForm.legal}
                  onChange={(event) => setContactField('legal', event.currentTarget.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Text className={classes.contactModalLabel}>
                  Contador <span className={classes.contactModalOptional}>(opcional)</span>
                </Text>
                <TextInput
                  classNames={{ input: classes.modalInputField }}
                  value={contactForm.accountant}
                  onChange={(event) => setContactField('accountant', event.currentTarget.value)}
                  placeholder="Nombre o estudio"
                />
              </div>
            </div>
            {contactActionError ? (
              <Text className={classes.modalText} c="red">
                {contactActionError}
              </Text>
            ) : null}
            <Group justify="flex-end" gap="sm" className={classes.contactModalFooter}>
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeEditModal}
                disabled={isContactSavePending}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
                onClick={submitEditModal}
                disabled={isContactFormEmpty}
                loading={isContactSavePending}
              >
                Guardar
              </Button>
            </Group>
          </Stack>
        ) : isEditingNote ? (
          <Stack gap={0}>
            <Textarea
              classNames={{
                input: classes.noteModalTextarea
              }}
              value={formValue ?? ''}
              onChange={(event) => setFormValue(event.currentTarget.value)}
              placeholder="Escribí la nota..."
              rows={4}
            />
            {noteActionError ? (
              <Text className={classes.modalText} c="red">
                {noteActionError}
              </Text>
            ) : null}
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeEditModal}
                disabled={isNoteSavePending}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
                onClick={submitEditModal}
                disabled={!formValue?.trim()}
                loading={isNoteSavePending}
              >
                Guardar
              </Button>
            </Group>
          </Stack>
        ) : editKind ? (
          <Stack gap="md">
            <TextInput
              classNames={{
                label: classes.modalInputLabel,
                input: classes.modalInputField
              }}
              label={editModalLabel}
              value={formValue ?? ''}
              onChange={(event) => setFormValue(event.currentTarget.value)}
              placeholder={editModalPlaceholder}
            />
            {editKind === 'address' && addressActionError ? (
              <Text className={classes.modalText} c="red">
                {addressActionError}
              </Text>
            ) : null}
            <Group justify="flex-end">
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeEditModal}
                disabled={editKind === 'address' && isAddressSavePending}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
                onClick={submitEditModal}
                disabled={!formValue?.trim()}
                loading={editKind === 'address' && isAddressSavePending}
              >
                Guardar
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </div>
  );
}
