import { Center, Modal, Stack, Text } from '@mantine/core'
import Image from 'next/image'
import classes from './PageLoader.module.css'

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
        <Image
          src='/assets/branding/cross-modal-loader.svg'
          alt=''
          width={56}
          height={56}
          className={classes.spinner}
          aria-hidden='true'
        />
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
        <Image
          src='/assets/branding/cross-modal-loader.svg'
          alt=''
          width={56}
          height={56}
          className={classes.spinner}
          aria-hidden='true'
        />

        <Text size='sm' fw={500} c='#475569' ta='center'>
          {message}
        </Text>
      </Stack>
    </Modal>
  )
}
