import { Center, Loader, Modal, Stack, Text } from '@mantine/core'
import classes from './loaderPage.module.css'

type PageLoaderProps = {
  message?: string
}

type LoadingModalProps = {
  opened: boolean
  message?: string
}

export function PageLoader({
  message = 'Cargando datos...'
}: PageLoaderProps) {
  return (
    <Center className={classes.pageLoaderRoot}>
      <div className={classes.loaderContainer}>
        <Loader color='blue' />
        <Text size='sm' fw={500} c='#475569' ta='center'>
          {message}
        </Text>
      </div>
    </Center>
  )
}

export function LoadingModal({
  opened,
  message = 'Cargando datos...'
}: LoadingModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      size={360}
      radius={12}
    >
      <Stack align='center' gap='md' py='md'>
        <Loader color='blue' size='md' />

        <Text size='sm' fw={500} c='#475569' ta='center'>
          {message}
        </Text>
      </Stack>
    </Modal>
  )
}
