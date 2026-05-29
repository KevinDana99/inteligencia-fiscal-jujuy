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
  TextInput
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronLeft,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconFileText,
  IconListDetails,
  IconSearch,
} from '@tabler/icons-react';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterContact,
  IUnifiedRegisterDetail,
  IUnifiedRegisterFine,
  IUnifiedRegisterInterventionOrder,
  IUnifiedRegisterNote
} from '../../../data/models/UnifiedRegister';
import { useUnifiedRegisterPreview } from '../../hooks/useUnifiedRegisterPreview';
import classes from './UnifiedRegisterPreviewPage.module.css';

const RISK_CLASS_BY_LEVEL = {
  A: classes.riskA,
  B: classes.riskB,
  C: classes.riskC
} as const;

const FINE_STATUS_CLASS = {
  Impaga: classes.badgeCritical,
  Pagada: classes.badgePositive,
  'En gestión': classes.badgeWarning
} as const;

const FINE_AMOUNT_CLASS = {
  Impaga: classes.amountCritical,
  Pagada: classes.amountPositive,
  'En gestión': classes.amountWarning
} as const;

const FINE_AMOUNT_COLOR = {
  Impaga: '#dc2626',
  Pagada: '#059669',
  'En gestión': '#d97706'
} as const;

const ORDER_STATUS_CLASS = {
  'En curso': classes.badgeWarning,
  Cerrada: classes.badgePositive
} as const;

const ORDER_AMOUNT_CLASS = {
  'En curso': classes.amountWarning,
  Cerrada: classes.amountPositive
} as const;

const ORDER_AMOUNT_COLOR = {
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

export function UnifiedRegisterPreviewPage({ item }: { item: IUnifiedRegisterDetail }) {
  const router = useRouter();
  const {
    activeHeaderModal,
    addresses,
    contacts,
    notes,
    batchSearch,
    filteredLotOptions,
    activeSourceTableId,
    activeSourceTable,
    activeNote,
    activeNoteIndex,
    isEditModalOpen,
    isDeleteModalOpen,
    editKind,
    deleteKind,
    formValue,
    editingItemId,
    setBatchSearch,
    setActiveSourceTableId,
    setFormValue,
    openHeaderModal,
    closeHeaderModal,
    openCreateModal,
    openEditModal,
    closeEditModal,
    resetEditModal,
    submitEditModal,
    openDeleteModal,
    closeDeleteModal,
    resetDeleteModal,
    confirmDeleteModal,
    removeAddress,
    removeContact,
    removeNote,
    goToPreviousNote,
    goToNextNote
  } = useUnifiedRegisterPreview(item);

  const isEditingNote = editKind === 'note';
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
              <span className={`${classes.pill} ${classes.regimeText}`}>{item.regime}</span>
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

          <div className={`${classes.riskBox} ${RISK_CLASS_BY_LEVEL[item.riskLevel]}`}>
            <Text className={classes.riskLevel}>{item.riskLevel}</Text>
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

          <Group gap="sm">
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
              onClick={() => openHeaderModal('batch')}
            >
              Agregar a lote
            </Button>
          </Group>
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
            footer={<Pager current={1} total={1} disabled />}
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
                      onClick={() => openDeleteModal('contact', contacts[0].id)}
                    >
                      Eliminar
                    </button>
                  </>
                ) : null}
              </div>
              <div className={classes.contactsList}>
                {contacts.map((contact) => (
                  <div key={contact.id} className={classes.contactItem}>
                    <Text className={classes.contactLabel}>{contact.label}</Text>
                    <Text className={classes.contactValue}>{contact.value}</Text>
                  </div>
                ))}
              </div>
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
                current={notes.length ? activeNoteIndex + 1 : 0}
                total={Math.max(notes.length, 1)}
                onPrevious={goToPreviousNote}
                onNext={goToNextNote}
                disabled={notes.length <= 1}
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
            </div>
          </SectionCard>
        </div>

        <div className={classes.rightColumn}>
          <RecordsTable
            title="Multas Mercurio"
            badgeLabel={`${item.fines.length} registros`}
            columns={['N°', 'Fecha', 'Descripción', 'Monto', 'Estado']}
            rows={item.fines.map((fine: IUnifiedRegisterFine) => (
              <Table.Tr key={fine.id}>
                <Table.Td className={classes.mutedCodeCell}>{fine.id}</Table.Td>
                <Table.Td className={classes.mutedCell}>{fine.issuedAt}</Table.Td>
                <Table.Td className={classes.descriptionCell}>{fine.description}</Table.Td>
                <Table.Td
                  className={`${classes.amountCell} ${FINE_AMOUNT_CLASS[fine.status]}`}
                  style={{ color: FINE_AMOUNT_COLOR[fine.status] }}
                >
                  {fine.amount}
                </Table.Td>
                <Table.Td className={classes.statusCell}>
                  <Badge
                    radius="xl"
                    className={`${FINE_STATUS_CLASS[fine.status]} ${classes.statusBadge}`}
                    classNames={{ label: classes.statusBadgeLabel }}
                  >
                    {fine.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
            footer={<Pager current={1} total={1} disabled />}
          />

          <RecordsTable
            title="Órdenes de Intervención"
            badgeLabel={`${item.interventionOrders.length} registros`}
            columns={['N° OI', 'Período', 'Motivo', 'Monto', 'Estado']}
            rows={item.interventionOrders.map((order: IUnifiedRegisterInterventionOrder) => (
              <Table.Tr key={order.id}>
                <Table.Td className={classes.orderCodeCellCell}>
                  <span className={classes.orderCodeCell}>{order.id}</span>
                </Table.Td>
                <Table.Td className={classes.mutedCell}>{order.period}</Table.Td>
                <Table.Td>{order.reason}</Table.Td>
                <Table.Td
                  className={`${classes.amountCell} ${ORDER_AMOUNT_CLASS[order.status]}`}
                  style={{ color: ORDER_AMOUNT_COLOR[order.status] }}
                >
                  {order.amount}
                </Table.Td>
                <Table.Td className={classes.statusCell}>
                  <Badge
                    radius="xl"
                    className={`${ORDER_STATUS_CLASS[order.status]} ${classes.statusBadge}`}
                    classNames={{ label: classes.statusBadgeLabel }}
                  >
                    {order.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
            footer={<Pager current={1} total={1} disabled />}
          />

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

      <Modal
        opened={activeHeaderModal === 'reprocessing'}
        onClose={closeHeaderModal}
        title="Marcar reproceso"
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
        <Stack gap="sm">
          <Text className={classes.modalText}>
            Esta iteración solo implementa la apertura visual del modal de reproceso.
          </Text>
          <Group justify="flex-end">
            <Button radius="xl" className={classes.staticButton} onClick={closeHeaderModal}>
              Cerrar
            </Button>
          </Group>
        </Stack>
      </Modal>

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

      <Modal
        opened={activeHeaderModal === 'report'}
        onClose={closeHeaderModal}
        title="Generar informe"
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
        <Stack gap="sm">
          <Text className={classes.modalText}>
            Este modal queda mock hasta tener el flujo reutilizable final del proyecto.
          </Text>
          <Group justify="flex-end">
            <Button radius="xl" className={classes.staticButton} onClick={closeHeaderModal}>
              Cerrar
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={activeHeaderModal === 'batch'}
        onClose={closeHeaderModal}
        title="Agregar a lote"
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
          <TextInput
            classNames={{
              label: classes.modalInputLabel,
              input: classes.modalInputField
            }}
            value={batchSearch}
            onChange={(event) => setBatchSearch(event.currentTarget.value)}
            placeholder="Buscar lote..."
            leftSection={<IconSearch size={14} />}
          />

          <div className={classes.batchList}>
            {filteredLotOptions.map((lot) => (
              <div key={lot.id} className={classes.batchOption}>
                <div>
                  <Text className={classes.batchOptionTitle}>{lot.label}</Text>
                  <Text className={classes.batchOptionMeta}>
                    {lot.regime} · {lot.cuitCount} CUITs
                  </Text>
                </div>
                <Button
                  variant="light"
                  color="blue"
                  radius="xl"
                  className={classes.staticButton}
                >
                  Seleccionar
                </Button>
              </div>
            ))}
          </div>
        </Stack>
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
            <Group justify="flex-end">
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeDeleteModal}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.deletePrimaryButton} ${classes.staticButton}`}
                onClick={confirmDeleteModal}
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
        {editKind ? (
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
            <Group justify="flex-end">
              <Button
                variant="default"
                radius="xl"
                className={`${classes.modalGhostButton} ${classes.staticButton}`}
                onClick={closeEditModal}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
                onClick={submitEditModal}
                disabled={!formValue?.trim()}
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
